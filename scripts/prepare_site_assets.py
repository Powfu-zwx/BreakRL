"""Materialize saved notebook image outputs for a no-execution book build."""
import base64
import hashlib
import json
import sys
from pathlib import Path

_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))

from paths import BOOK, NOTES

OUTPUT_FOLDER = BOOK / "_build" / "jupyter_execute"
IMAGE_TYPES = {
    "image/png": ".png",
    "image/jpeg": ".jpeg",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "application/pdf": ".pdf",
}


def _output_bytes(mime_type: str, content: str | list[str]) -> bytes:
    if isinstance(content, list):
        content = "".join(content)
    if mime_type in {"image/png", "image/jpeg", "image/gif", "application/pdf"}:
        return base64.b64decode(content)
    return content.replace("\r\n", "\n").encode("utf-8")


def prepare_assets(output_folder: Path = OUTPUT_FOLDER) -> int:
    output_folder.mkdir(parents=True, exist_ok=True)
    written = 0
    for notebook in sorted(NOTES.rglob("*_experiments*.ipynb")):
        document = json.loads(notebook.read_text(encoding="utf-8"))
        for cell in document.get("cells", []):
            for output in cell.get("outputs", []):
                for mime_type, extension in IMAGE_TYPES.items():
                    content = output.get("data", {}).get(mime_type)
                    if not content:
                        continue
                    data = _output_bytes(mime_type, content)
                    target = output_folder / f"{hashlib.sha256(data).hexdigest()}{extension}"
                    if not target.exists():
                        target.write_bytes(data)
                        written += 1
    return written


def prepare_build_assets(app):
    prepare_assets(output_folder=Path(app.outdir).parent / "jupyter_execute")


def setup(app):
    app.connect("builder-inited", prepare_build_assets)
    return {
        "version": "1.0",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }


if __name__ == "__main__":
    print(f"prepared {prepare_assets()} saved notebook image assets")
