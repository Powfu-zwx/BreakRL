# BreakRL

**Learn reinforcement learning through failure.**

BreakRL is a bilingual, failure-first set of RL lecture notes. Each chapter explains a mechanism, then removes it so you can see the failure.

## Start in three minutes

1. Open the [minimum demo](demo-en) and drag the coverage slider (a teaching plot; it does not train a model);
2. Open <a href="failure-atlas-en.html#atlas-8-offline-loss">Failure Atlas #8</a> (healthy offline loss, collapsing returns);
3. Read the Offline RL chapter: [text PDF](offline-rl-text-en) and the [saved experiment](notes/offline-rl/offline-rl-en.ipynb).

Reading the site needs no install. Pages render saved outputs and do not train. The catalog below is the rest of the book; start with the loop above, not Chapter 1.

## How to read

1. Read the chapter text for the problem, formulas, and mechanism;
2. Open the experiment notebook and watch the algorithm on a small task;
3. Compare the ablations: a finished run is not the same as a method that works.

When training does not converge, look up the symptom in the [RL Failure Atlas](failure-atlas-en.md) (“symptom → mechanism → reproduction → fix”).

## All chapters

<!-- chapters:begin -->
| # | Chapter | Text | Experiments | Run |
| --- | --- | --- | --- | --- |
| 1 | Multi-Armed Bandits: Exploration vs Exploitation | [PDF](notes/multi-armed-bandit/multi-armed-bandit-en.pdf) | [Notebook](notes/multi-armed-bandit/multi-armed-bandit-en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/multi-armed-bandit/multi-armed-bandit-en.ipynb) |
| 2 | Markov Decision Processes | [PDF](notes/mdp/mdp-en.pdf) | [Notebook](notes/mdp/mdp-en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/mdp/mdp-en.ipynb) |
| 3 | Temporal-Difference Learning | [PDF](notes/temporal-difference-learning/temporal-difference-learning-en.pdf) | [Notebook](notes/temporal-difference-learning/temporal-difference-learning-en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/temporal-difference-learning/temporal-difference-learning-en.ipynb) |
| 4 | DQN: Neural Value Learning | [PDF](notes/dqn/dqn-en.pdf) | [Notebook](notes/dqn/dqn-en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/dqn/dqn-en.ipynb) |
| 5 | Policy Gradient / REINFORCE | [PDF](notes/policy-gradient/policy-gradient-en.pdf) | [Notebook](notes/policy-gradient/policy-gradient-en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/policy-gradient/policy-gradient-en.ipynb) |
| 6 | Actor-Critic / A2C | [PDF](notes/actor-critic/actor-critic-en.pdf) | [Notebook](notes/actor-critic/actor-critic-en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/actor-critic/actor-critic-en.ipynb) |
| 7 | PPO: Constrained Policy Updates | [PDF](notes/ppo/ppo-en.pdf) | [Notebook](notes/ppo/ppo-en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/ppo/ppo-en.ipynb) |
| 8 | SAC: Maximum-Entropy Continuous Control | [PDF](notes/sac/sac-en.pdf) | [Notebook](notes/sac/sac-en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/sac/sac-en.ipynb) |
| 9 | Offline RL: CQL and IQL | [PDF](notes/offline-rl/offline-rl-en.pdf) | [Notebook](notes/offline-rl/offline-rl-en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/offline-rl/offline-rl-en.ipynb) |
| 10 | Model-Based RL: Dyna-Q | [PDF](notes/model-based-rl/model-based-rl-en.pdf) | [Notebook](notes/model-based-rl/model-based-rl-en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/model-based-rl/model-based-rl-en.ipynb) |
| 11 | Decision Transformer: RL as Sequence Modeling | [PDF](notes/decision-transformer/decision-transformer-en.pdf) | [Notebook](notes/decision-transformer/decision-transformer-en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/decision-transformer/decision-transformer-en.ipynb) |
| 12 | RLHF: From Preferences to Rewards | [PDF](notes/rlhf/rlhf-en.pdf) | [Notebook](notes/rlhf/rlhf-en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/rlhf/rlhf-en.ipynb) |
| 13 | DPO: Preference Optimization without a Reward Model | [PDF](notes/dpo/dpo-en.pdf) | [Notebook](notes/dpo/dpo-en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/dpo/dpo-en.ipynb) |
| 14 | GRPO and RLVR: Verifiable Rewards | [PDF](notes/grpo/grpo-en.pdf) | [Notebook](notes/grpo/grpo-en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/grpo/grpo-en.ipynb) |
<!-- chapters:end -->

Chapters 12–14 use toy sequence tasks and two-digit addition. They show the mechanisms; they are not a substitute for production RLHF, DPO, or GRPO training.

The site displays saved notebook outputs and does not train models while you read. To run the experiments, use Colab in the table above or the local install in the [README](https://github.com/Powfu-zwx/BreakRL/blob/main/README-en.md#run-the-experiments).
