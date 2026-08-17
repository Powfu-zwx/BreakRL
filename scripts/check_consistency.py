"""Read-only structural checks for the BreakRL repository.

Invariants:
- every chapter directory under notes/ holds exactly one main .tex (plus an
  optional *_en.tex English edition), a .pdf with the same stem, exactly one
  *_experiments.ipynb that parses, and three figure PDFs;
- a chapter's English assets are paired by basename, and the English
  notebook has the same cell order, code, and saved outputs as the Chinese
  notebook (only markdown is translated);
- figure environments use the [!htbp] convention and referenced graphics
  exist next to the .tex;
- _toc.yml chapter entries and chapter notebooks cover each other, and its
  root documents exist.
"""
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
FIGURE_ENVIRONMENT = re.compile(r"\\begin\{figure\}\[([^]]+)\]")
INCLUDE_GRAPHIC = re.compile(r"\\includegraphics(?:\[[^]]*\])?\{([^}]+)\}")
TOC_FILE_ENTRY = re.compile(r"^\s*-\s+file:\s+(\S+)", re.MULTILINE)


def chapter_dirs(root: Path = ROOT) -> list[Path]:
    notes = root / "notes"
    if not notes.is_dir():
        return []
    return sorted(path for path in notes.iterdir() if path.is_dir())


def _load_notebook(path: Path, nbformat: Any, errors: list[str], label: str) -> Any:
    try:
        return nbformat.read(path, as_version=4)
    except Exception as error:
        errors.append(f"invalid notebook {label}: {error}")
        return None


def check_chapters(root: Path = ROOT) -> list[str]:
    errors = []
    notes = root / "notes"
    if not notes.is_dir():
        return ["missing notes directory"]
    try:
        import nbformat
    except ImportError:
        return ["nbformat is required to validate notebooks"]

    for chapter in chapter_dirs(root):
        rel = chapter.relative_to(root)
        tex_files = sorted(chapter.glob("*.tex"))
        en_tex = [path for path in tex_files if path.stem.endswith("_en")]
        main_tex = [path for path in tex_files if not path.stem.endswith("_en")]
        if len(main_tex) != 1:
            errors.append(f"{rel}: expected exactly one main .tex, found {len(main_tex)}")
        if len(en_tex) > 1:
            errors.append(f"{rel}: expected at most one *_en.tex, found {len(en_tex)}")

        for tex in main_tex + en_tex:
            pdf = tex.with_suffix(".pdf")
            if not pdf.exists():
                errors.append(f"{rel}: missing chapter PDF {pdf.name}")

        notebooks = sorted(chapter.glob("*_experiments.ipynb"))
        if len(notebooks) != 1:
            errors.append(
                f"{rel}: expected exactly one *_experiments.ipynb, found {len(notebooks)}"
            )
        for path in notebooks:
            _load_notebook(path, nbformat, errors, str(path.relative_to(root)))

        figures = sorted(chapter.glob("fig*.pdf"))
        if len(figures) != 3:
            errors.append(f"{rel}: expected exactly three figure PDFs, found {len(figures)}")
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


def check_bilingual(root: Path = ROOT) -> list[str]:
    """Pair English assets by basename and compare notebook code and outputs."""
    errors = []
    try:
        import nbformat
    except ImportError:
        return ["nbformat is required to validate notebooks"]

    for chapter in chapter_dirs(root):
        rel = chapter.relative_to(root)
        cn_notebooks = sorted(chapter.glob("*_experiments.ipynb"))
        en_tex = sorted(chapter.glob("*_en.tex"))
        en_notebooks = sorted(chapter.glob("*_experiments_en.ipynb"))

        if not en_tex and not en_notebooks:
            continue

        for path in en_tex:
            base = path.stem.removesuffix("_en")
            cn_path = chapter / f"{base}_experiments.ipynb"
            en_path = chapter / f"{base}_experiments_en.ipynb"
            if not cn_path.exists():
                errors.append(f"{rel}: missing Chinese notebook {cn_path.name}")
            if not en_path.exists():
                errors.append(f"{rel}: missing English notebook {en_path.name}")
            if not cn_path.exists() or not en_path.exists():
                continue
            cn = _load_notebook(cn_path, nbformat, errors, str(cn_path.relative_to(root)))
            en = _load_notebook(en_path, nbformat, errors, str(en_path.relative_to(root)))
            if cn is not None and en is not None:
                _compare_notebooks(cn, en, rel, errors)

        for path in en_notebooks:
            base = path.stem.removesuffix("_experiments_en")
            expected_tex = chapter / f"{base}_en.tex"
            if not expected_tex.exists():
                errors.append(f"{rel}: English notebook has no paired TeX {expected_tex.name}")

        if len(en_tex) > 1:
            errors.append(f"{rel}: expected at most one *_en.tex, found {len(en_tex)}")
        if len(en_notebooks) > 1:
            errors.append(
                f"{rel}: expected at most one *_experiments_en.ipynb, found {len(en_notebooks)}"
            )
        if not cn_notebooks:
            errors.append(f"{rel}: English assets exist but the Chinese notebook is missing")
    return errors


def check_tex(root: Path = ROOT) -> list[str]:
    errors = []
    notes = root / "notes"
    if not notes.is_dir():
        return ["missing notes directory"]
    for path in sorted(notes.rglob("*.tex")):
        try:
            text = path.read_text(encoding="utf-8")
        except OSError as error:
            errors.append(f"{path.relative_to(root)}: cannot read TeX: {error}")
            continue
        for match in FIGURE_ENVIRONMENT.finditer(text):
            if match.group(1) != "!htbp":
                errors.append(
                    f"{path.relative_to(root)}: figure uses [{match.group(1)}], expected [!htbp]"
                )
        for match in INCLUDE_GRAPHIC.finditer(text):
            graphic = Path(match.group(1))
            if graphic.name.startswith("fig1_xxx"):
                continue
            if graphic.suffix:
                candidates = [path.parent / graphic]
            else:
                candidates = [
                    path.parent / f"{graphic}{suffix}" for suffix in (".pdf", ".png", ".jpg")
                ]
            if not any(candidate.exists() for candidate in candidates):
                errors.append(f"{path.relative_to(root)}: missing graphic {graphic}")
    return errors


def check_toc(root: Path = ROOT) -> list[str]:
    errors = []
    toc_path = root / "_toc.yml"
    if not toc_path.exists():
        return ["missing _toc.yml"]
    toc_text = toc_path.read_text(encoding="utf-8")
    entries = TOC_FILE_ENTRY.findall(toc_text)
    root_entry = re.search(r"^root:\s+(\S+)", toc_text, re.MULTILINE)
    if root_entry:
        entries.append(root_entry.group(1))
    else:
        errors.append("_toc.yml: missing root entry")

    toc_notebooks = set()
    for entry in entries:
        if entry.startswith("notes/"):
            source = root / f"{entry}.ipynb"
            toc_notebooks.add(source)
        else:
            source = root / f"{entry}.md"
        if not source.exists():
            errors.append(f"_toc.yml: missing source for entry {entry}")

    repo_notebooks = {
        notebook
        for chapter in chapter_dirs(root)
        for notebook in chapter.glob("*_experiments.ipynb")
    }
    for notebook in sorted(repo_notebooks - toc_notebooks):
        errors.append(f"_toc.yml: chapter notebook not listed: {notebook.relative_to(root)}")
    return errors


def main() -> int:
    errors = (
        check_chapters()
        + check_bilingual()
        + check_tex()
        + check_toc()
    )
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    chapters = chapter_dirs()
    tex_files = sorted((ROOT / "notes").rglob("*.tex"))
    notebooks = sorted((ROOT / "notes").rglob("*_experiments*.ipynb"))
    figures = sorted((ROOT / "notes").rglob("fig*.pdf"))
    print(
        f"validated {len(chapters)} chapters, {len(notebooks)} notebooks, "
        f"{len(tex_files)} TeX files, and {len(figures)} figures"
    )
    print("repository consistency: OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
