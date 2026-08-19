"""Write the Colab bootstrap cell into every experiment notebook.

The cell source is owned by ``colab_setup.bootstrap_source``. Re-run this
script after changing that template. Idempotent. Edits only the first code
cell so saved outputs keep their original JSON.
"""
from __future__ import annotations

import json
import sys
import uuid
from pathlib import Path

from check_consistency import chapter_dirs
from colab_setup import bootstrap_source

ROOT = Path(__file__).resolve().parents[1]
FIRST_CODE_CELL = '\n  {\n   "cell_type": "code",'
LEGACY_PIP_MARKERS = ("# !pip install gymnasium", "# If needed, uncomment")


def _source_text(source: list[str] | str) -> str:
    if isinstance(source, list):
        return "".join(source)
    return source


def _source_lines(text: str) -> list[str]:
    text = text.replace("\r\n", "\n")
    if not text.endswith("\n"):
        text += "\n"
    return text.splitlines(keepends=True)


def _is_bootstrap(source: str) -> bool:
    return source.lstrip().startswith("BREAKRL_CHAPTER = ")


def _is_legacy_pip_cell(source: str) -> bool:
    return any(marker in source for marker in LEGACY_PIP_MARKERS)


def _matching_brace(text: str, open_index: int) -> int:
    if text[open_index] != "{":
        raise ValueError("expected '{'")
    depth = 0
    in_string = False
    escape = False
    for index in range(open_index, len(text)):
        char = text[index]
        if in_string:
            if escape:
                escape = False
            elif char == "\\":
                escape = True
            elif char == '"':
                in_string = False
            continue
        if char == '"':
            in_string = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return index
    raise ValueError("unbalanced cell object")


def _first_code_span(text: str) -> tuple[int, int]:
    marker_at = text.find(FIRST_CODE_CELL)
    if marker_at < 0:
        raise ValueError("notebook has no code cell")
    brace = marker_at + len("\n  ")
    close = _matching_brace(text, brace)
    return marker_at + 1, close


def _format_cell(cell: dict) -> str:
    dumped = json.dumps(cell, indent=1, ensure_ascii=False)
    return "\n".join(f"  {line}" if line else line for line in dumped.splitlines())


def _bootstrap_cell(chapter: str, cell_id: str | None = None) -> dict:
    return {
        "cell_type": "code",
        "execution_count": None,
        "id": cell_id or uuid.uuid4().hex[:8],
        "metadata": {"tags": ["remove-cell"]},
        "outputs": [],
        "source": _source_lines(bootstrap_source(chapter)),
    }


def sync_notebook(path: Path, chapter: str) -> str:
    text = path.read_text(encoding="utf-8")
    notebook = json.loads(text)
    first_code = next(cell for cell in notebook["cells"] if cell.get("cell_type") == "code")
    current = _source_text(first_code.get("source", ""))
    wanted = _source_lines(bootstrap_source(chapter))
    start, close = _first_code_span(text)
    wanted_tags = ["remove-cell"]
    has_tag = first_code.get("metadata", {}).get("tags") == wanted_tags
    if _is_bootstrap(current):
        if _source_lines(current) == wanted and has_tag:
            return "unchanged"
        cell_id = first_code.get("id") or uuid.uuid4().hex[:8]
        block = _format_cell(_bootstrap_cell(chapter, cell_id=str(cell_id)))
        text = text[:start] + block + text[close + 1 :]
        action = "updated"
    elif _is_legacy_pip_cell(current):
        cell_id = first_code.get("id") or uuid.uuid4().hex[:8]
        block = _format_cell(_bootstrap_cell(chapter, cell_id=str(cell_id)))
        text = text[:start] + block + text[close + 1 :]
        action = "updated"
    else:
        block = _format_cell(_bootstrap_cell(chapter))
        text = text[: start - 1] + "\n" + block + "," + text[start - 1 :]
        action = "inserted"
    if not text.endswith("\n"):
        text += "\n"
    path.write_text(text, encoding="utf-8", newline="\n")
    return action


def main() -> int:
    for chapter in chapter_dirs(ROOT):
        for path in sorted(chapter.glob("*_experiments*.ipynb")):
            action = sync_notebook(path, chapter.name)
            print(f"{action}: {path.relative_to(ROOT).as_posix()}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
