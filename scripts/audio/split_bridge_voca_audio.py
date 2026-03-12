#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
ZIP_PATH = Path("/Users/hb/Project/BrideVOCA/브릿지보카_Basic_mp3.zip")
OUTPUT_ROOT = ROOT / "public" / "audio" / "generated" / "bridge-voca-basic"
LONG_SILENCE_THRESHOLD = 1.2


def extract_day_tracks(day_number: int, temp_dir: Path) -> list[Path]:
    prefix = f"Day{day_number:02d}_"
    with zipfile.ZipFile(ZIP_PATH) as archive:
        names = [name for name in archive.namelist() if name.startswith(prefix)]
        for name in names:
            archive.extract(name, temp_dir)
        return [temp_dir / name for name in names]


def detect_boundaries(audio_path: Path) -> list[tuple[float, float]]:
    result = subprocess.run(
        [
            "ffmpeg",
            "-i",
            str(audio_path),
            "-af",
            "silencedetect=noise=-30dB:d=0.35",
            "-f",
            "null",
            "-"
        ],
        capture_output=True,
        text=True,
        check=False
    )
    lines = result.stderr.splitlines()
    silence_starts = []
    silence_ends = []
    for line in lines:
        if "silence_start:" in line:
            silence_starts.append(float(line.split("silence_start:")[1].strip()))
        if "silence_end:" in line:
            match = re.search(r"silence_end:\s*([0-9.]+)", line)
            if match:
                silence_ends.append(float(match.group(1)))

    boundaries = []
    previous_end = 0.0
    for start, end in zip(silence_starts, silence_ends):
        if start - previous_end > LONG_SILENCE_THRESHOLD:
            boundaries.append((previous_end, start))
        previous_end = end

    probe = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(audio_path)
        ],
        capture_output=True,
        text=True,
        check=True
    )
    duration = float(probe.stdout.strip())
    if duration - previous_end > 0.5:
        boundaries.append((previous_end, duration))

    return boundaries


def export_segments(audio_path: Path, boundaries: list[tuple[float, float]], output_dir: Path) -> list[str]:
    output_dir.mkdir(parents=True, exist_ok=True)
    exported = []
    for index, (start, end) in enumerate(boundaries, start=1):
        if end - start < 0.6:
            continue
        output_path = output_dir / f"{audio_path.stem}_{index:02d}.mp3"
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(audio_path),
                "-ss",
                f"{start:.3f}",
                "-to",
                f"{end:.3f}",
                "-c",
                "copy",
                str(output_path)
            ],
            capture_output=True,
            text=True,
            check=True
        )
        exported.append(output_path.name)
    return exported


def main() -> int:
    if len(sys.argv) != 2:
      print("usage: split_bridge_voca_audio.py <day-number>")
      return 1

    day_number = int(sys.argv[1])
    with tempfile.TemporaryDirectory(prefix="bridge-audio-") as temp:
        temp_dir = Path(temp)
        tracks = extract_day_tracks(day_number, temp_dir)
        if not tracks:
            print(f"no tracks found for day {day_number}")
            return 1

        manifest = {"day": day_number, "tracks": []}
        day_dir = OUTPUT_ROOT / f"day-{day_number:03d}"

        for track in tracks:
            boundaries = detect_boundaries(track)
            exported = export_segments(track, boundaries, day_dir)
            manifest["tracks"].append(
                {
                    "source": track.name,
                    "segments": exported,
                    "count": len(exported)
                }
            )

        manifest_path = day_dir / "manifest.json"
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
        print(manifest_path)
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
