"""Single source of truth for repository layout paths."""
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
BOOK = REPO_ROOT / "book"
NOTES = BOOK / "notes"
BOOK_BUILD = BOOK / "_build" / "html"
NOTES_PREFIX = "book/notes"
