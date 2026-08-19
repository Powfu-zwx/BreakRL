"""Colab bootstrap for BreakRL experiment notebooks."""
from __future__ import annotations

import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

from paths import NOTES_PREFIX

GITHUB_REPO = "Powfu-zwx/BreakRL"
REPO_URL = f"https://github.com/{GITHUB_REPO}.git"
RAW_SETUP_URL = (
    f"https://raw.githubusercontent.com/{GITHUB_REPO}/main/scripts/colab_setup.py"
)
COLAB_ROOT = Path("/content/BreakRL")
NOTES_DIR = Path(NOTES_PREFIX)
COLAB_NOTEBOOK_BASE = (
    f"https://colab.research.google.com/github/{GITHUB_REPO}/blob/main"
)
CHAPTER_SLUG = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*")
EDITOR_PACKAGES = frozenset({"jupyterlab"})


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
    skip: set[str] = set()
    if _importable("torch"):
        skip.add("torch")
    return skip


def bootstrap_source(chapter: str) -> str:
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
        "    _req = urllib.request.Request(\n"
        f"        {RAW_SETUP_URL!r} + '?v=2',\n"
        "        headers={'Cache-Control': 'no-cache'},\n"
        "    )\n"
        "    _setup.write_bytes(urllib.request.urlopen(_req).read())\n"
        "    runpy.run_path(str(_setup))['setup'](BREAKRL_CHAPTER)\n"
    )


def clone_commands(dest: Path) -> list[list[str]]:
    return [["git", "clone", "--depth", "1", REPO_URL, str(dest)]]


def setup(
    chapter: str,
    *,
    on_colab: bool | None = None,
    dest: Path | None = None,
    runner=subprocess.check_call,
) -> Path:
    slug = validate_chapter(chapter)
    if on_colab is None:
        on_colab = in_colab()
    if not on_colab:
        return Path.cwd()

    root = Path(dest) if dest is not None else COLAB_ROOT
    _ensure_repo(root, slug, runner)
    _install_system(runner)
    requirements = experiment_requirements(root / "requirements.txt")
    to_install = packages_to_install(requirements, skip=installed_pip_skips())
    if to_install:
        runner([sys.executable, "-m", "pip", "install", "-q", *to_install])

    chapter_dir = root / NOTES_DIR / slug
    os.chdir(chapter_dir)
    print(f"BreakRL: working directory {chapter_dir}")
    return chapter_dir


def _importable(name: str) -> bool:
    try:
        __import__(name)
    except (ImportError, OSError):
        return False
    return True


def _repo_is_ready(root: Path, chapter: str) -> bool:
    return (
        (root / ".git").is_dir()
        and (root / "requirements.txt").is_file()
        and (root / NOTES_DIR / chapter).is_dir()
    )


def _ensure_repo(root: Path, chapter: str, runner) -> None:
    if _repo_is_ready(root, chapter):
        return
    if root.exists():
        shutil.rmtree(root)
    root.parent.mkdir(parents=True, exist_ok=True)
    for command in clone_commands(root):
        runner(command)
    if not _repo_is_ready(root, chapter):
        raise FileNotFoundError(
            f"cloned {root} but missing requirements.txt or {NOTES_DIR / chapter}"
        )


def _install_system(runner) -> None:
    if shutil.which("swig"):
        return
    runner(["apt-get", "update", "-qq"])
    runner(["apt-get", "install", "-y", "-qq", "swig"])
