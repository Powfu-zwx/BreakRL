<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/banner-dark.svg">
  <img src=".github/assets/banner-light.svg" width="100%" alt="BreakRL">
</picture>

Bilingual reinforcement learning notes in 14 chapters, from multi-armed bandits to GRPO.

<a href="https://github.com/Powfu-zwx/BreakRL/stargazers"><img src="https://img.shields.io/github/stars/Powfu-zwx/BreakRL?style=flat&logo=github&label=Stars&labelColor=161b22&color=ff2e63" alt="Stars"></a>
<a href="https://doi.org/10.5281/zenodo.21966485"><img src="https://img.shields.io/badge/DOI-10.5281%2Fzenodo.21966485-30363d?style=flat&labelColor=161b22" alt="DOI"></a>
<a href="LICENSE-MIT"><img src="https://img.shields.io/badge/Code-MIT-30363d?style=flat&labelColor=161b22" alt="MIT"></a>
<a href="LICENSE-CC-BY-4.0"><img src="https://img.shields.io/badge/Text-CC%20BY%204.0-30363d?style=flat&labelColor=161b22" alt="CC BY 4.0"></a>
<a href="requirements.txt"><img src="https://img.shields.io/badge/Python-3.10-30363d?style=flat&logo=python&logoColor=white&labelColor=161b22" alt="Python 3.10"></a>

<b><a href="https://powfu-zwx.github.io/BreakRL/index-en.html">Read online</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://powfu-zwx.github.io/BreakRL/demo-en.html">Interactive demo</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://powfu-zwx.github.io/BreakRL/failure-atlas-en.html#atlas-8-offline-loss">Failure atlas</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="README-zh.md">中文</a></b>

</div>


## What this is

The hard part of RL is usually not the math. It's the moment a run finishes, the curve is right there, and you still can't say why it worked or why it didn't.

So every chapter here does three things. It derives the method from scratch, gives you a notebook you can run, and then pulls out one piece the method depends on and trains it again. DQN loses its replay buffer. PPO loses its clip. RLHF gets a KL weight of zero. Seeing exactly how each one falls apart teaches more than a paragraph about why the piece matters.

The failures are collected in a [failure atlas](https://powfu-zwx.github.io/BreakRL/failure-atlas-en.html#atlas-8-offline-loss): 17 entries, each laid out as symptom, cause, how to reproduce it, and how to fix it. When your own training stalls, look it up by symptom.

## Start in three minutes

Nothing to install:

1. Open the [interactive demo](https://powfu-zwx.github.io/BreakRL/demo-en.html) and drag the data-coverage slider down. Watch the loss and the return part ways.
2. Read [failure atlas #8](https://powfu-zwx.github.io/BreakRL/failure-atlas-en.html#atlas-8-offline-loss) for the extrapolation error behind it.
3. Then read Chapter 9 on offline RL to see how CQL and IQL each fix it.

That loop is how every chapter reads. You don't need to start at Chapter 1.

## What each chapter breaks

| Ch. | What gets removed | What you see |
| --- | --- | --- |
| 1 Bandits | Exploration (pure greedy) | About 3 in 10 seeds get stuck on a worse arm |
| 2 MDP | Nothing; this is the foundation | Policy iteration and value iteration converging |
| 3 TD | On- vs off-policy, n-step choice | SARSA and Q-learning take different paths on Cliff Walking |
| 4 DQN | Replay buffer, target network | CartPole return stuck near 10; wildly oscillating curves |
| 5 REINFORCE | Baseline, entropy bonus | Returns are pure noise; entropy collapses early |
| 6 Actor-Critic | A2C's stabilizers | Advantage collapse; return pinned near 9 from episode one |
| 7 PPO | The clip | LunarLander collapses mid-run, down to around −8000 |
| 8 SAC | Entropy term, double Q, soft updates | Exploration dies, Q overestimates, targets jump |
| 9 Offline RL | Conservatism (naive offline DQN) | Q keeps rising while return stays far below BC |
| 10 Model-based RL | An accurate model | More planning amplifies the model's bias |
| 11 Decision Transformer | Return targets inside the data | Higher targets don't help; can't stitch the optimal path |
| 12 RLHF | The KL constraint (β = 0) | Proxy reward rises while true quality collapses |
| 13 DPO | A large enough β, early stopping | Loss keeps falling while generations get worse |
| 14 GRPO | Cold-start SFT | Every group's reward is zero, so nothing is learned |

Chapters 12–14 use toy tasks. They are there to make post-training mechanics visible, not to reproduce LLM-scale results.

## Chapters

Each chapter has a PDF, a web notebook with saved outputs, and a Colab link.

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

## Running locally

<details>
<summary>Show local setup</summary>

Colab is the easiest route. To run locally, use Python 3.10:

```bash
conda create -n rl_env python=3.10
conda activate rl_env
python -m pip install -r requirements.txt
python -m ipykernel install --user --name rl_env --display-name rl_env
python tools/run_jupyter.py
```

Open `book/notes/<chapter>/<chapter>-en.ipynb` and pick the `rl_env` kernel. Files without a suffix are Chinese; `-en` files are English.

</details>

## Repository layout

```
book/
  notes/          TeX, PDFs, notebooks, and figures for each chapter
  chapters.yml    The chapter list; the READMEs and site TOC are generated from it
  _toc.yml        Jupyter Book TOC (generated, don't edit by hand)
tools/            Build and check scripts
```

To add, remove, or rename a chapter, edit only `book/chapters.yml`, run `python tools/sync_pages.py` to regenerate the pages, then `python tools/check_repo.py`. If you touch a `.tex` file, rebuild its PDF too. Found a wrong derivation or a notebook that won't run? Please open an issue.

## License and citation

Text, figures, and data are [CC BY 4.0](LICENSE-CC-BY-4.0). Code is [MIT](LICENSE-MIT).

If you use BreakRL in a course, a paper, or other public work, please cite it using [CITATION.cff](CITATION.cff), or click "Cite this repository" in the GitHub sidebar for BibTeX.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Powfu-zwx/BreakRL&type=Date)](https://star-history.com/#Powfu-zwx/BreakRL&Date)
