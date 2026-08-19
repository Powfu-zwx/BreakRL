"""Tests for the Colab bootstrap helper. No network, no apt, no pip."""
from __future__ import annotations

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = Path(__file__).resolve().parent
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

from colab_setup import (  # noqa: E402
    bootstrap_source,
    clone_commands,
    colab_notebook_url,
    experiment_requirements,
    packages_to_install,
    setup,
    validate_chapter,
)


def _fail(errors: list[str], message: str) -> None:
    errors.append(message)


def test_requirements_skip_jupyterlab() -> list[str]:
    errors = []
    reqs = experiment_requirements(ROOT / "requirements.txt")
    names = [line.split("[", 1)[0].split(">", 1)[0] for line in reqs]
    if "jupyterlab" in names:
        _fail(errors, "experiment_requirements still includes jupyterlab")
    if not any(line.startswith("gymnasium") for line in reqs):
        _fail(errors, "experiment_requirements dropped gymnasium")
    filtered = packages_to_install(["jupyterlab>=4.0", "numpy>=2"], skip={"jupyterlab"})
    if filtered != ["numpy>=2"]:
        _fail(errors, f"packages_to_install ignored skip: {filtered}")
    pip_args = packages_to_install(reqs, skip={"torch"})
    if any(item.startswith("torch") for item in pip_args):
        _fail(errors, "torch skip left a torch spec in pip args")
    return errors


def test_bootstrap_source() -> list[str]:
    errors = []
    source = bootstrap_source("offline-rl")
    try:
        compile(source, "<bootstrap>", "exec")
    except SyntaxError as error:
        _fail(errors, f"bootstrap_source is not valid Python: {error}")
    if "BREAKRL_CHAPTER = 'offline-rl'" not in source:
        _fail(errors, "bootstrap_source missing chapter slug")
    if "google.colab" not in source:
        _fail(errors, "bootstrap_source missing Colab guard")
    namespace: dict[str, object] = {}
    exec(source, namespace)
    if namespace.get("BREAKRL_CHAPTER") != "offline-rl":
        _fail(errors, "executing bootstrap_source locally did not set BREAKRL_CHAPTER")
    from check_consistency import chapter_dirs

    for chapter in chapter_dirs(ROOT):
        try:
            exec(bootstrap_source(chapter.name), {})
        except Exception as error:
            _fail(errors, f"bootstrap for {chapter.name} failed locally: {error}")
    try:
        validate_chapter("../etc")
        _fail(errors, "validate_chapter accepted a path traversal slug")
    except ValueError:
        pass
    return errors


def test_colab_url() -> list[str]:
    errors = []
    url = colab_notebook_url("notes/ppo/ppo_experiments_en.ipynb")
    expected = (
        "https://colab.research.google.com/github/Powfu-zwx/BreakRL/"
        "blob/main/notes/ppo/ppo_experiments_en.ipynb"
    )
    if url != expected:
        _fail(errors, f"colab_notebook_url mismatch: {url}")
    return errors


def test_setup_local_noop() -> list[str]:
    errors = []
    before = Path.cwd()
    returned = setup("offline-rl", on_colab=False)
    if Path.cwd() != before:
        _fail(errors, "setup(on_colab=False) changed the working directory")
    if returned != before:
        _fail(errors, "setup(on_colab=False) should return the current directory")
    return errors


def test_setup_colab_mock(tmp_path: Path) -> list[str]:
    errors = []
    dest = tmp_path / "BreakRL"
    calls: list[list[str]] = []

    def runner(command, cwd=None):  # noqa: ANN001
        cmd = list(command)
        calls.append(cmd)
        if len(cmd) > 1 and cmd[1] == "clone":
            root = Path(cmd[-1])
            (root / ".git").mkdir(parents=True)
            (root / "scripts").mkdir()
            (root / "notes" / "offline-rl").mkdir(parents=True)
            (root / "requirements.txt").write_text(
                (ROOT / "requirements.txt").read_text(encoding="utf-8"),
                encoding="utf-8",
            )

    before = Path.cwd()
    try:
        chapter_dir = setup(
            "offline-rl",
            on_colab=True,
            dest=dest,
            runner=runner,
        )
        if chapter_dir != dest / "notes" / "offline-rl":
            _fail(errors, f"setup returned unexpected chapter dir: {chapter_dir}")
        if Path.cwd() != chapter_dir:
            _fail(errors, "Colab setup did not chdir into the chapter directory")
        joined = [" ".join(call) for call in calls]
        if not any("clone" in item for item in joined):
            _fail(errors, "Colab setup did not clone the repository")
        if any("--sparse" in item or "blob:none" in item for item in joined):
            _fail(errors, "Colab clone still uses a sparse blobless checkout")
        pip_calls = [call for call in calls if call and call[0] == sys.executable]
        if not pip_calls:
            _fail(errors, "Colab setup did not pip-install experiment extras")
        else:
            pip_text = " ".join(pip_calls[0])
            if "jupyterlab" in pip_text:
                _fail(errors, "Colab pip install included jupyterlab")
            if "gymnasium" not in pip_text:
                _fail(errors, "Colab pip install omitted gymnasium")
        clone = clone_commands(dest)[0]
        if clone[-1] != str(dest) or "--depth" not in clone:
            _fail(errors, "clone_commands dest mismatch")
    finally:
        os.chdir(before)
    return errors


def test_incomplete_clone_is_replaced(tmp_path: Path) -> list[str]:
    errors = []
    dest = tmp_path / "BreakRL"
    (dest / ".git").mkdir(parents=True)
    calls: list[list[str]] = []

    def runner(command, cwd=None):  # noqa: ANN001
        cmd = list(command)
        calls.append(cmd)
        if len(cmd) > 1 and cmd[1] == "clone":
            root = Path(cmd[-1])
            (root / ".git").mkdir(parents=True)
            (root / "notes" / "offline-rl").mkdir(parents=True)
            (root / "requirements.txt").write_text("numpy>=2\n", encoding="utf-8")

    before = Path.cwd()
    try:
        setup("offline-rl", on_colab=True, dest=dest, runner=runner)
        if not any(len(call) > 1 and call[1] == "clone" for call in calls):
            _fail(errors, "incomplete Colab clone was not replaced")
        if not (dest / "requirements.txt").is_file():
            _fail(errors, "reclone did not restore requirements.txt")
    finally:
        os.chdir(before)
    return errors


def test_smoke_imports() -> list[str]:
    """Runtime smoke used with --smoke; skipped in CI."""
    errors = []
    npz = ROOT / "notes" / "offline-rl" / "offline_rl_medium.npz"
    try:
        import numpy as np

        with np.load(npz) as data:
            if len(data.files) == 0:
                _fail(errors, f"{npz.name} has no arrays")
    except Exception as error:
        _fail(errors, f"failed to load {npz}: {error}")

    try:
        import gymnasium as gym
    except ImportError:
        _fail(errors, "gymnasium is not installed in this environment")
        return errors

    envs = [
        ("CartPole-v1", {}),
        ("Pendulum-v1", {}),
        ("CliffWalking-v0", {}),
        ("FrozenLake-v1", {"is_slippery": True}),
        ("LunarLander-v3", {}),
    ]
    for env_id, kwargs in envs:
        try:
            env = gym.make(env_id, **kwargs)
            env.reset(seed=0)
            env.close()
        except Exception as error:
            if env_id == "LunarLander-v3" and "Box2D" in str(error):
                print("skip LunarLander-v3: Box2D is not installed locally; Colab setup installs it")
                continue
            _fail(errors, f"gym.make({env_id}) failed: {error}")
    return errors


def test_smoke_second_cells() -> list[str]:
    """Execute the first real setup cell of each Chinese notebook (imports only)."""
    errors = []
    try:
        import matplotlib
        import nbformat
        from check_consistency import chapter_dirs
    except ImportError as error:
        return [f"import-cell smoke missing import: {error}"]

    matplotlib.use("Agg")
    for chapter in chapter_dirs(ROOT):
        path = next(iter(sorted(chapter.glob("*_experiments.ipynb"))))
        notebook = nbformat.read(path, as_version=4)
        codes = [cell for cell in notebook.cells if cell.cell_type == "code"]
        if len(codes) < 2:
            _fail(errors, f"{path.name}: missing setup cell after bootstrap")
            continue
        source = codes[1].source
        if isinstance(source, list):
            source = "".join(source)
        source = "\n".join(
            line for line in source.splitlines() if not line.startswith("%")
        )
        previous = Path.cwd()
        try:
            os.chdir(chapter)
            exec(compile(source, path.name, "exec"), {"__name__": "__main__"})
        except OSError as error:
            if "fbgemm" in str(error).lower() or "torch" in str(error).lower():
                print(f"skip {chapter.name}: local torch failed to load ({error})")
            else:
                _fail(errors, f"{chapter.name} setup cell failed: {error}")
        except Exception as error:
            _fail(errors, f"{chapter.name} setup cell failed: {error}")
        finally:
            os.chdir(previous)
    return errors


def test_smoke_bandit() -> list[str]:
    errors = []
    try:
        import matplotlib
        import nbformat
    except ImportError as error:
        return [f"bandit smoke missing import: {error}"]

    matplotlib.use("Agg")
    path = ROOT / "notes" / "multi-armed-bandit" / "multi-armed-bandit_experiments.ipynb"
    notebook = nbformat.read(path, as_version=4)
    namespace: dict[str, object] = {"__name__": "__main__"}
    import tempfile

    previous = Path.cwd()
    workdir = Path(tempfile.mkdtemp(prefix="breakrl-bandit-"))
    try:
        os.chdir(workdir)
        for cell in notebook.cells:
            if cell.cell_type != "code":
                continue
            source = cell.source
            if isinstance(source, list):
                source = "".join(source)
            source = "\n".join(
                line for line in source.splitlines() if not line.startswith("%")
            )
            exec(compile(source, path.name, "exec"), namespace)
    except Exception as error:
        errors.append(f"bandit notebook failed: {error}")
    finally:
        os.chdir(previous)
    return errors


def main(argv: list[str] | None = None) -> int:
    import tempfile

    argv = list(sys.argv[1:] if argv is None else argv)
    smoke = "--smoke" in argv
    errors = (
        test_requirements_skip_jupyterlab()
        + test_bootstrap_source()
        + test_colab_url()
        + test_setup_local_noop()
    )
    with tempfile.TemporaryDirectory() as tmp:
        errors += test_setup_colab_mock(Path(tmp))
        errors += test_incomplete_clone_is_replaced(Path(tmp) / "incomplete")
    if smoke:
        previous = Path.cwd()
        try:
            errors += test_smoke_imports()
            errors += test_smoke_second_cells()
            errors += test_smoke_bandit()
        finally:
            os.chdir(previous)
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    print("colab setup tests: OK")
    if smoke:
        print("colab runtime smoke: OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
