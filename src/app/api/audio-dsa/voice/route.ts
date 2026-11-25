import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function cleanSpeechText(raw: string): string {
  return raw
    .replace(/`([^`]+)`/g, "$1")
    .replace(/O\(\(V \+ E\) log V\)/g, "O of V plus E, times log V")
    .replace(/O\(V \+ E\)/g, "O of V plus E")
    .replace(/O\(n log n\)/gi, "O of n log n")
    .replace(/O\(n log K\)/gi, "O of n log K")
    .replace(/O\(n²\)|O\(n\^2\)/gi, "O of n squared")
    .replace(/O\(2ⁿ\)|O\(2\^n\)/gi, "exponential 2 to the power n")
    .replace(/O\(n!\)/gi, "factorial O of n")
    .replace(/O\(α\(n\)\)/gi, "inverse Ackermann near constant time")
    .replace(/O\(log n\)/gi, "O of log n")
    .replace(/O\(1\)/g, "O of 1 constant time")
    .replace(/O\(n\)/gi, "O of n linear time")
    .replace(/10⁸|10\^8/g, "100 million")
    .replace(/10⁵|10\^5/g, "100 thousand")
    .replace(/arr\[i\]/gi, "array at i")
    .replace(/->/g, " to ")
    .replace(/<->/g, " connected with ")
    .replace(/<=/g, " less than or equal to ")
    .replace(/>=/g, " greater than or equal to ")
    .replace(/!=/g, " not equal to ")
    .replace(/==/g, " equals ")
    .replace(/\^/g, " XOR ")
    .replace(/—/g, ", ")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Splits text into chunks under 180 chars to avoid TTS length limits while keeping
 * sentences and natural speech pauses intact.
 */
function splitIntoNaturalPhrases(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+|\S+/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if ((current + " " + trimmed).trim().length <= 180) {
      current = (current + " " + trimmed).trim();
    } else {
      if (current) chunks.push(current);
      if (trimmed.length <= 180) {
        current = trimmed;
      } else {
        // Split by commas or semicolons
        const subParts = trimmed.split(/([,;:]\s+)/);
        let sub = "";
        for (const sp of subParts) {
          if ((sub + sp).length <= 180) {
            sub += sp;
          } else {
            if (sub.trim()) chunks.push(sub.trim());
            sub = sp.length <= 180 ? sp : sp.slice(0, 180);
          }
        }
        current = sub.trim();
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.filter((c) => c.length > 0);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawText = searchParams.get("text") || "";
    const speaker = searchParams.get("speaker") || "narrator";

    if (!rawText.trim()) {
      return NextResponse.json({ error: "Missing text query parameter." }, { status: 400 });
    }

    const cleaned = cleanSpeechText(rawText);
    const phrases = splitIntoNaturalPhrases(cleaned);

    // Pick natural voice profile depending on character
    // Indian English (en-IN) provides lively natural Indian college student cadence
    // US English (en-US) provides crisp mentor clarity
    const lang = speaker === "mentor" ? "en-US" : "en-IN";

    const buffers: Buffer[] = [];
    for (const phrase of phrases) {
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(
        phrase,
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
        buffers.push(Buffer.from(arrayBuf));
      }
    }

    if (buffers.length === 0) {
      return NextResponse.json(
        { error: "Could not synthesize natural voice online." },
        { status: 502 },
      );
    }

    const combined = Buffer.concat(buffers);

    return new NextResponse(combined, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(combined.length),
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Audio voice generation encountered a temporary error." },
      { status: 500 },
    );
  }
}
