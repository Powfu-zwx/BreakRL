"""Place the assets the site links but Jupyter Book does not copy.

Saved notebook image outputs, which myst-nb resolves from disk by content hash
because the book is not executed, and the files pages embed as raw HTML, which
Jupyter Book only copies when a markdown link points at them.
"""
import base64
import hashlib
import json
import re
import shutil
import sys
from pathlib import Path
from urllib.parse import urlsplit

_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))

from paths import BOOK, NOTES

OUTPUT_FOLDER = BOOK / "_build" / "jupyter_execute"
# Each saved image MIME type carries both facts this module needs: the suffix of
# the file it writes, and whether nbformat stored the payload base64-encoded
# (everything binary) or as plain markup (``image/svg+xml``).
IMAGE_TYPES = {
    "image/png": (".png", True),
    "image/jpeg": (".jpeg", True),
    "image/gif": (".gif", True),
    "image/svg+xml": (".svg", False),
    "application/pdf": (".pdf", True),
}


def _output_bytes(content: str | list[str], *, base64_encoded: bool) -> bytes:
    if isinstance(content, list):
        content = "".join(content)
    if base64_encoded:
        return base64.b64decode(content)
    return content.replace("\r\n", "\n").encode("utf-8")


def prepare_assets(output_folder: Path = OUTPUT_FOLDER) -> int:
    """Write each saved image output as a content-addressed file.

    myst-nb runs with ``execute_notebooks: "off"`` and resolves notebook image
    outputs from this folder by the SHA-256 of the decoded bytes. The naming is
    an internal contract of the installed myst-nb version, so re-check it before
    upgrading ``jupyter-book``.
    """
    output_folder.mkdir(parents=True, exist_ok=True)
    written = 0
    for notebook in sorted(NOTES.rglob("*_experiments*.ipynb")):
        document = json.loads(notebook.read_text(encoding="utf-8"))
        for cell in document.get("cells", []):
            for output in cell.get("outputs", []):
                for mime_type, (suffix, base64_encoded) in IMAGE_TYPES.items():
                    content = output.get("data", {}).get(mime_type)
                    if not content:
                        continue
                    data = _output_bytes(content, base64_encoded=base64_encoded)
                    target = output_folder / f"{hashlib.sha256(data).hexdigest()}{suffix}"
                    if not target.exists():
                        target.write_bytes(data)
                        written += 1
    return written


def prepare_build_assets(app):
    prepare_assets(output_folder=Path(app.outdir).parent / "jupyter_execute")


# A page that embeds a file with `<object data=...>` gets no help from Jupyter
# Book: it rewrites markdown links into `_downloads/` and copies the target, but
# leaves raw HTML alone. The embedded files therefore have to be found in the
# pages and copied to the path the page names.
INLINE_OBJECT = re.compile(r"<object[^>]*\sdata=\"([^\"]+)\"")


def inline_assets() -> list[Path]:
    found = set()
    for page in sorted(BOOK.rglob("*.md")):
        if "_build" in page.parts:
            continue
        for target in INLINE_OBJECT.findall(page.read_text(encoding="utf-8")):
            parsed = urlsplit(target)
            if parsed.scheme or parsed.netloc or parsed.path.startswith("/"):
                continue
            asset = (page.parent / parsed.path).resolve()
            if asset.is_file() and asset.is_relative_to(BOOK):
                found.add(asset)
    return sorted(found)


def copy_inline_assets(outdir: Path) -> int:
    copied = 0
    for src in inline_assets():
        dest = Path(outdir) / src.relative_to(BOOK)
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)
        copied += 1
    return copied


def copy_inline_assets_on_build(app, exception):
    if exception:
        return
    copy_inline_assets(Path(app.outdir))


def setup(app):
    app.connect("builder-inited", prepare_build_assets)
    app.connect("build-finished", copy_inline_assets_on_build)
    return {
        "version": "1.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }


if __name__ == "__main__":
    print(f"prepared {prepare_assets()} saved notebook image assets")
