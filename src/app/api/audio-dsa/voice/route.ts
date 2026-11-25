import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const execFileAsync = promisify(execFile);

// Cache folder under data/audio-cache
const CACHE_DIR = path.join(process.cwd(), "data", "audio-cache");

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function cleanSpeechTextForNeural(raw: string): string {
  return raw
    .replace(/\*\*(.*?)\*\*/g, "$1") // remove markdown bold
    .replace(/\*(.*?)\*/g, "$1") // remove markdown italic
    .replace(/`([^`]+)`/g, "$1") // remove backticks
    .replace(/O\(\(V \+ E\) log V\)/g, "O of V plus E, times log V")
    .replace(/O\(V \+ E\)/g, "O of V plus E")
    .replace(/O\(n log n\)/gi, "O of n log n")
    .replace(/O\(n log K\)/gi, "O of n log K")
    .replace(/O\(n²\)|O\(n\^2\)/gi, "O of n squared")
    .replace(/O\(2ⁿ\)|O\(2\^n\)/gi, "exponential 2 to the power n")
    .replace(/O\(n!\)/gi, "factorial O of n")
    .replace(/O\(α\(n\)\)/gi, "inverse Ackermann near constant time")
    .replace(/O\(log n\)/gi, "O of log n")
    .replace(/O\(1\)/g, "constant time O of 1")
    .replace(/O\(n\)/gi, "linear time O of n")
    .replace(/10⁸|10\^8/g, "100 million")
    .replace(/10⁵|10\^5/g, "100 thousand")
    .replace(/arr\[i\]/gi, "array at index i")
    .replace(/arr\[low\]/gi, "array at index low")
    .replace(/arr\[high\]/gi, "array at index high")
    .replace(/a\[mid\]/gi, "array at index mid")
    .replace(/a\[low\+\+\]/gi, "array at low")
    .replace(/a\[high--\]/gi, "array at high")
    .replace(/low\+\+/gi, "low increment")
    .replace(/high--/gi, "high decrement")
    .replace(/mid\+\+/gi, "mid increment")
    .replace(/₹(\d+)/g, "$1 rupees")
    .replace(/\[₹(\d+)[^\]]*\]/g, "receipt list")
    .replace(/\[Small=0, Medium=1, Large=2\]/g, "Small, Medium, and Large")
    .replace(/pref\[i \+ 1\] = pref\[i\] \+ nums\[i\]/g, "prefix at i plus 1 equals prefix at i plus number at i")
    .replace(/pref\[R\] - pref\[L-1\]/g, "prefix at R minus prefix at L minus 1")
    .replace(/pref\[i\]/gi, "prefix at index i")
    .replace(/pref\[9\]/gi, "prefix at 9")
    .replace(/pref\[3\]/gi, "prefix at 3")
    .replace(/freq\[currSum - K\]/gi, "frequency of current sum minus K")
    .replace(/freq\[prefixSum\]/gi, "frequency of prefix sum")
    .replace(/freq\[0\] = 1/gi, "frequency of zero equals one")
    .replace(/\[L\.\.R\]/gi, "from L to R")
    .replace(/vector<vector<int>>&/g, "2D vector reference")
    .replace(/vector<int>&/g, "vector reference")
    .replace(/const vector<int>&/g, "constant vector reference")
    .replace(/const T&/g, "constant reference T")
    .replace(/LIFO/g, "Last In First Out, L I F O")
    .replace(/FIFO/g, "First In First Out, F I F O")
    .replace(/TLE/g, "T L E")
    .replace(/MLE/g, "M L E")
    .replace(/Ctrl\+Z/gi, "Control Z")
    .replace(/->/g, " to ")
    .replace(/<->/g, " connected with ")
    .replace(/<=/g, " less than or equal to ")
    .replace(/>=/g, " greater than or equal to ")
    .replace(/!=/g, " not equal to ")
    .replace(/==/g, " equals ")
    .replace(/\^/g, " XOR ")
    .replace(/—/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

const VOICE_MAP: Record<string, { voice: string; rate: string; pitch: string }> = {
  narrator: { voice: "en-IN-PrabhatNeural", rate: "+0%", pitch: "+0Hz" },
  character: { voice: "en-IN-PrabhatNeural", rate: "+3%", pitch: "+2Hz" },
  punchline: { voice: "en-IN-PrabhatNeural", rate: "+6%", pitch: "+3Hz" },
  mentor: { voice: "en-IN-NeerjaExpressiveNeural", rate: "-2%", pitch: "+0Hz" },
};

async function synthesizeGoogleFallback(cleaned: string, speaker: string): Promise<Buffer | null> {
  try {
    const lang = speaker === "mentor" ? "en-US" : "en-IN";
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(
      cleaned.slice(0, 190),
    )}`;
    const res = await fetch(ttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
      },
    });
    if (res.ok) {
      const arrayBuf = await res.arrayBuffer();
      return Buffer.from(arrayBuf);
    }
  } catch {
    // ignore
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawText = searchParams.get("text") || "";
    const speaker = searchParams.get("speaker") || "narrator";
    const requestedVoice = searchParams.get("voice") || "";

    if (!rawText.trim()) {
      return NextResponse.json({ error: "Missing text query parameter." }, { status: 400 });
    }

    const cleaned = cleanSpeechTextForNeural(rawText);
    const config = VOICE_MAP[speaker] || VOICE_MAP.narrator;
    const voiceName = requestedVoice || config.voice;
    const rate = config.rate;
    const pitch = config.pitch;

    // Cache key based on hash of text, voice, and audio properties
    const hash = crypto
      .createHash("sha256")
      .update(`${cleaned}::${voiceName}::${rate}::${pitch}`)
      .digest("hex");
    const cachedFilePath = path.join(CACHE_DIR, `${hash}.mp3`);

    // 1. Return from disk cache if already synthesized
    if (fs.existsSync(cachedFilePath)) {
      const cachedBuffer = fs.readFileSync(cachedFilePath);
      if (cachedBuffer.length > 500) {
        return new NextResponse(new Uint8Array(cachedBuffer), {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "Content-Length": String(cachedBuffer.length),
            "Cache-Control": "public, max-age=604800, immutable",
            "X-Voice-Source": "edge-tts-cached",
          },
        });
      }
    }

    // 2. Synthesize using edge-tts neural voice via Python script
    const scriptPath = path.join(process.cwd(), "scripts", "edge-tts-synthesize.py");
    try {
      await execFileAsync(
        "python3",
        [
          scriptPath,
          "--text",
          cleaned,
          "--voice",
          voiceName,
          "--rate",
          rate,
          "--pitch",
          pitch,
          "--output",
          cachedFilePath,
        ],
        { timeout: 15000 },
      );

      if (fs.existsSync(cachedFilePath)) {
        const audioBuffer = fs.readFileSync(cachedFilePath);
        return new NextResponse(new Uint8Array(audioBuffer), {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "Content-Length": String(audioBuffer.length),
            "Cache-Control": "public, max-age=604800, immutable",
            "X-Voice-Source": "edge-tts-neural",
          },
        });
      }
    } catch {
      // Fall through to fallback
    }

    // 3. Fallback to Google TTS if edge-tts fails
    const fallbackBuffer = await synthesizeGoogleFallback(cleaned, speaker);
    if (fallbackBuffer) {
      return new NextResponse(new Uint8Array(fallbackBuffer), {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": String(fallbackBuffer.length),
          "Cache-Control": "public, max-age=86400",
          "X-Voice-Source": "google-fallback",
        },
      });
    }

    return NextResponse.json(
      { error: "Could not synthesize natural voice online." },
      { status: 502 },
    );
  } catch {
    return NextResponse.json(
      { error: "Audio voice generation encountered a temporary error." },
      { status: 500 },
    );
  }
}
