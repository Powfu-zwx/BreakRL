"""Materialize saved notebook image outputs for a no-execution book build."""
import base64
import hashlib
import json
import shutil
import sys
from pathlib import Path

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


# The site renders saved outputs, so a chapter PDF that a text page embeds
# inline must exist in the build; Jupyter Book copies linked files but not
# `<object data=...>` targets.
INLINE_CHAPTER_PDFS = (
    NOTES / "offline-rl" / "offline-rl.pdf",
    NOTES / "offline-rl" / "offline-rl_en.pdf",
)


def copy_inline_chapter_pdfs(outdir: Path) -> int:
    dest_dir = Path(outdir) / "notes" / "offline-rl"
    dest_dir.mkdir(parents=True, exist_ok=True)
    copied = 0
    for src in INLINE_CHAPTER_PDFS:
        if not src.is_file():
            raise FileNotFoundError(src)
        shutil.copy2(src, dest_dir / src.name)
        copied += 1
    return copied


def copy_inline_chapter_pdfs_on_build(app, exception):
    if exception:
        return
    copy_inline_chapter_pdfs(Path(app.outdir))


def setup(app):
    app.connect("builder-inited", prepare_build_assets)
    app.connect("build-finished", copy_inline_chapter_pdfs_on_build)
    return {
        "version": "1.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }


if __name__ == "__main__":
    print(f"prepared {prepare_assets()} saved notebook image assets")
