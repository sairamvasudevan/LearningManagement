#!/usr/bin/env bash
# ==============================================================================
# Problem Solving Lab LMS - 24/7 Global Keep-Online Watchdog Daemon
# ==============================================================================
# This script:
# 1. Keeps your Mac awake and prevents sleep while running (using caffeinate).
# 2. Verifies the Next.js production server is running on localhost:3000.
# 3. Maintains a high-speed Cloudflare global tunnel without expiring.
# 4. Auto-detects session timeouts and immediately refreshes the global link.
# 5. Saves the active live link to LIVE_GLOBAL_URL.txt.
# ==============================================================================

set -eo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

URL_FILE="$APP_DIR/LIVE_GLOBAL_URL.txt"
LOG_DIR="$APP_DIR/data"
mkdir -p "$LOG_DIR"
TUNNEL_LOG="$LOG_DIR/tunnel_watchdog.log"
CLOUDFLARED_BIN="$HOME/.local/bin/cloudflared"

if [[ ! -x "$CLOUDFLARED_BIN" ]]; then
    echo "[!] cloudflared binary not found at $CLOUDFLARED_BIN"
    exit 1
fi

get_local_ip() {
    ip=$(ifconfig en0 2>/dev/null | awk '/inet / {print $2}')
    if [[ -z "$ip" ]]; then
        ip=$(ifconfig | awk '/inet / && $2 !~ /^127\./ {print $2; exit}')
    fi
    echo "${ip:-localhost}"
}

LOCAL_IP=$(get_local_ip)

echo "========================================================"
echo "  Problem Solving Lab LMS - Access Watchdog"
echo "========================================================"
echo "  Local Access : http://localhost:3000"
echo "  Health Check : http://localhost:3000/api/health"
echo "========================================================"

# Prevent macOS sleep while this script is running
caffeinate -s -w $$ &
CAFF_PID=$!

# Function to check Next.js health
check_server() {
    curl -s -f http://localhost:3000/api/health >/dev/null 2>&1
}

# Ensure Next.js is running
if ! check_server; then
    echo "[+] Starting Next.js production server..."
    nohup npm run start > "$LOG_DIR/nextjs.log" 2>&1 &
    for i in {1..15}; do
        sleep 1
        if check_server; then
            echo "[✓] Next.js server operational on port 3000."
            break
        fi
    done
    if ! check_server; then
        echo "[!] Failed to start Next.js server. Check $LOG_DIR/nextjs.log"
        exit 1
    fi
else
    echo "[✓] Next.js server is already running and healthy."
fi

# Cleanup on exit
cleanup() {
    echo -e "\n[+] Shutting down watchdog..."
    if [[ -n "$CAFF_PID" ]] && kill -0 "$CAFF_PID" 2>/dev/null; then
        kill "$CAFF_PID" 2>/dev/null || true
    fi
    if [[ -n "$CF_PID" ]] && kill -0 "$CF_PID" 2>/dev/null; then
        kill "$CF_PID" 2>/dev/null || true
    fi
    exit 0
}
trap cleanup SIGINT SIGTERM

echo "[+] Starting Global Edge Tunnel Supervisor..."

while true; do
    echo "[+] Requesting fresh Cloudflare edge tunnel..."
    "$CLOUDFLARED_BIN" tunnel --url http://localhost:3000 > "$TUNNEL_LOG" 2>&1 &
    CF_PID=$!

    # Wait for tunnel URL in log
    TUNNEL_URL=""
    for i in {1..30}; do
        sleep 1
        TUNNEL_URL=$(grep -o 'https://[-a-z0-9]*\.trycloudflare\.com' "$TUNNEL_LOG" | head -n 1 || true)
        if [[ -n "$TUNNEL_URL" ]]; then
            break
        fi
        if ! kill -0 "$CF_PID" 2>/dev/null; then
            echo "[!] cloudflared exited prematurely. Checking log:"
            tail -n 10 "$TUNNEL_LOG"
            break
        fi
    done

    if [[ -z "$TUNNEL_URL" ]]; then
        echo "[!] Failed to acquire tunnel URL. Retrying in 5s..."
        kill "$CF_PID" 2>/dev/null || true
        sleep 5
        continue
    fi

    # Save active URL to file
    cat <<EOF > "$URL_FILE"
=============================================================================
PROBLEM SOLVING LAB LMS - ACTIVE ACCESS POINTS
=============================================================================
Global Internet URL : $TUNNEL_URL
Local Classroom IP  : http://${LOCAL_IP}:3000
Health & Telemetry  : $TUNNEL_URL/api/monitoring
Updated At          : $(date -u +"%Y-%m-%dT%H:%M:%SZ")
=============================================================================
EOF

    echo "========================================================"
    echo "  [LIVE NOW] GLOBAL SHAREABLE URL:"
    echo "  >> $TUNNEL_URL <<"
    echo "========================================================"
    echo "  Local Classroom IP: http://${LOCAL_IP}:3000"
    echo "  Active info saved to: $URL_FILE"
    echo "  Monitoring health..."

    FAIL_COUNT=0
    # Health monitor loop
    while kill -0 "$CF_PID" 2>/dev/null; do
        sleep 20
        # Probe health endpoint through public tunnel using Cloudflare DoH to bypass local DNS caching
        if curl -s -f --doh-url https://1.1.1.1/dns-query --max-time 10 "$TUNNEL_URL/api/health" >/dev/null 2>&1 || \
           curl -s -f --max-time 10 "$TUNNEL_URL/api/health" >/dev/null 2>&1; then
            FAIL_COUNT=0
        else
            FAIL_COUNT=$((FAIL_COUNT + 1))
            echo "[!] Probe failed ($FAIL_COUNT/3) at $(date +"%T")"
            if [[ $FAIL_COUNT -ge 3 ]]; then
                echo "[!] Public tunnel unreachable 3 times in a row. Refreshing tunnel..."
                break
            fi
        fi

        # Check if log reports server-side tunnel invalidation
        if grep -q "Unauthorized: Tunnel not found" "$TUNNEL_LOG" 2>/dev/null; then
            echo "[!] Cloudflare reported tunnel expired. Refreshing tunnel..."
            break
        fi
    done

    # Terminate stalled tunnel and loop to spawn a fresh one
    echo "[+] Restarting tunnel instance..."
    kill "$CF_PID" 2>/dev/null || true
    wait "$CF_PID" 2>/dev/null || true
    sleep 2
done
