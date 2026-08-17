"""Materialize saved notebook image outputs for a no-execution site build."""
import base64
import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_FOLDER = ROOT / "_build" / "jupyter_execute"
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


def prepare_assets(root: Path = ROOT, output_folder: Path = OUTPUT_FOLDER) -> int:
    output_folder.mkdir(parents=True, exist_ok=True)
    written = 0
    for notebook in sorted((root / "notes").rglob("*_experiments*.ipynb")):
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
    prepare_assets(
        root=Path(app.srcdir),
        output_folder=Path(app.outdir).parent / "jupyter_execute",
    )


def setup(app):
    app.connect("builder-inited", prepare_build_assets)
    return {
        "version": "1.0",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }


if __name__ == "__main__":
    print(f"prepared {prepare_assets()} saved notebook image assets")
