"""Write the Colab bootstrap cell into every experiment notebook.

The cell source is owned by ``colab_setup.bootstrap_source``. Re-run this
script after changing that template. Idempotent: a notebook already carrying
the wanted cell is not written at all, so the diff of a no-op run is empty.
Only the first code cell is touched, so saved outputs stay as the reader
published them.
"""
from __future__ import annotations

import sys
from pathlib import Path

_TOOLS = Path(__file__).resolve().parent
if str(_TOOLS) not in sys.path:
    sys.path.insert(0, str(_TOOLS))

import nbformat

from chapters import LANGUAGES, load_chapters
from colab_setup import bootstrap_source
from paths import REPO_ROOT

BOOTSTRAP_TAGS = ["remove-cell"]


def _source_text(source: list[str] | str) -> str:
    if isinstance(source, list):
        return "".join(source)
    return source


def _is_bootstrap(source: str) -> bool:
    return source.lstrip().startswith("BREAKRL_CHAPTER = ")


def _bootstrap_cell(chapter: str):
    return nbformat.v4.new_code_cell(
        source=bootstrap_source(chapter).splitlines(keepends=True),
        metadata={"tags": list(BOOTSTRAP_TAGS)},
    )


def sync_notebook(path: Path, chapter: str) -> str:
    notebook = nbformat.read(path, as_version=4)
    wanted = bootstrap_source(chapter)
    index = next(
        (i for i, cell in enumerate(notebook.cells) if cell.cell_type == "code"), None
    )
    if index is None:
        raise ValueError(f"{path}: notebook has no code cell")
    cell = notebook.cells[index]
    current = _source_text(cell.source)

    if not _is_bootstrap(current):
        notebook.cells.insert(index, _bootstrap_cell(chapter))
        action = "inserted"
    elif current == wanted and cell.metadata.get("tags") == BOOTSTRAP_TAGS:
        return "unchanged"
    else:
        cell.source = wanted.splitlines(keepends=True)
        cell.metadata["tags"] = list(BOOTSTRAP_TAGS)
        action = "updated"

    # nbformat opens the file with newline translation on, which on Windows
    # would rewrite every line of the notebook as CRLF.
    with open(path, "w", encoding="utf-8", newline="\n") as handle:
        nbformat.write(notebook, handle)
    return action


def main() -> int:
    for chapter in load_chapters():
        for language in LANGUAGES:
            path = chapter.notebook(language)
            action = sync_notebook(path, chapter.slug)
            print(f"{action}: {path.relative_to(REPO_ROOT).as_posix()}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
