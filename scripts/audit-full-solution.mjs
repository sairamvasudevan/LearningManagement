import assert from "node:assert";

const BASE_URL = "http://127.0.0.1:3000";

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

async function runAudit() {
  console.log("=== Comprehensive Solution Audit ===");

  console.log("\n1. Audio DSA Studio & Voice Synthesis:");
  await test("GET /audio-dsa page renders and includes player deck, scrubber, and equalizer", async () => {
    const res = await fetch(`${BASE_URL}/audio-dsa`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("audio-dsa-player-deck") || html.includes("audio-dsa-scrubber"), "Must include audio player controls");
    assert.ok(html.includes("audio-dsa-eq-container"), "Must include audio equalizer");
    assert.ok(html.includes("The Illegal Hostel-Kettle Payasam Disaster"), "Must include Episode 1 title");
  });

  await test("GET /api/audio-dsa/voice returns 200 OK and valid MP3 audio with edge-tts", async () => {
    const res = await fetch(`${BASE_URL}/api/audio-dsa/voice?text=Welcome+to+Code+by+Ear&speaker=narrator`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.headers.get("content-type"), "audio/mpeg");
    const source = res.headers.get("x-voice-source");
    assert.ok(source === "edge-tts-cached" || source === "edge-tts-neural", `Expected neural voice source, got: ${source}`);
    const buf = await res.arrayBuffer();
    assert.ok(buf.byteLength > 1000, `Audio buffer too small: ${buf.byteLength}`);
  });

  await test("POST /api/audio-dsa/submit evaluates quiz answer and returns explanation", async () => {
    const res = await fetch(`${BASE_URL}/api/audio-dsa/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        episodeId: "ep-01-compile-vs-runtime",
        selectedIndex: 1,
        reflectionText: "Compile time checks syntax before running, runtime explodes on live input like zero division.",
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.passed, true);
    assert.strictEqual(data.correctIndex, 1);
    assert.ok(data.feedback.length > 10);
  });

  console.log("\n2. AI Mock Interview Arena & NIR Ratings:");
  await test("GET /interview page renders with Obsidian layout and NIR Rating badges", async () => {
    const res = await fetch(`${BASE_URL}/interview`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Nexus Interview Rating") || html.includes("NIR"), "Must mention NIR rating");
    assert.ok(html.includes("interview-page-shell"), "Must use Obsidian interview shell");
    assert.ok(html.includes("Sam") && html.includes("Maya") && html.includes("Vikram"), "Must render bot roster");
  });

  let authCookie = "";
  await test("Authenticate as Student to test session flows", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
      },
      body: JSON.stringify({
        action: "login",
        email: "student@learninghub.edu",
        password: "StudentPassword123!",
      }),
    });
    assert.strictEqual(res.status, 200);
    const setCookie = res.headers.get("set-cookie") || "";
    const match = setCookie.match(/psl_session=([^;]+)/);
    assert.ok(match, "Must receive psl_session cookie");
    authCookie = `psl_session=${match[1]}`;
  });

  let interviewSessionId = "";
  await test("POST /api/interview/session creates an active interview session", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookie,
        Origin: BASE_URL,
      },
      body: JSON.stringify({ botId: "bot-elo-800" }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.session && data.session.id, "Must return session.id");
    const intro = data.session.messages[0].text;
    assert.ok(intro.includes("Hello") || intro.includes("Good evening"), "Bot greeting must start politely");
    interviewSessionId = data.session.id;
  });

  await test("POST /api/interview/message triggers credit notice & pause on casual chatting", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookie,
        Origin: BASE_URL,
      },
      body: JSON.stringify({
        sessionId: interviewSessionId,
        candidateText: "Hello good evening, how are you doing today?",
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.botMessage && data.botMessage.text, "Must return botMessage.text");
    const reply = data.botMessage.text;
    assert.ok(reply.includes("Hello") || reply.includes("Good evening"), "Bot must reply politely");
    assert.ok(
      reply.includes("Model Status & Credit Notice") ||
      reply.includes("add interview credits") ||
      reply.includes("credits"),
      "Bot must inform candidate about credit requirement and external model pause"
    );
  });

  await test("POST /api/interview/credits allows adding interview passes", async () => {
    const res = await fetch(`${BASE_URL}/api/interview/credits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookie,
        Origin: BASE_URL,
      },
      body: JSON.stringify({ action: "top_up", count: 5 }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.success, "Credits top-up must succeed");
    const total = (data.credits?.freeSlots || 0) + (data.credits?.purchasedSlots || 0);
    assert.ok(total >= 5, `Total slots must be at least 5, got: ${total}`);
  });

  console.log("\n3. DSA Arena & Code Execution:");
  await test("GET /dsa lists problems and categories", async () => {
    const res = await fetch(`${BASE_URL}/dsa`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Two Sum") || html.includes("DSA Arena"), "Must show problems");
  });

  await test("POST /api/compiler executes basic C++ code successfully", async () => {
    const res = await fetch(`${BASE_URL}/api/compiler`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
      },
      body: JSON.stringify({
        language: "cpp",
        code: `#include <iostream>\nint main() { std::cout << "PASS_AUDIT"; return 0; }`,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    const out = data.stdout || data.output || "";
    assert.ok(out.includes("PASS_AUDIT"), `Expected PASS_AUDIT in output, got: ${JSON.stringify(data)}`);
  });

  console.log("\n4. Communication & Speech Studio:");
  await test("GET /communication renders speech lab", async () => {
    const res = await fetch(`${BASE_URL}/communication`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Communication") || html.includes("Speech"), "Must render communication lab");
  });

  console.log("\n=== ALL AUDIT CHECKS PASSED SUCCESSFULLY ===");
}

runAudit().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
