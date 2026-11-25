#!/usr/bin/env python3
"""
Edge TTS Neural Voice Synthesizer
Generates studio-quality human speech using Microsoft Neural Voices via edge-tts.
"""

import sys
import os
import argparse
import asyncio
import edge_tts

async def synthesize(text: str, voice: str, rate: str, pitch: str, output_path: str):
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    temp_path = f"{output_path}.tmp.{os.getpid()}.mp3"
    try:
        communicate = edge_tts.Communicate(
            text=text,
            voice=voice,
            rate=rate,
            pitch=pitch,
        )
        await communicate.save(temp_path)
        os.replace(temp_path, output_path)
    except Exception as e:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                pass
        raise e

def main():
    parser = argparse.ArgumentParser(description="Synthesize human speech using edge-tts")
    parser.add_argument("--text", default="", help="Text to speak")
    parser.add_argument("--text-file", default="", help="Path to file containing text to speak")
    parser.add_argument("--voice", default="en-IN-PrabhatNeural", help="Neural voice name")
    parser.add_argument("--rate", default="+0%", help="Speech rate adjustment like +5 percent")
    parser.add_argument("--pitch", default="+0Hz", help="Speech pitch adjustment like +2Hz")
    parser.add_argument("--output", required=True, help="Destination mp3 file path")

    args = parser.parse_args()

    spoken_text = args.text
    if args.text_file and os.path.exists(args.text_file):
        with open(args.text_file, "r", encoding="utf-8") as f:
            spoken_text = f.read()

    if not spoken_text.strip():
        sys.stderr.write("EdgeTTS Error: No text provided\n")
        sys.exit(1)

    try:
        asyncio.run(synthesize(spoken_text, args.voice, args.rate, args.pitch, args.output))
        sys.exit(0)
    except Exception as err:
        sys.stderr.write(f"EdgeTTS Error: {err}\n")
        sys.exit(1)

if __name__ == "__main__":
    main()
