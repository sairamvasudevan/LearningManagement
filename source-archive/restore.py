#!/usr/bin/env python3
"""Rebuild and safely extract the packaged Problem Solving Lab source."""

from __future__ import annotations

import base64
import gzip
import hashlib
import io
import lzma
import tarfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE_DIR = ROOT / "source-archive"
EXPECTED_SHA256 = "fc5e69093734289a67a08e0c4e9cb0f13f3a83b4a480a4037df2e2715b86e86f"
PARTS = sorted(ARCHIVE_DIR.glob("platform.tar.xz.b64.part-*"))


def main() -> None:
    if len(PARTS) != 13:
        raise SystemExit(f"Expected 13 archive segments; found {len(PARTS)}.")

    encoded = b"".join(part.read_bytes().strip() for part in PARTS)
    try:
        xz_payload = base64.b64decode(encoded, validate=True)
    except Exception as exc:
        raise SystemExit(f"Archive segments are not valid Base64: {exc}") from exc

    actual = hashlib.sha256(xz_payload).hexdigest()
    if actual != EXPECTED_SHA256:
        raise SystemExit(
            "Archive integrity check failed. "
            f"Expected {EXPECTED_SHA256}, received {actual}."
        )

    try:
        gzip_payload = lzma.decompress(xz_payload)
        tar_payload = gzip.decompress(gzip_payload)
    except Exception as exc:
        raise SystemExit(f"Archive decompression failed: {exc}") from exc

    with tarfile.open(fileobj=io.BytesIO(tar_payload), mode="r:") as archive:
        members = archive.getmembers()
        for member in members:
            target = (ROOT / member.name).resolve()
            if target != ROOT and ROOT not in target.parents:
                raise SystemExit(f"Unsafe archive path rejected: {member.name}")
            if member.issym() or member.islnk() or member.isdev():
                raise SystemExit(f"Unsupported archive entry rejected: {member.name}")
        archive.extractall(ROOT, members=members)

    print("Source restored successfully to ./problem-solving-lab-platform/")


if __name__ == "__main__":
    main()
