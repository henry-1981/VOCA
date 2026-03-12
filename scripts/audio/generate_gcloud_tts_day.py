#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
import json
import subprocess
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
CONTENT_ROOT = ROOT / "src" / "content" / "books" / "bridge-voca-basic"
OUTPUT_ROOT = ROOT / "public" / "audio" / "tts" / "bridge-voca-basic"
PROJECT_CMD = ["gcloud", "config", "get-value", "project"]
TOKEN_CMD = ["gcloud", "auth", "application-default", "print-access-token"]
VOICE_NAME = "en-US-Chirp3-HD-Kore"
SPEAKING_RATE = 0.88
PITCH = 0.0


def read_day(day_number: int):
    path = CONTENT_ROOT / f"day-{day_number:03d}.json"
    return path, json.loads(path.read_text())


def get_project() -> str:
    return subprocess.check_output(PROJECT_CMD, text=True).strip()


def get_token() -> str:
    return subprocess.check_output(TOKEN_CMD, text=True).strip()


def synthesize(text: str, token: str, project: str) -> bytes:
    body = json.dumps(
        {
            "input": {"text": text},
            "voice": {
                "languageCode": "en-US",
                "name": VOICE_NAME
            },
            "audioConfig": {
                "audioEncoding": "MP3",
                "speakingRate": SPEAKING_RATE,
                "pitch": PITCH
            }
        }
    ).encode("utf-8")
    req = urllib.request.Request(
        "https://texttospeech.googleapis.com/v1/text:synthesize",
        data=body,
        headers={
            "Authorization": f"Bearer {token}",
            "x-goog-user-project": project,
            "Content-Type": "application/json"
        },
        method="POST"
    )
    with urllib.request.urlopen(req) as response:
        payload = json.loads(response.read().decode("utf-8"))
    return base64.b64decode(payload["audioContent"])


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("day", type=int)
    args = parser.parse_args()

    day_path, day = read_day(args.day)
    project = get_project()
    token = get_token()

    output_dir = OUTPUT_ROOT / f"day-{args.day:03d}"
    output_dir.mkdir(parents=True, exist_ok=True)

    generated = []
    for word in day["words"]:
      file_name = f"{word['order']:02d}-{word['id']}.mp3"
      output_path = output_dir / file_name
      audio_bytes = synthesize(word["english"], token, project)
      output_path.write_bytes(audio_bytes)
      word["audioMode"] = "mp3"
      word["audioUrl"] = f"/audio/tts/bridge-voca-basic/day-{args.day:03d}/{file_name}"
      generated.append(file_name)

    day_path.write_text(json.dumps(day, ensure_ascii=False, indent=2) + "\n")
    manifest_path = output_dir / "manifest.json"
    manifest_path.write_text(
      json.dumps(
        {
          "day": args.day,
          "voice": VOICE_NAME,
          "speakingRate": SPEAKING_RATE,
          "pitch": PITCH,
          "files": generated
        },
        ensure_ascii=False,
        indent=2
      )
      + "\n"
    )
    print(manifest_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
