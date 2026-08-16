<div align="center">

<img src="assets/breakrl-wordmark.png" alt="BreakRL" width="400">

**An ablation-driven reinforcement learning textbook (in Chinese)**

From multi-armed bandits to RLHF · DPO · GRPO/RLVR — each chapter pairs a written derivation with a reproducible ablation experiment

<p>
  <a href="README.md"><b>中文</b></a> ·
  <a href="https://powfu-zwx.github.io/BreakRL/"><b>Read online</b></a> ·
  <a href="https://powfu-zwx.github.io/BreakRL/failure-atlas-en.html"><b>Failure atlas</b></a> ·
  <a href="#chapters">Chapters</a> ·
  <a href="#quick-start">Quick start</a> ·
  <a href="#citation">Citation</a>
</p>

<p>
  <a href="https://github.com/Powfu-zwx/BreakRL/tags"><img src="https://img.shields.io/github/v/tag/Powfu-zwx/BreakRL?label=release&style=flat-square&color=2166AC" alt="release"></a>
  <a href="https://doi.org/10.5281/zenodo.21966485"><img src="https://zenodo.org/badge/DOI/10.5281/zenodo.21966485.svg" alt="DOI" style="max-width:100%"></a>
  <a href="https://github.com/Powfu-zwx/BreakRL/actions/workflows/quality.yml"><img src="https://img.shields.io/github/actions/workflow/status/Powfu-zwx/BreakRL/quality.yml?branch=main&label=checks&style=flat-square" alt="checks"></a>
  <a href="https://powfu-zwx.github.io/BreakRL/"><img src="https://img.shields.io/github/actions/workflow/status/Powfu-zwx/BreakRL/site.yml?branch=main&label=site&style=flat-square" alt="site"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-CC%20BY%204.0%20%2B%20MIT-97ca00?style=flat-square" alt="license"></a>
</p>

</div>

---

What sets this book apart: **every chapter's experiments are ablation contrasts** — you don't just see the algorithm work, you watch it fail when a key mechanism is removed.

- **Ablation contrasts**: PPO without clipping collapses to −8000, DQN without replay stalls at ~10 points, RLHF without a KL anchor gets reward-hacked — three figures per chapter, half showing the mechanism and half its failure;
- **Failure atlas**: every failure case is organized as *symptom → mechanism → reproduction → fix* in a [lookup table](https://powfu-zwx.github.io/BreakRL/failure-atlas-en.html) — when training doesn't converge, find the root cause by symptom;
- **Fully reproducible**: small models, small tasks, 3–20 random seeds per chapter; any chapter's full experiment suite runs in minutes on a single CPU/GPU machine;
- **Positioning**: incumbent Chinese textbooks (Hands-on RL, EasyRL) teach how algorithms *work*; BreakRL teaches how they *fail*, and covers the LLM post-training trilogy that remains scarce in open-source Chinese materials.

## Chapters

| # | Chapter | Text | Experiments |
|---|---------|------|-------------|
| 1 | Multi-armed bandits: exploration vs exploitation | [PDF](notes/multi-armed-bandit/multi-armed-bandit.pdf) | [Read online](https://powfu-zwx.github.io/BreakRL/notes/multi-armed-bandit/multi-armed-bandit_experiments.html) |
| 2 | Markov decision processes | [PDF](notes/mdp/mdp.pdf) | [Read online](https://powfu-zwx.github.io/BreakRL/notes/mdp/mdp_experiments.html) |
| 3 | Temporal-difference learning | [PDF](notes/temporal-difference-learning/temporal-difference-learning.pdf) | [Read online](https://powfu-zwx.github.io/BreakRL/notes/temporal-difference-learning/temporal-difference-learning_experiments.html) |
| 4 | DQN: neural value learning | [PDF](notes/dqn/dqn.pdf) | [Read online](https://powfu-zwx.github.io/BreakRL/notes/dqn/dqn_experiments.html) |
| 5 | Policy gradient / REINFORCE | [PDF](notes/policy-gradient/pg.pdf) | [Read online](https://powfu-zwx.github.io/BreakRL/notes/policy-gradient/pg_experiments.html) |
| 6 | Actor-Critic / A2C | [PDF](notes/actor-critic/ac.pdf) | [Read online](https://powfu-zwx.github.io/BreakRL/notes/actor-critic/ac_experiments.html) |
| 7 | PPO: constrained policy updates | [PDF](notes/ppo/ppo.pdf) | [Read online](https://powfu-zwx.github.io/BreakRL/notes/ppo/ppo_experiments.html) |
| 8 | SAC: maximum-entropy continuous control | [PDF](notes/sac/sac.pdf) | [Read online](https://powfu-zwx.github.io/BreakRL/notes/sac/sac_experiments.html) |
| 9 | Offline RL: CQL and IQL | [PDF](notes/offline-rl/offline-rl.pdf) | [Read online](https://powfu-zwx.github.io/BreakRL/notes/offline-rl/offline-rl_experiments.html) |
| 10 | Model-based RL: from environment models to Dyna-Q | [PDF](notes/model-based-rl/model-based-rl.pdf) | [Read online](https://powfu-zwx.github.io/BreakRL/notes/model-based-rl/model-based-rl_experiments.html) |
| 11 | Decision Transformer: RL as sequence modeling | [PDF](notes/decision-transformer/decision-transformer.pdf) | [Read online](https://powfu-zwx.github.io/BreakRL/notes/decision-transformer/decision-transformer_experiments.html) |
| 12 | RLHF: from preferences to rewards | [PDF](notes/rlhf/rlhf.pdf) | [Read online](https://powfu-zwx.github.io/BreakRL/notes/rlhf/rlhf_experiments.html) |
| 13 | DPO: preference optimization without a reward model | [PDF](notes/dpo/dpo.pdf) | [Read online](https://powfu-zwx.github.io/BreakRL/notes/dpo/dpo_experiments.html) |
| 14 | GRPO and RLVR: verifiable rewards | [PDF](notes/grpo/grpo.pdf) | [Read online](https://powfu-zwx.github.io/BreakRL/notes/grpo/grpo_experiments.html) |

Chapters 1–10 form the classic mainline (value learning → policy optimization → offline and model-based methods), chapter 11 bridges classic RL and LLMs through sequence modeling, and chapters 12–14 are the LLM post-training trilogy. New chapters start from the skeleton in [`notes/rl_note_template.tex`](notes/rl_note_template.tex).

## The RL Failure Atlas

A symptom-driven lookup table of 17 failure modes: "returns collapse off a cliff", "Q keeps rising while the policy gets worse", "offline training loss is fine but returns collapse", "the reward is fine, it just won't learn"… Each entry gives the causal mechanism, a one-click reproducible ablation, and a fix.

→ [powfu-zwx.github.io/BreakRL/failure-atlas-en.html](https://powfu-zwx.github.io/BreakRL/failure-atlas-en.html)

## Quick Start

Experiments use the conda environment **`rl_env`** (Python 3.10, PyTorch, Gymnasium); dependencies follow [`requirements.txt`](requirements.txt):

```bash
conda create -n rl_env python=3.10
conda activate rl_env
python -m pip install -r requirements.txt
python -m ipykernel install --user --name rl_env --display-name rl_env
```

Run the notebooks (`run_jupyter.py` ships a Windows certificate-store workaround; if your machine doesn't need it, run `python -m jupyter lab` directly):

```bash
conda activate rl_env
python run_jupyter.py
```

Open `notes/<chapter>/*_experiments.ipynb` and select the **rl_env** kernel. When re-running experiments, write outputs to a temporary directory outside the repository to avoid overwriting tracked artifacts.

## Build & Site

**Chapter PDFs**: TeX compiles with XeLaTeX + ctex (e.g., on Overleaf) or with Tectonic from the local conda env `tex_env`. The template and all chapters follow the `[!htbp]` figure convention; do not hand-edit PDFs without a TeX toolchain.

```bash
conda run -n tex_env tectonic notes/<chapter>/<chapter>.tex
```

**Online site**: Jupyter Book renders the experiment notebooks listed in `_toc.yml` (saved outputs only, no re-execution). Pushing to main triggers [`site.yml`](.github/workflows/site.yml) to build and deploy to GitHub Pages. Local preview:

```bash
uvx --from "jupyter-book>=1.0,<2" jupyter-book build .   # output in _build/html/
```

## Contributing

Issues and pull requests are welcome — see [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full guide. In short:

1. Edit the TeX, notebooks, or experiment assets under `notes/`;
2. Run the structural check: `python scripts/check_consistency.py` (read-only validation of chapter structure, TeX figure conventions, and `_toc.yml` coverage; the same check runs automatically on GitHub Actions for every push and pull request);
3. Review the full diff and commit;
4. Releases and version bumps are handled by the maintainer per [`CITATION.cff`](CITATION.cff).

## Citation

Use "Cite this repository" on the repository page to export a citation; metadata and the current version live in [`CITATION.cff`](CITATION.cff). All releases are archived on Zenodo: concept DOI [`10.5281/zenodo.21966485`](https://doi.org/10.5281/zenodo.21966485) (always resolves to the latest version).

```bibtex
@software{breakrl,
  title  = {BreakRL: Reinforcement Learning Fundamentals},
  author = {{BreakRL Contributors}},
  year   = {2026},
  doi    = {10.5281/zenodo.21966485},
  url    = {https://github.com/Powfu-zwx/BreakRL}
}
```

## License

Text, PDFs, TeX and visual materials are licensed under [CC BY 4.0](LICENSE); code in the Jupyter notebooks under the [MIT License](LICENSE-CODE).
