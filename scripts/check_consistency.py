"""Read-only structural checks for the TESAURO repository.

Invariants:
- every chapter directory under notes/ holds exactly one .tex, a .pdf with
  the same stem, and exactly one *_experiments.ipynb that parses;
- figure environments use the [!htbp] convention and referenced graphics
  exist next to the .tex;
- _toc.yml chapter entries and chapter notebooks cover each other, and its
  root documents exist.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIGURE_ENVIRONMENT = re.compile(r"\\begin\{figure\}\[([^]]+)\]")
INCLUDE_GRAPHIC = re.compile(r"\\includegraphics(?:\[[^]]*\])?\{([^}]+)\}")
TOC_FILE_ENTRY = re.compile(r"^\s*-\s+file:\s+(\S+)", re.MULTILINE)


def chapter_dirs() -> list[Path]:
    return sorted(path for path in (ROOT / "notes").iterdir() if path.is_dir())


def check_chapters() -> list[str]:
    errors = []
    try:
        import nbformat
    except ImportError:
        return ["nbformat is required to validate notebooks"]

    for chapter in chapter_dirs():
        rel = chapter.relative_to(ROOT)
        tex_files = sorted(chapter.glob("*.tex"))
        if len(tex_files) != 1:
            errors.append(f"{rel}: expected exactly one .tex, found {len(tex_files)}")
        else:
            pdf = tex_files[0].with_suffix(".pdf")
            if not pdf.exists():
                errors.append(f"{rel}: missing chapter PDF {pdf.name}")

        notebooks = sorted(chapter.glob("*_experiments.ipynb"))
        if len(notebooks) != 1:
            errors.append(
                f"{rel}: expected exactly one *_experiments.ipynb, found {len(notebooks)}"
            )
        for path in notebooks:
            try:
                nbformat.read(path, as_version=4)
            except Exception as error:
                errors.append(f"invalid notebook {path.relative_to(ROOT)}: {error}")
    return errors


def check_tex() -> list[str]:
    errors = []
    for path in sorted((ROOT / "notes").rglob("*.tex")):
        text = path.read_text(encoding="utf-8")
        for match in FIGURE_ENVIRONMENT.finditer(text):
            if match.group(1) != "!htbp":
                errors.append(
                    f"{path.relative_to(ROOT)}: figure uses [{match.group(1)}], expected [!htbp]"
                )
        for match in INCLUDE_GRAPHIC.finditer(text):
            graphic = Path(match.group(1))
            if graphic.name.startswith("fig1_xxx"):
                continue
            if graphic.suffix:
                candidates = [path.parent / graphic]
            else:
                candidates = [path.parent / f"{graphic}{suffix}" for suffix in (".pdf", ".png", ".jpg")]
            if not any(candidate.exists() for candidate in candidates):
                errors.append(f"{path.relative_to(ROOT)}: missing graphic {graphic}")
    return errors


def check_toc() -> list[str]:
    errors = []
    toc_text = (ROOT / "_toc.yml").read_text(encoding="utf-8")
    entries = TOC_FILE_ENTRY.findall(toc_text)
    root_entry = re.search(r"^root:\s+(\S+)", toc_text, re.MULTILINE)
    if root_entry:
        entries.append(root_entry.group(1))

    toc_notebooks = set()
    for entry in entries:
        if entry.startswith("notes/"):
            source = ROOT / f"{entry}.ipynb"
            toc_notebooks.add(source)
        else:
            source = ROOT / f"{entry}.md"
        if not source.exists():
            errors.append(f"_toc.yml: missing source for entry {entry}")

    repo_notebooks = {
        notebook
        for chapter in chapter_dirs()
        for notebook in chapter.glob("*_experiments.ipynb")
    }
    for notebook in sorted(repo_notebooks - toc_notebooks):
        errors.append(f"_toc.yml: chapter notebook not listed: {notebook.relative_to(ROOT)}")
    return errors


def main() -> int:
    errors = check_chapters() + check_tex() + check_toc()
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    chapters = chapter_dirs()
    tex_files = sorted((ROOT / "notes").rglob("*.tex"))
    print(f"validated {len(chapters)} chapters and {len(tex_files)} TeX files")
    print("repository consistency: OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
