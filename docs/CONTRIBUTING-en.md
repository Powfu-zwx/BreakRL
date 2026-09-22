# Contributing

Issues and pull requests are welcome: corrections, better experiments, new failure modes, and new chapters all count. 中文版见 [CONTRIBUTING.md](CONTRIBUTING.md).

## Naming rule

Chinese is the source edition and English is its translation. **An unsuffixed file is Chinese, `-en` is English**, for text, PDF, and notebook alike (`dqn.tex` / `dqn-en.tex`). [`tools/chapters.py`](../tools/chapters.py) is the only place that turns a chapter into a path; do not restate the rule elsewhere.

## Adding or changing a chapter

There is one chapter list: [`book/chapters.yml`](../book/chapters.yml). After editing it, run

```bash
python tools/sync_pages.py
```

That generates the catalog tables in both READMEs and both home pages, and `book/_toc.yml`. Do not edit those by hand. The language switch pairs pages by the `-en` suffix, so a new page works without touching it.

One chapter is one directory, `book/notes/<chapter>/`, with three files per edition: `<chapter>.tex`, the compiled `<chapter>.pdf`, and `<chapter>.ipynb` (the English edition carries `-en`). Experiment figures `fig*.pdf` are produced by the notebook. Chapter text follows [`docs/rl-note-template.tex`](rl-note-template.tex): story → formalism → mechanism (three ablation figures) → algorithm → comparison → place in the family → references. Use `[!htbp]` on figure environments.

## Bilingual alignment

The English notebook translates markdown cells only; code cells and saved outputs must match the Chinese notebook byte for byte (`tools/check_repo.py` enforces this). English prose may lag the Chinese, but **code and outputs must never be changed on one side only**.

## Environment

Readers can open any chapter in Colab from the catalog table. The first code cell of each notebook is the Colab bootstrap (clone the repository, install the experiment extras, enter the chapter directory), generated from `tools/colab_setup.py` and tagged `remove-cell`. After changing that helper, run `python tools/sync_colab_bootstrap.py` and do not hand-edit the cell. `BREAKRL_CHAPTER` is the directory name under `book/notes/`.

For local work, use Python 3.10 with PyTorch and Gymnasium:

```bash
conda create -n rl_env python=3.10
conda activate rl_env
python -m pip install -r requirements.txt
python -m ipykernel install --user --name rl_env --display-name rl_env
python tools/run_jupyter.py   # Windows certificate-store workaround; otherwise python -m jupyter lab
```

`requirements.txt` states lower bounds only, so Colab resolves to whatever is current. The committed figures and notebook outputs were produced with Python 3.10.21, numpy 2.2.6, matplotlib 3.10.9, torch 2.9.0, and gymnasium 1.3.0; the site toolchain is pinned in [`requirements-site.txt`](../requirements-site.txt). Newer versions can shift the last digits of the reported numbers.

## Checks and builds

```bash
python tools/check_repo.py                               # structural checks (same as CI)
python tools/test_colab_setup.py                         # Colab bootstrap unit tests
node tools/test_lang_toggle.js                           # language toggle regressions
conda run -n tex_env tectonic book/notes/<chapter>/<chapter>.tex   # rebuild the PDF after editing text
jupyter-book build book && python tools/check_site.py book/_build/html
```

**TeX and PDF must ship in the same commit**: text without a rebuild leaves the published PDF stale.

## Notebook notes

- The site renders **saved** notebook outputs and does not re-execute: after rerunning an experiment, check that the numbers still match the text and figure captions before committing;
- A rerun overwrites `fig*.pdf` in the chapter directory — expected, since figure and code share one source — but read the diff to confirm the change is real;
- Any quantitative claim in the text must be backed by the saved output or stdout.

## Failure Atlas

Each entry in [`book/failure-atlas-en.md`](../book/failure-atlas-en.md) follows “symptom → mechanism → reproduction → fix”, and the reproduction links to the chapter notebook and figure number. To add an entry, open an issue describing the symptom and how to reproduce it.

## License and releases

Text, PDFs, TeX, visual materials, and generated data files use [CC BY 4.0](../LICENSE-CC-BY-4.0); code in notebooks and repository helper scripts uses [MIT](../LICENSE-MIT). Prose and outputs inside notebooks remain CC BY 4.0. Versions and releases are managed through [`CITATION.cff`](../CITATION.cff).
