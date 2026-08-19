<div align="center">

<img src="assets/breakrl-wordmark.png" alt="BreakRL" width="400">

<p>
  <a href="https://powfu-zwx.github.io/BreakRL/"><img alt="Read online" src="https://img.shields.io/badge/read-online-0e8a16"></a>
  <a href="https://github.com/Powfu-zwx/BreakRL/actions/workflows/quality.yml"><img alt="Repository quality" src="https://github.com/Powfu-zwx/BreakRL/actions/workflows/quality.yml/badge.svg"></a>
  <a href="https://doi.org/10.5281/zenodo.21966485"><img alt="DOI" src="https://zenodo.org/badge/DOI/10.5281/zenodo.21966485.svg"></a>
  <a href="requirements.txt"><img alt="Python 3.10" src="https://img.shields.io/badge/python-3.10-3776AB"></a>
  <a href="LICENSE-CC-BY-4.0"><img alt="Text license CC BY 4.0" src="https://img.shields.io/badge/license-CC%20BY%204.0-lightgrey"></a>
  <a href="LICENSE-MIT"><img alt="Code license MIT" src="https://img.shields.io/badge/code-MIT-blue"></a>
</p>

**Learn reinforcement learning through failure**

From multi-armed bandits to RLHF, DPO, and GRPO/RLVR, every chapter is built around an ablation experiment

<p>
  <a href="https://powfu-zwx.github.io/BreakRL/"><b>Read online</b></a> ·
  <a href="https://powfu-zwx.github.io/BreakRL/demo.html"><b>Demo</b></a> ·
  <a href="https://powfu-zwx.github.io/BreakRL/failure-atlas-en.html"><b>Failure atlas</b></a> ·
  <a href="README.zh.md"><b>中文</b></a>
</p>

</div>

BreakRL is an experiment-first reinforcement learning textbook for learners, first-time paper readers, and anyone who wants to understand algorithms through small experiments. Each chapter explains why an algorithm works, then removes a key mechanism so you can see why it fails.

<p align="center">
  <a href="https://powfu-zwx.github.io/BreakRL/demo.html"><img src="assets/readme-demo-en.gif" alt="Minimum demo: at low data coverage, TD loss falls while actual return collapses" width="720"></a>
</p>

<p align="center">
  <a href="https://powfu-zwx.github.io/BreakRL/demo.html">Open the minimum demo</a> and drag data coverage: the loss can keep falling while return collapses when coverage is too low.
</p>

## Start in three minutes

1. Try the [minimum demo](https://powfu-zwx.github.io/BreakRL/demo.html) and drag one slider to see loss fall while return collapses;
2. Open the [online book](https://powfu-zwx.github.io/BreakRL/) and start with Chapter 1;
3. Use the [Failure Atlas](https://powfu-zwx.github.io/BreakRL/failure-atlas-en.html) to look up one symptom and its mechanism.

No setup is needed for reading: the site displays saved experiment outputs. To rerun a chapter, open it in Colab from the table below, or install a local environment if you want to edit the notebooks.

The learning loop is simple:

1. Read the derivation and mechanism;
2. Open the notebook and observe the algorithm on a small task;
3. Compare the ablations and separate “it runs” from “it works.”

## Learning path

| Stage | Chapters | Focus |
| --- | --- | --- |
| Foundations | 1–3 | Exploration, MDPs, and temporal-difference learning |
| Deep RL | 4–8 | DQN, policy gradients, Actor-Critic, PPO, and SAC |
| New views | 9–11 | Offline RL, model-based RL, and Decision Transformer |
| LLM post-training | 12–14 | RLHF, DPO, and GRPO/RLVR |

## Chapters

| # | Topic | Text | Experiments | Run |
| --- | --- | --- | --- | --- |
| 1 | Multi-armed bandits: exploration vs exploitation | [PDF](notes/multi-armed-bandit/multi-armed-bandit_en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/multi-armed-bandit/multi-armed-bandit_experiments_en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/notes/multi-armed-bandit/multi-armed-bandit_experiments_en.ipynb) |
| 2 | Markov decision processes | [PDF](notes/mdp/mdp_en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/mdp/mdp_experiments_en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/notes/mdp/mdp_experiments_en.ipynb) |
| 3 | Temporal-difference learning | [PDF](notes/temporal-difference-learning/temporal-difference-learning_en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/temporal-difference-learning/temporal-difference-learning_experiments_en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/notes/temporal-difference-learning/temporal-difference-learning_experiments_en.ipynb) |
| 4 | DQN: neural value learning | [PDF](notes/dqn/dqn_en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/dqn/dqn_experiments_en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/notes/dqn/dqn_experiments_en.ipynb) |
| 5 | Policy gradient / REINFORCE | [PDF](notes/policy-gradient/pg_en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/policy-gradient/pg_experiments_en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/notes/policy-gradient/pg_experiments_en.ipynb) |
| 6 | Actor-Critic / A2C | [PDF](notes/actor-critic/ac_en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/actor-critic/ac_experiments_en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/notes/actor-critic/ac_experiments_en.ipynb) |
| 7 | PPO: constrained policy updates | [PDF](notes/ppo/ppo_en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/ppo/ppo_experiments_en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/notes/ppo/ppo_experiments_en.ipynb) |
| 8 | SAC: maximum-entropy continuous control | [PDF](notes/sac/sac_en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/sac/sac_experiments_en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/notes/sac/sac_experiments_en.ipynb) |
| 9 | Offline RL: CQL and IQL | [PDF](notes/offline-rl/offline-rl_en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/offline-rl/offline-rl_experiments_en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/notes/offline-rl/offline-rl_experiments_en.ipynb) |
| 10 | Model-based RL: Dyna-Q | [PDF](notes/model-based-rl/model-based-rl_en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/model-based-rl/model-based-rl_experiments_en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/notes/model-based-rl/model-based-rl_experiments_en.ipynb) |
| 11 | Decision Transformer | [PDF](notes/decision-transformer/decision-transformer_en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/decision-transformer/decision-transformer_experiments_en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/notes/decision-transformer/decision-transformer_experiments_en.ipynb) |
| 12 | RLHF: from preferences to rewards | [PDF](notes/rlhf/rlhf_en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/rlhf/rlhf_experiments_en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/notes/rlhf/rlhf_experiments_en.ipynb) |
| 13 | DPO: preference optimization without a reward model | [PDF](notes/dpo/dpo_en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/dpo/dpo_experiments_en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/notes/dpo/dpo_experiments_en.ipynb) |
| 14 | GRPO and RLVR: verifiable rewards | [PDF](notes/grpo/grpo_en.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/grpo/grpo_experiments_en.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/notes/grpo/grpo_experiments_en.ipynb) |

## The Failure Atlas

When training does not converge, start with the symptom: collapsing returns, rising Q-values with a worsening policy, a healthy offline loss with collapsing returns, or a reward that looks fine but never learns.

[Open the RL Failure Atlas](https://powfu-zwx.github.io/BreakRL/failure-atlas-en.html): each entry follows “symptom → mechanism → reproduction → fix.”

## Run the experiments

The site displays saved notebook outputs and does not train models while you read.

**Zero install:** click **Colab** in the chapter table. The first code cell clones this repository, installs the experiment extras, and enters the chapter folder so relative data paths work. Some chapters finish in under a minute on CPU; PPO is on the order of an hour, and Decision Transformer can take several hours on CPU.

To run locally, use Python 3.10 with PyTorch and Gymnasium:

```bash
conda create -n rl_env python=3.10
conda activate rl_env
python -m pip install -r requirements.txt
python -m ipykernel install --user --name rl_env --display-name rl_env
python run_jupyter.py
```

Open `notes/<chapter>/*_experiments_en.ipynb` and select the `rl_env` kernel.

## Citation and license

For teaching, learning, or research use, see [CITATION.cff](CITATION.cff). Text, PDFs, TeX, figures, and generated data use [CC BY 4.0](LICENSE-CC-BY-4.0); code in notebooks and helper scripts uses the [MIT License](LICENSE-MIT). Release history is in [CHANGELOG.md](CHANGELOG.md).

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidance.
