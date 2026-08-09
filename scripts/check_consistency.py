import hashlib
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RELEASE = ROOT / "release" / "fundamentals-v0.1"


def inventory(base: Path) -> dict[str, str]:
    return {
        path.relative_to(base).as_posix(): hashlib.sha256(path.read_bytes()).hexdigest()
        for path in sorted(base.rglob("*"))
        if path.is_file()
        and ".git" not in path.parts
        and path.name != "rl_note_template.tex"
    }


def main() -> int:
    source = inventory(ROOT / "notes")
    published = inventory(RELEASE / "notes")
    source_paths = set(source)
    published_paths = set(published)
    missing = sorted(source_paths - published_paths)
    extra = sorted(published_paths - source_paths)
    changed = sorted(path for path in source_paths & published_paths if source[path] != published[path])

    print(f"source files: {len(source)}")
    print(f"published files: {len(published)}")
    for label, paths in (("missing", missing), ("extra", extra), ("sha256 mismatch", changed)):
        for path in paths:
            print(f"{label}: {path}")

    if missing or extra or changed:
        return 1
    print("notes parity: OK (relative paths and SHA-256 match)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
