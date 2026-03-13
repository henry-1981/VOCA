#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_BOOK_ID = "bridge-voca-basic"
PROJECT_CMD = ["gcloud", "config", "get-value", "project"]
TOKEN_CMD = ["gcloud", "auth", "application-default", "print-access-token"]


def firestore_value(value):
    if value is None:
        return {"nullValue": None}
    if isinstance(value, bool):
        return {"booleanValue": value}
    if isinstance(value, int):
        return {"integerValue": str(value)}
    if isinstance(value, float):
        return {"doubleValue": value}
    if isinstance(value, str):
        return {"stringValue": value}
    if isinstance(value, list):
        return {"arrayValue": {"values": [firestore_value(item) for item in value]}}
    if isinstance(value, dict):
        return {
            "mapValue": {
                "fields": {key: firestore_value(item) for key, item in value.items()}
            }
        }
    raise TypeError(f"Unsupported Firestore value: {type(value)!r}")


def firestore_document_fields(payload: dict) -> dict:
    return {key: firestore_value(value) for key, value in payload.items()}


def get_project() -> str:
    return subprocess.check_output(PROJECT_CMD, text=True).strip()


def get_token() -> str:
    return subprocess.check_output(TOKEN_CMD, text=True).strip()


def content_root(book_id: str) -> Path:
    return ROOT / "src" / "content" / "books" / book_id


def iter_day_paths(book_id: str):
    return sorted(content_root(book_id).glob("day-*.json"))


def matches_selected_day(path: Path, selected_days: set[int]) -> bool:
    stem = path.stem

    if stem.endswith("-test"):
        stem = stem[:-5]

    try:
        day_number = int(stem.split("-")[1])
    except (IndexError, ValueError):
        return False

    return day_number in selected_days


def read_day_payload(path: Path) -> dict:
    payload = json.loads(path.read_text())

    if not payload.get("id"):
        raise ValueError(f"{path.name} is missing id")
    if not payload.get("bookId"):
        raise ValueError(f"{path.name} is missing bookId")
    if not payload.get("title"):
        raise ValueError(f"{path.name} is missing title")

    return payload


def firestore_document_url(project: str, book_id: str, day_id: str) -> str:
    document_path = f"contentBooks/{book_id}/days/{day_id}"
    encoded_path = "/".join(urllib.parse.quote(part, safe="") for part in document_path.split("/"))
    return (
        f"https://firestore.googleapis.com/v1/projects/{project}/databases/(default)/documents/"
        f"{encoded_path}"
    )


def upload_day(project: str, token: str, payload: dict, dry_run: bool) -> str:
    book_id = payload["bookId"]
    day_id = payload["id"]
    url = firestore_document_url(project, book_id, day_id)

    if dry_run:
        return url

    body = json.dumps({"fields": firestore_document_fields(payload)}).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=body,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        method="PATCH",
    )

    with urllib.request.urlopen(request) as response:
        json.loads(response.read().decode("utf-8"))

    return url


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Import local Bridge VOCA day JSON files into Firestore content documents."
    )
    parser.add_argument(
        "--book",
        default=DEFAULT_BOOK_ID,
        help=f"book id under src/content/books (default: {DEFAULT_BOOK_ID})",
    )
    parser.add_argument(
        "--day",
        type=int,
        action="append",
        dest="days",
        help="day number to import, e.g. --day 11 --day 12",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="import every day JSON for the selected book",
    )
    parser.add_argument(
        "--project",
        help="override the gcloud project id",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="print the Firestore document URLs without uploading",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if not args.all and not args.days:
        raise SystemExit("Provide --day <n> or --all.")

    root = content_root(args.book)
    if not root.exists():
        raise SystemExit(f"Content directory not found: {root}")

    selected_days = set(args.days or [])
    candidate_paths = list(iter_day_paths(args.book))

    if args.all:
        selected_paths = candidate_paths
    else:
        selected_paths = [
            path for path in candidate_paths if matches_selected_day(path, selected_days)
        ]

    if not selected_paths:
        raise SystemExit("No matching day JSON files found.")

    project = args.project or get_project()
    token = "" if args.dry_run else get_token()

    for path in selected_paths:
        payload = read_day_payload(path)
        document_url = upload_day(project, token, payload, args.dry_run)
        print(f"{path.name} -> {document_url}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
