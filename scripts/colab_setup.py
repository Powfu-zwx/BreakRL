"""Colab bootstrap for BreakRL experiment notebooks.

Opening a notebook from GitHub copies only the `.ipynb`. This module is the
single owner of: detect Colab, clone the chapter files, install experiment
extras, and `chdir` into `notes/<chapter>/` so relative data paths work.

Local Jupyter skips that work. Notebooks must not copy this logic; they call
the generated first code cell from ``bootstrap_source``.
"""
from __future__ import annotations

import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

GITHUB_REPO = "Powfu-zwx/BreakRL"
REPO_URL = f"https://github.com/{GITHUB_REPO}.git"
RAW_SETUP_URL = (
    f"https://raw.githubusercontent.com/{GITHUB_REPO}/main/scripts/colab_setup.py"
)
COLAB_ROOT = Path("/content/BreakRL")
COLAB_NOTEBOOK_BASE = (
    f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/main"
)
CHAPTER_SLUG = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*")
EDITOR_PACKAGES = frozenset({"jupyterlab"})
CHAPTER_SPARSE_ROOTS = ("scripts",)


def colab_notebook_url(repo_relative: str) -> str:
    return f"{COLAB_NOTEBOOK_BASE}/{repo_relative.lstrip('/')}"


def in_colab() -> bool:
    return "google.colab" in sys.modules


def validate_chapter(chapter: str) -> str:
    if not CHAPTER_SLUG.fullmatch(chapter):
        raise ValueError(f"invalid chapter slug: {chapter!r}")
    return chapter


def requirement_name(line: str) -> str:
    return (
        line.split("[", 1)[0]
        .split(">", 1)[0]
        .split("=", 1)[0]
        .split("<", 1)[0]
        .split("~", 1)[0]
        .strip()
        .lower()
    )


def experiment_requirements(requirements_path: Path) -> list[str]:
    """Return pip specs from requirements.txt, omitting JupyterLab."""
    lines = []
    for raw in requirements_path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if requirement_name(line) in EDITOR_PACKAGES:
            continue
        lines.append(line)
    return lines


def packages_to_install(requirements: list[str], *, skip: set[str]) -> list[str]:
    return [req for req in requirements if requirement_name(req) not in skip]


def installed_pip_skips() -> set[str]:
    # Colab ships a CUDA PyTorch build; reinstalling from pip replaces it.
    skip: set[str] = set()
    if _importable("torch"):
        skip.add("torch")
    return skip


def bootstrap_source(chapter: str) -> str:
    """Exact first code cell for both language editions of a chapter."""
    slug = validate_chapter(chapter)
    return (
        f"BREAKRL_CHAPTER = {slug!r}\n"
        "\n"
        "import sys\n"
        "\n"
        "if 'google.colab' in sys.modules:\n"
        "    import runpy\n"
        "    import urllib.request\n"
        "    from pathlib import Path\n"
        "\n"
        "    _setup = Path('/content/_breakrl_colab_setup.py')\n"
        "    urllib.request.urlretrieve(\n"
        f"        {RAW_SETUP_URL!r},\n"
        "        _setup,\n"
        "    )\n"
        "    runpy.run_path(str(_setup))['setup'](BREAKRL_CHAPTER)\n"
    )


def clone_commands(dest: Path) -> list[list[str]]:
    return [
        [
            "git",
            "clone",
            "--depth",
            "1",
            "--filter=blob:none",
            "--sparse",
            REPO_URL,
            str(dest),
        ]
    ]


def sparse_checkout_command(chapter: str) -> list[str]:
    slug = validate_chapter(chapter)
    return [
        "git",
        "sparse-checkout",
        "set",
        "--cone",
        *CHAPTER_SPARSE_ROOTS,
        f"notes/{slug}",
    ]


def sparse_add_command(chapter: str) -> list[str]:
    slug = validate_chapter(chapter)
    return ["git", "sparse-checkout", "add", f"notes/{slug}"]


def setup(
    chapter: str,
    *,
    on_colab: bool | None = None,
    dest: Path | None = None,
    runner=subprocess.check_call,
) -> Path:
    """Install extras and enter ``notes/<chapter>`` on Colab; no-op locally."""
    slug = validate_chapter(chapter)
    if on_colab is None:
        on_colab = in_colab()
    if not on_colab:
        return Path.cwd()

    root = Path(dest) if dest is not None else COLAB_ROOT
    _ensure_repo(root, slug, runner)
    _install_system(runner)
    req_path = root / "requirements.txt"
    requirements = experiment_requirements(req_path)
    to_install = packages_to_install(requirements, skip=installed_pip_skips())
    if to_install:
        runner([sys.executable, "-m", "pip", "install", "-q", *to_install])

    chapter_dir = root / "notes" / slug
    if not chapter_dir.is_dir():
        raise FileNotFoundError(f"missing Colab chapter directory: {chapter_dir}")
    os.chdir(chapter_dir)
    print(f"BreakRL: working directory {chapter_dir}")
    return chapter_dir


def _importable(name: str) -> bool:
    try:
        __import__(name)
    except (ImportError, OSError):
        return False
    return True


def _ensure_repo(root: Path, chapter: str, runner) -> None:
    git_dir = root / ".git"
    if not git_dir.exists():
        if root.exists():
            raise FileExistsError(f"Colab clone path exists but is not a git repo: {root}")
        root.parent.mkdir(parents=True, exist_ok=True)
        for command in clone_commands(root):
            runner(command)
        runner(sparse_checkout_command(chapter), cwd=str(root))
        return
    runner(sparse_add_command(chapter), cwd=str(root))


def _install_system(runner) -> None:
    if shutil.which("swig"):
        return
    runner(["apt-get", "update", "-qq"])
    runner(["apt-get", "install", "-y", "-qq", "swig"])
