<div align="center">

# BreakRL

**Explain an algorithm, then remove a key mechanism and watch it fail.**

14 chapters of reinforcement learning notes · Chinese & English PDFs · Runnable notebooks · Ablation experiments

[![Stars](https://img.shields.io/github/stars/Powfu-zwx/BreakRL?style=flat-square&color=yellow)](https://github.com/Powfu-zwx/BreakRL/stargazers)
[![Forks](https://img.shields.io/github/forks/Powfu-zwx/BreakRL?style=flat-square&color=blue)](https://github.com/Powfu-zwx/BreakRL/network/members)
[![License: MIT](https://img.shields.io/badge/Code-MIT-green?style=flat-square)](LICENSE-MIT)
[![License: CC BY 4.0](https://img.shields.io/badge/Text-CC%20BY%204.0-orange?style=flat-square)](LICENSE-CC-BY-4.0)
[![Python](https://img.shields.io/badge/Python-3.10-blue?style=flat-square)](requirements.txt)

**[Read online](https://powfu-zwx.github.io/BreakRL/index-en.html) · [Interactive demo](https://powfu-zwx.github.io/BreakRL/demo-en.html) · [Failure atlas](https://powfu-zwx.github.io/BreakRL/failure-atlas-en.html#atlas-8-offline-loss) · [中文](README-zh.md)**

</div>

## Why BreakRL

Most textbooks only show the version of an algorithm that works. BreakRL goes the other way: **explain the principle first, then deliberately remove a key mechanism so you watch it fail — and understand why each component exists**.

| Derive | Run | Break |
| --- | --- | --- |
| Every chapter derives the math from first principles, no steps skipped | Every chapter ships a runnable notebook, one click on Colab | Every chapter includes ablations that show how the algorithm degrades |

Topics range from classical RL (bandits, TD, DQN, PPO, SAC) to offline and model-based RL, Decision Transformer, and small-task implementations of RLHF, DPO, and GRPO.

## Chapters

Each chapter includes derivations, code, and ablation experiments. Chapters 12–14 use toy tasks to explain post-training mechanisms.

<!-- chapters:begin -->
| # | Chapter | Text | Experiments | Run |
| --- | --- | --- | --- | --- |
| 1 | Multi-Armed Bandits: Exploration vs Exploitation | [PDF](book/notes/multi-armed-bandit/multi-armed-bandit-en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/multi-armed-bandit/multi-armed-bandit-en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/multi-armed-bandit/multi-armed-bandit-en.ipynb) |
| 2 | Markov Decision Processes | [PDF](book/notes/mdp/mdp-en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/mdp/mdp-en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/mdp/mdp-en.ipynb) |
| 3 | Temporal-Difference Learning | [PDF](book/notes/temporal-difference-learning/temporal-difference-learning-en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/temporal-difference-learning/temporal-difference-learning-en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/temporal-difference-learning/temporal-difference-learning-en.ipynb) |
| 4 | DQN: Neural Value Learning | [PDF](book/notes/dqn/dqn-en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/dqn/dqn-en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/dqn/dqn-en.ipynb) |
| 5 | Policy Gradient / REINFORCE | [PDF](book/notes/policy-gradient/policy-gradient-en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/policy-gradient/policy-gradient-en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/policy-gradient/policy-gradient-en.ipynb) |
| 6 | Actor-Critic / A2C | [PDF](book/notes/actor-critic/actor-critic-en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/actor-critic/actor-critic-en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/actor-critic/actor-critic-en.ipynb) |
| 7 | PPO: Constrained Policy Updates | [PDF](book/notes/ppo/ppo-en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/ppo/ppo-en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/ppo/ppo-en.ipynb) |
| 8 | SAC: Maximum-Entropy Continuous Control | [PDF](book/notes/sac/sac-en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/sac/sac-en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/sac/sac-en.ipynb) |
| 9 | Offline RL: CQL and IQL | [PDF](book/notes/offline-rl/offline-rl-en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/offline-rl/offline-rl-en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/offline-rl/offline-rl-en.ipynb) |
| 10 | Model-Based RL: Dyna-Q | [PDF](book/notes/model-based-rl/model-based-rl-en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/model-based-rl/model-based-rl-en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/model-based-rl/model-based-rl-en.ipynb) |
| 11 | Decision Transformer: RL as Sequence Modeling | [PDF](book/notes/decision-transformer/decision-transformer-en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/decision-transformer/decision-transformer-en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/decision-transformer/decision-transformer-en.ipynb) |
| 12 | RLHF: From Preferences to Rewards | [PDF](book/notes/rlhf/rlhf-en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/rlhf/rlhf-en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/rlhf/rlhf-en.ipynb) |
| 13 | DPO: Preference Optimization without a Reward Model | [PDF](book/notes/dpo/dpo-en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/dpo/dpo-en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/dpo/dpo-en.ipynb) |
| 14 | GRPO and RLVR: Verifiable Rewards | [PDF](book/notes/grpo/grpo-en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/grpo/grpo-en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/grpo/grpo-en.ipynb) |
<!-- chapters:end -->

## Run the experiments

Click **Colab** in the table to run a notebook. The website displays saved outputs and needs no local setup.

For local use, install Python 3.10:

```bash
conda create -n rl_env python=3.10
conda activate rl_env
python -m pip install -r requirements.txt
python -m ipykernel install --user --name rl_env --display-name rl_env
python tools/run_jupyter.py
```

Open `book/notes/<chapter>/<chapter>-en.ipynb` and select the `rl_env` kernel. Unsuffixed files are Chinese; `-en` files are English.

## Project layout

```
book/
  notes/          # Chapter text (TeX/PDF), experiment notebooks, and figures
  chapters.yml    # Chapter registry; README tables and the site TOC are generated from it
  _toc.yml        # Jupyter Book table of contents (auto-generated)
tools/            # Build and validation scripts
```

After editing chapters, run `python tools/sync_pages.py` to sync the pages; validate with `python tools/check_repo.py`. Update the PDF whenever its TeX source changes.

## License and citation

Text, figures, and data: [CC BY 4.0](LICENSE-CC-BY-4.0). Code: [MIT](LICENSE-MIT).

Citation details: [CITATION.cff](CITATION.cff), or use "Cite this repository" in the GitHub sidebar to copy the BibTeX.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Powfu-zwx/BreakRL&type=Date)](https://star-history.com/#Powfu-zwx/BreakRL&Date)
