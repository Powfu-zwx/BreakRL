import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIGURE_ENVIRONMENT = re.compile(r"\\begin\{figure\}\[([^]]+)\]")
INCLUDE_GRAPHIC = re.compile(r"\\includegraphics(?:\[[^]]*\])?\{([^}]+)\}")


def check_notebooks() -> list[str]:
    errors = []
    try:
        import nbformat
    except ImportError:
        return ["nbformat is required to validate notebooks"]

    notebooks = sorted((ROOT / "notes").rglob("*.ipynb"))
    if len(notebooks) != 11:
        errors.append(f"expected 11 notebooks, found {len(notebooks)}")
    for path in notebooks:
        try:
            nbformat.read(path, as_version=4)
        except Exception as error:
            errors.append(f"invalid notebook {path.relative_to(ROOT)}: {error}")
    return errors


def check_tex() -> list[str]:
    errors = []
    tex_files = sorted((ROOT / "notes").rglob("*.tex"))
    for path in tex_files:
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


def main() -> int:
    errors = check_notebooks() + check_tex()
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    notebooks = sorted((ROOT / "notes").rglob("*.ipynb"))
    tex_files = sorted((ROOT / "notes").rglob("*.tex"))
    print(f"validated {len(notebooks)} notebooks and {len(tex_files)} TeX files")
    print("repository consistency: OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
