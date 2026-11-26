import fs from "fs";
import path from "path";

async function run() {
  const fileA = fs.readFileSync(path.join(process.cwd(), "src/lib/audio-dsa-season-a.ts"), "utf-8");
  const fileB = fs.readFileSync(path.join(process.cwd(), "src/lib/audio-dsa-season-b.ts"), "utf-8");
  
  const regex = /speaker:\s*"([^"]+)",[\s\S]*?text:\s*"([^"]+)"/g;
  let match;
  const segments = [];
  
  while ((match = regex.exec(fileA)) !== null) {
    segments.push({ speaker: match[1], text: match[2] });
  }
  while ((match = regex.exec(fileB)) !== null) {
    segments.push({ speaker: match[1], text: match[2] });
  }

  console.log(`Total episodes segments to verify & cache: ${segments.length}`);

  let cachedCount = 0;
  let freshCount = 0;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const url = `http://127.0.0.1:3000/api/audio-dsa/voice?text=${encodeURIComponent(seg.text)}&speaker=${encodeURIComponent(seg.speaker)}`;
    try {
      const res = await fetch(url);
      const source = res.headers.get("x-voice-source") || "unknown";
      if (source.includes("cached")) {
        cachedCount++;
      } else {
        freshCount++;
      }
      if ((i + 1) % 10 === 0 || i === segments.length - 1) {
        console.log(`Progress: [${i + 1}/${segments.length}] - Cached: ${cachedCount}, Fresh: ${freshCount}`);
      }
    } catch (err) {
      console.error(`Segment ${i + 1} Error:`, err.message);
    }
  }

  console.log(`Pre-caching complete! Total: ${segments.length} (Cached: ${cachedCount}, Fresh: ${freshCount})`);
}

run();
