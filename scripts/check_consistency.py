"""Read-only structural checks for the BreakRL repository."""
import re
import sys
from pathlib import Path
from typing import Any

from paths import BOOK, NOTES, REPO_ROOT

_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))

FIGURE_ENVIRONMENT = re.compile(r"\\begin\{figure\}\[([^]]+)\]")
INCLUDE_GRAPHIC = re.compile(r"\\includegraphics(?:\[[^]]*\])?\{([^}]+)\}")
TOC_FILE_ENTRY = re.compile(r"^\s*-\s+file:\s+(\S+)", re.MULTILINE)
MARKDOWN_LINK = re.compile(r"\]\(([^)\s]+)")
HTML_HREF = re.compile(r'href="([^"]+)"')

# The reader's entry path: the minimum demo, Failure Atlas #8, then the Offline
# RL chapter. Each of these pages restates it in its own markup, so the check
# asks for the link targets and leaves the wording around them to the author.
# It is a page-level check: it says the path is still offered, not where.
ENTRY_PAGES = (
    ("README.md", "failure-atlas-en.html"),
    ("README.zh.md", "failure-atlas.html"),
    ("book/index.md", "failure-atlas-en.html"),
    ("book/index-zh.md", "failure-atlas.html"),
)


def chapter_dirs() -> list[Path]:
    if not NOTES.is_dir():
        return []
    return sorted(path for path in NOTES.iterdir() if path.is_dir())


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


def check_chapters() -> list[str]:
    errors = []
    if not NOTES.is_dir():
        return [f"missing {NOTES.relative_to(REPO_ROOT).as_posix()} directory"]
    try:
        import nbformat
    except ImportError:
        return ["nbformat is required to validate notebooks"]

    for chapter in chapter_dirs():
        rel = chapter.relative_to(REPO_ROOT)
        for tex in sorted(chapter.glob("*.tex")):
            pdf = tex.with_suffix(".pdf")
            if not pdf.exists():
                errors.append(f"{rel}: missing chapter PDF {pdf.name}")

        for path in sorted(chapter.glob("*_experiments*.ipynb")):
            _load_notebook(path, nbformat, errors, str(path.relative_to(REPO_ROOT)))
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


def _paired_edition(path: Path) -> Path:
    """Return the same asset in the other language edition.

    Chapters ship two editions of every tex and notebook and name them
    ``<name>`` (Chinese) and ``<name>_en`` (English). The site's language toggle
    derives its links from that convention, so both editions must exist.
    """
    stem = path.stem
    twin = stem.removesuffix("_en") if stem.endswith("_en") else f"{stem}_en"
    return path.with_name(f"{twin}{path.suffix}")


def check_bilingual() -> list[str]:
    errors = []
    try:
        import nbformat
    except ImportError:
        return ["nbformat is required to validate notebooks"]

    for chapter in chapter_dirs():
        rel = chapter.relative_to(REPO_ROOT)
        for pattern in ("*.tex", "*_experiments*.ipynb"):
            for path in sorted(chapter.glob(pattern)):
                twin = _paired_edition(path)
                if not twin.exists():
                    errors.append(f"{rel}: {path.name} has no paired edition {twin.name}")

        for cn_path in sorted(chapter.glob("*_experiments.ipynb")):
            en_path = _paired_edition(cn_path)
            if not en_path.exists():
                continue
            cn = _load_notebook(cn_path, nbformat, errors, str(cn_path.relative_to(REPO_ROOT)))
            en = _load_notebook(en_path, nbformat, errors, str(en_path.relative_to(REPO_ROOT)))
            if cn is not None and en is not None:
                _compare_notebooks(cn, en, rel, errors)
    return errors


def check_tex() -> list[str]:
    errors = []
    if not NOTES.is_dir():
        return [f"missing {NOTES.relative_to(REPO_ROOT).as_posix()} directory"]
    for path in sorted(NOTES.rglob("*.tex")):
        try:
            text = _strip_tex_comments(path.read_text(encoding="utf-8"))
        except OSError as error:
            errors.append(f"{path.relative_to(REPO_ROOT)}: cannot read TeX: {error}")
            continue
        for match in FIGURE_ENVIRONMENT.finditer(text):
            if match.group(1) != "!htbp":
                errors.append(
                    f"{path.relative_to(REPO_ROOT)}: figure uses [{match.group(1)}], expected [!htbp]"
                )
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
            "the minimum demo": [t for t in targets if t.rstrip("/").endswith(("demo", "demo.html"))],
            f"{atlas}#atlas-8-offline-loss": [
                t for t in targets if t.endswith(f"{atlas}#atlas-8-offline-loss")
            ],
            "the Offline RL chapter": [t for t in targets if "offline-rl" in t],
        }
        for label, matches in wanted.items():
            if not matches:
                errors.append(f"{name}: entry path no longer links {label}")
    return errors


def check_colab_entry_points() -> list[str]:
    from colab_setup import bootstrap_source, colab_notebook_url

    errors = []
    try:
        import nbformat
    except ImportError:
        return ["nbformat is required to validate notebooks"]

    readme_en = (REPO_ROOT / "README.md").read_text(encoding="utf-8")
    readme_zh = (REPO_ROOT / "README.zh.md").read_text(encoding="utf-8")
    index_en = (BOOK / "index.md").read_text(encoding="utf-8")
    index_zh = (BOOK / "index-zh.md").read_text(encoding="utf-8")
    index_en_label = (BOOK / "index.md").relative_to(REPO_ROOT).as_posix()
    index_zh_label = (BOOK / "index-zh.md").relative_to(REPO_ROOT).as_posix()
    for chapter in chapter_dirs():
        wanted = bootstrap_source(chapter.name)
        for path in sorted(chapter.glob("*_experiments*.ipynb")):
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
            url = colab_notebook_url(rel.as_posix())
            if path.name.endswith("_experiments_en.ipynb"):
                if url not in readme_en:
                    errors.append(f"README.md: missing Colab URL for {rel.as_posix()}")
                if url not in index_en:
                    errors.append(f"{index_en_label}: missing Colab URL for {rel.as_posix()}")
            else:
                if url not in readme_zh:
                    errors.append(f"README.zh.md: missing Colab URL for {rel.as_posix()}")
                if url not in index_zh:
                    errors.append(f"{index_zh_label}: missing Colab URL for {rel.as_posix()}")
    return errors


def main() -> int:
    errors = (
        check_chapters()
        + check_bilingual()
        + check_tex()
        + check_toc()
        + check_entry_path()
        + check_colab_entry_points()
    )
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    chapters = chapter_dirs()
    tex_files = sorted(NOTES.rglob("*.tex"))
    notebooks = sorted(NOTES.rglob("*_experiments*.ipynb"))
    figures = sorted(NOTES.rglob("fig*.pdf"))
    print(
        f"validated {len(chapters)} chapters, {len(notebooks)} notebooks, "
        f"{len(tex_files)} TeX files, and {len(figures)} figures"
    )
    print("repository consistency: OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
