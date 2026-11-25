# High-Scale Global Architecture: 10,000 Concurrent Users & 50,000 Submit Bursts

## 1. Why Most LMS / Coding Platforms Fail at 50k Bursts
Naively running `spawnSync` inside synchronous HTTP handlers causes:
- **Node Event Loop Freeze:** Synchronous child process execution halts all incoming HTTP requests across all 10,000 users.
- **HTTP Gateway 504 Timeouts:** Holding 50,000 TCP sockets open while C++/Java compiles exhausts reverse-proxy connections and file descriptors.
- **CPU Thrash:** Spawning thousands of native `clang++` / `javac` / `python3` compilers concurrently causes OS OOM kills and context-switch storms.
- **Duplicate Compute Waste:** During a live contest or class quiz, thousands of students submit identical boilerplate or identical reference solutions repeatedly.

---

## 2. Implemented Core Architecture (In-Repo)

### A. Non-Blocking Execution Core ([src/lib/compiler.ts](../src/lib/compiler.ts))
- Replaced blocking `spawnSync` calls with truly asynchronous `spawnAsync()` (`node:child_process` `spawn`) plus `SIGKILL` timers, `64 KB` stdout/stderr truncation guards, and async `fs.promises.rm` cleanup.
- Cached SDK path, Java binary, and C/C++ compiler lookups (`clang`/`gcc`, `clang++`/`g++`) across executions.
- Added burst `stopOnFirstFailure` option so large submission waves fail fast on hidden case failures.
- Added round-robin + `15s` circuit-breaker failover (`tryRemoteDispatch`) across external `JUDGE_WORKER_URLS`.

### B. Bounded 2-Lane Priority Queue & SHA-256 Deduplication ([src/lib/execution-queue.ts](../src/lib/execution-queue.ts))
- **L1/L2 SHA-256 Content-Addressable Cache:** Normalizes whitespace/line-endings and hashes `(problemId, language, code, testCaseCount)`. L1 holds `4,000` hot results in RAM (`<1ms` hit); L2 persists results in SQLite `execution_cache` (`<3ms` hit).
- **2-Lane Priority Scheduler:** Priority `1` fast-lane (`Run Code`) jumps ahead of Priority `2` (`Submit Solution`) so interactive runs remain snappy while `MAX_EXECUTION_QUEUE_DEPTH` (`50,000` default) absorbs massive spikes smoothly.
- **Adaptive Burst Fail-Fast:** When `judgeLane.length >= 25`, `dispatchDsaSubmission` automatically activates `stopOnFirstFailure: true` to double throughput on wrong/TLE submissions.
- **Per-User/IP Token Bucket Rate Limiter:** Capacity `25`, refill `2/s` keyed by `userId` (or session/IP), returning HTTP `429` with `Retry-After` only to abusive callers without penalizing other students.

### C. HTTP `202` Async Dispatch & Client Polling
- `POST /api/compiler` and `POST /api/dsa/submit` accept `{ async: true }`:
  - **Cache hit:** Returns HTTP `200` immediately in one round-trip (`cached: true`).
  - **Cache miss:** Enqueues job in O(1) and frees the HTTP socket immediately with HTTP `202` `{ queued: true, jobId, queuePosition, queueDepth, estimatedWaitMs }`.
- `GET /api/execution/jobs/[jobId]` enforces owner/admin authorization (`403` cross-user guard) and returns live status until `COMPLETED` / `FAILED`.
- Client helper ([src/lib/execution-client.ts](../src/lib/execution-client.ts)) polls with bounded exponential backoff (`150ms -> 800ms`) in both [src/components/dsa-code-arena.tsx](../src/components/dsa-code-arena.tsx) and [src/components/standalone-ide.tsx](../src/components/standalone-ide.tsx).

### D. Stateless Horizontal Judge Worker Pool ([scripts/judge-worker.mjs](../scripts/judge-worker.mjs))
- Zero-dependency Node HTTP worker exposing `GET /health` and `POST /execute` protected by optional `Bearer ${JUDGE_WORKER_SECRET}` (`crypto.timingSafeEqual`).
- Horizontally scales independently of the web tier using [docker-compose.scale.yml](../docker-compose.scale.yml) and [deploy/nginx.scale.conf](../deploy/nginx.scale.conf).

---

## 3. Capacity Math: Localhost vs. Global 10k / 50k Deployment

| Dimension | Single Local Laptop (Current Offline Mode) | Global Multi-Node Cluster (`docker-compose.scale.yml` + Cloud DB/Redis) |
|---|---|---|
| **Loopback / Host Guard** | Locked to `127.0.0.1` / `localhost` when `ALLOWED_HOSTS` is unset | `ALLOWED_HOSTS` set to production domains behind NGINX/Cloudflare |
| **HTTP Request Handling** | Non-blocking async + `202` polling | Multi-replica Next.js behind NGINX (`least_conn`, `16,384` connections/worker) |
| **CPU Execution Slots** | Bounded `MAX_EXECUTION_WORKERS` (`CPU - 1`, capped `2-8`) | Elastic pool of isolated `judge-worker` pods (`pids_limit=128`, `cap_drop=ALL`) |
| **50,000 Submit Burst Drain Time** | Queue absorbs burst without crashing HTTP server; execution speed is strictly bounded by local laptop cores | With `65–85%` boilerplate/repeat cache hit rate (~7.5k–17.5k unique compiles), `120–200` vCPUs across worker pods drain 50k submits in ~25–35s |
| **Web IDE (HTML/CSS/JS)** | Zero server load (client browser `<iframe sandbox>`) | Zero server load regardless of user count |

---

## 4. Production Multi-Region Cloud Upgrade Path (Beyond Single-Node)
1. **Shared Database:** Point application persistence at managed PostgreSQL (or Supabase + PgBouncer transaction pooling) for multi-replica writes instead of single-host SQLite.
2. **Distributed Job Store & Cache:** Promote `execution_jobs` Map and L2 `execution_cache` to Redis (BullMQ + Redis hashes) so any `web` replica can serve `/api/execution/jobs/[jobId]` polls triggered by any other replica.
3. **Host OS / VM Isolation:** Run untrusted `judge-worker` containers on dedicated ephemeral worker nodes with gVisor/Firecracker (`runsc`) or AWS Fargate/Fly Machines alongside Kubernetes HPA autoscaling on queue depth.
