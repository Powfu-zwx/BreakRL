"""Read-only structural checks for the BreakRL repository."""
from __future__ import annotations

import re
import sys
from pathlib import Path
from typing import Any

_TOOLS = Path(__file__).resolve().parent
if str(_TOOLS) not in sys.path:
    sys.path.insert(0, str(_TOOLS))

from chapters import LANGUAGES, load_chapters  # noqa: E402
from colab_setup import bootstrap_source  # noqa: E402
from paths import BOOK, NOTES, REPO_ROOT  # noqa: E402

INCLUDE_GRAPHIC = re.compile(r"\\includegraphics(?:\[[^]]*\])?\{([^}]+)\}")
TOC_FILE_ENTRY = re.compile(r"^\s*-\s+file:\s+(\S+)", re.MULTILINE)
MARKDOWN_LINK = re.compile(r"\]\(([^)\s]+)")
HTML_HREF = re.compile(r'href="([^"]+)"')

# The reader's entry path: the minimum demo, Failure Atlas #8, then the Offline
# RL chapter. Each of these pages restates it in its own markup, so the check
# asks for the link targets and leaves the wording around them to the author.
ENTRY_PAGES = (
    ("README.md", "failure-atlas.html"),
    ("README-en.md", "failure-atlas-en.html"),
    ("book/index.md", "failure-atlas.html"),
    ("book/index-en.md", "failure-atlas-en.html"),
)


def _cell_source(cell: Any) -> str:
    source = cell.source
    if isinstance(source, list):
        source = "".join(source)
    return source.replace("\r\n", "\n")


def _strip_tex_comments(text: str) -> str:
    """Drop TeX comments so commented-out source never drives a check.

    A percent sign starts a comment only when it is not escaped, so the
    backslashes immediately before it are counted: ``\\%`` renders a literal
    percent, while ``\\\\%`` (a line break followed by a comment) does not.
    """
    lines = []
    for line in text.splitlines():
        for index, char in enumerate(line):
            if char != "%":
                continue
            backslashes = 0
            cursor = index - 1
            while cursor >= 0 and line[cursor] == "\\":
                backslashes += 1
                cursor -= 1
            if backslashes % 2 == 0:
                line = line[:index]
                break
        lines.append(line)
    return "\n".join(lines)


def _load_notebook(path: Path, nbformat: Any, errors: list[str], label: str) -> Any:
    try:
        return nbformat.read(path, as_version=4)
    except Exception as error:
        errors.append(f"invalid notebook {label}: {error}")
        return None


def check_inventory() -> list[str]:
    """`book/chapters.yml` and the chapter directories must describe the same book."""
    errors = []
    chapters = load_chapters()
    declared = {chapter.slug for chapter in chapters}
    on_disk = {path.name for path in NOTES.iterdir() if path.is_dir()} if NOTES.is_dir() else set()
    for slug in sorted(declared - on_disk):
        errors.append(f"{NOTES.relative_to(REPO_ROOT).as_posix()}/{slug}: listed in chapters.yml but missing")
    for slug in sorted(on_disk - declared):
        errors.append(f"{NOTES.relative_to(REPO_ROOT).as_posix()}/{slug}: on disk but not listed in chapters.yml")

    for chapter in chapters:
        for language in LANGUAGES:
            for path in (chapter.tex(language), chapter.pdf(language), chapter.notebook(language)):
                if not path.is_file():
                    errors.append(f"{path.relative_to(REPO_ROOT).as_posix()}: listed in chapters.yml but missing")
    return errors


def check_notebooks() -> list[str]:
    errors = []
    try:
        import nbformat
    except ImportError:
        return ["nbformat is required to validate notebooks"]
    for chapter in load_chapters():
        for language in LANGUAGES:
            _load_notebook(
                chapter.notebook(language), nbformat, errors, str(chapter.notebook(language).relative_to(REPO_ROOT))
            )
    return errors


def _compare_notebooks(cn: Any, en: Any, rel: Path, errors: list[str]) -> None:
    cn_cells = list(cn.cells)
    en_cells = list(en.cells)
    if len(cn_cells) != len(en_cells):
        errors.append(
            f"{rel}: English notebook has {len(en_cells)} cells; "
            f"Chinese edition has {len(cn_cells)}"
        )

    cell_count = min(len(cn_cells), len(en_cells))
    cn_types = [cell.cell_type for cell in cn_cells[:cell_count]]
    en_types = [cell.cell_type for cell in en_cells[:cell_count]]
    if cn_types != en_types:
        errors.append(f"{rel}: English notebook cell order differs from the Chinese edition")

    cn_code = [cell.source for cell in cn_cells if cell.cell_type == "code"]
    en_code = [cell.source for cell in en_cells if cell.cell_type == "code"]
    if cn_code != en_code:
        errors.append(f"{rel}: English notebook code cells differ from the Chinese edition")

    for index, (cn_cell, en_cell) in enumerate(zip(cn_cells, en_cells)):
        if cn_cell.cell_type != "code" or en_cell.cell_type != "code":
            continue
        if cn_cell.get("outputs", []) != en_cell.get("outputs", []):
            errors.append(f"{rel}: saved outputs differ in code cell {index}")
            break


def check_bilingual() -> list[str]:
    """The English notebook is a translation of the Chinese one, not a second program."""
    errors = []
    try:
        import nbformat
    except ImportError:
        return ["nbformat is required to validate notebooks"]
    for chapter in load_chapters():
        rel = chapter.notebook("zh").relative_to(REPO_ROOT)
        cn = _load_notebook(chapter.notebook("zh"), nbformat, errors, str(rel))
        en = _load_notebook(chapter.notebook("en"), nbformat, errors, str(rel))
        if cn is not None and en is not None:
            _compare_notebooks(cn, en, rel, errors)
    return errors


def check_tex() -> list[str]:
    errors = []
    for path in sorted(NOTES.rglob("*.tex")):
        try:
            text = _strip_tex_comments(path.read_text(encoding="utf-8"))
        except OSError as error:
            errors.append(f"{path.relative_to(REPO_ROOT)}: cannot read TeX: {error}")
            continue
        for match in INCLUDE_GRAPHIC.finditer(text):
            graphic = Path(match.group(1))
            if graphic.suffix:
                candidates = [path.parent / graphic]
            else:
                candidates = [
                    path.parent / f"{graphic}{suffix}" for suffix in (".pdf", ".png", ".jpg")
                ]
            if not any(candidate.exists() for candidate in candidates):
                errors.append(f"{path.relative_to(REPO_ROOT)}: missing graphic {graphic}")
    return errors


def _resolve_toc_entry(entry: str) -> Path:
    if entry.startswith("notes/"):
        return NOTES / f"{entry.removeprefix('notes/')}.ipynb"
    return BOOK / f"{entry}.md"


def check_toc() -> list[str]:
    errors = []
    toc_path = BOOK / "_toc.yml"
    toc_label = toc_path.relative_to(REPO_ROOT).as_posix()
    if not toc_path.exists():
        return [f"missing {toc_label}"]
    toc_text = toc_path.read_text(encoding="utf-8")
    entries = TOC_FILE_ENTRY.findall(toc_text)
    root_entry = re.search(r"^root:\s+(\S+)", toc_text, re.MULTILINE)
    if root_entry:
        entries.append(root_entry.group(1))
    else:
        errors.append(f"{toc_label}: missing root entry")

    for entry in entries:
        source = _resolve_toc_entry(entry)
        if not source.exists():
            errors.append(f"{toc_label}: missing source for entry {entry}")
    return errors


def _link_targets(text: str) -> list[str]:
    """Every link target in a markdown document, raw HTML anchors included."""
    return MARKDOWN_LINK.findall(text) + HTML_HREF.findall(text)


def check_entry_path() -> list[str]:
    errors = []
    for name, atlas in ENTRY_PAGES:
        path = REPO_ROOT / name
        if not path.is_file():
            errors.append(f"missing entry page {name}")
            continue
        targets = _link_targets(path.read_text(encoding="utf-8"))
        wanted = {
            "the minimum demo": [t for t in targets if t.rstrip("/").endswith(("demo", "demo.html", "demo-en", "demo-en.html"))],
            f"{atlas}#atlas-8-offline-loss": [
                t for t in targets if t.endswith(f"{atlas}#atlas-8-offline-loss")
            ],
            "the Offline RL chapter": [t for t in targets if "offline-rl" in t],
        }
        for label, matches in wanted.items():
            if not matches:
                errors.append(f"{name}: entry path no longer links {label}")
    return errors


def check_catalog() -> list[str]:
    """The generated catalog blocks must match `book/chapters.yml` exactly."""
    import sync_pages

    errors = []
    chapters = load_chapters()
    for kind, pages in sync_pages.KINDS.items():
        for language, path in pages.items():
            rendered = sync_pages.render_table(chapters, language, kind)
            text = path.read_text(encoding="utf-8")
            if sync_pages.BEGIN not in text or sync_pages.END not in text:
                errors.append(f"{path.relative_to(REPO_ROOT).as_posix()}: missing {sync_pages.BEGIN} markers")
                continue
            if sync_pages.BLOCK.search(text).group(0) != rendered:
                errors.append(
                    f"{path.relative_to(REPO_ROOT).as_posix()}: chapter table is stale; run `python tools/sync_pages.py`"
                )
    toc_path = BOOK / "_toc.yml"
    if toc_path.read_text(encoding="utf-8") != sync_pages.render_toc(chapters):
        errors.append(f"{toc_path.relative_to(REPO_ROOT).as_posix()}: stale; run `python tools/sync_pages.py`")
    return errors


def check_colab_entry_points() -> list[str]:
    errors = []
    try:
        import nbformat
    except ImportError:
        return ["nbformat is required to validate notebooks"]
    for chapter in load_chapters():
        wanted = bootstrap_source(chapter.slug)
        for language in LANGUAGES:
            path = chapter.notebook(language)
            rel = path.relative_to(REPO_ROOT)
            notebook = _load_notebook(path, nbformat, errors, str(rel))
            if notebook is None:
                continue
            code_cells = [cell for cell in notebook.cells if cell.cell_type == "code"]
            if not code_cells:
                errors.append(f"{rel}: notebook has no code cells")
                continue
            actual = _cell_source(code_cells[0]).rstrip("\n")
            if actual != wanted.rstrip("\n"):
                errors.append(f"{rel}: first code cell is not the Colab bootstrap")
    return errors


def main() -> int:
    errors = (
        check_inventory()
        + check_notebooks()
        + check_bilingual()
        + check_tex()
        + check_toc()
        + check_entry_path()
        + check_catalog()
        + check_colab_entry_points()
    )
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    chapters = load_chapters()
    figures = sorted(NOTES.rglob("fig*.pdf"))
    print(
        f"validated {len(chapters)} chapters, {len(chapters) * len(LANGUAGES)} notebooks, "
        f"{len(chapters) * len(LANGUAGES)} TeX files, and {len(figures)} figures"
    )
    print("repository consistency: OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
