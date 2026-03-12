#!/usr/bin/env python3
from __future__ import annotations

import base64
import json
import subprocess
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "public" / "audio" / "tts" / "compare"
PROJECT = subprocess.check_output(["gcloud", "config", "get-value", "project"], text=True).strip()
TOKEN = subprocess.check_output(["gcloud", "auth", "application-default", "print-access-token"], text=True).strip()
VOICE_NAME = "en-US-Chirp3-HD-Kore"

WORDS = ["adult", "generation", "gentleman"]

VARIANTS = {
    "baseline": {
        "input": lambda word: {"text": word},
        "speakingRate": 0.88,
        "pitch": 0.0,
    },
    "slow": {
        "input": lambda word: {"text": word},
        "speakingRate": 0.74,
        "pitch": 0.0,
    },
    "ssml_isolated": {
        "input": lambda word: {
            "ssml": f"<speak><break time='200ms'/><prosody rate='82%' pitch='-1st'>{word}</prosody><break time='350ms'/></speak>"
        },
        "speakingRate": 1.0,
        "pitch": 0.0,
    },
}


def synthesize(payload: dict) -> bytes:
    req = urllib.request.Request(
        "https://texttospeech.googleapis.com/v1/text:synthesize",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "x-goog-user-project": PROJECT,
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req) as response:
        obj = json.loads(response.read().decode("utf-8"))
    return base64.b64decode(obj["audioContent"])


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, dict[str, str]] = {}

    for word in WORDS:
        manifest[word] = {}
        for variant_name, variant in VARIANTS.items():
            payload = {
                "input": variant["input"](word),
                "voice": {
                    "languageCode": "en-US",
                    "name": VOICE_NAME,
                },
                "audioConfig": {
                    "audioEncoding": "MP3",
                    "speakingRate": variant["speakingRate"],
                    "pitch": variant["pitch"],
                },
            }
            audio = synthesize(payload)
            filename = f"{word}-{variant_name}.mp3"
            (OUT_DIR / filename).write_bytes(audio)
            manifest[word][variant_name] = filename

    (OUT_DIR / "manifest.json").write_text(
        json.dumps(
            {
                "voice": VOICE_NAME,
                "words": manifest,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n"
    )
    print(OUT_DIR / "manifest.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
