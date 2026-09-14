# BreakRL

**Learn reinforcement learning through failure.**

BreakRL is a bilingual, failure-first textbook: each chapter explains why an algorithm works, then uses ablations to show what fails when a key mechanism is removed.

**Current textbook:** v1.2.x. A V2 rewrite is an unstarted internal spec; it will not replace or empty `main`.

## Start in three minutes

1. Try the [minimum demo](demo) and drag one slider to see loss fall while return collapses;
2. Open [Failure Atlas #8](failure-atlas-en.md#atlas-8-offline-loss) (healthy offline loss, collapsing returns);
3. Read the Offline RL chapter: [text PDF](offline-rl-text-en) and the [saved experiment](notes/offline-rl/offline-rl_experiments_en.ipynb).

You do not need an environment to read the site, and it does not execute training automatically. The catalog below is the rest of the book — start with the loop above, not Chapter 1.

## How to read

1. Read the derivation and mechanism;
2. Open the experiment notebook and observe the algorithm on a small task;
3. Compare the ablations and identify the difference between “it runs” and “it works.”

When training does not converge, start with the [RL Failure Atlas](failure-atlas-en.md), organized as “symptom → mechanism → reproduction → fix.”

## All chapters

| Chapter | Text | Experiments | Run |
| --- | --- | --- | --- |
| 1. Multi-armed bandits | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/multi-armed-bandit/multi-armed-bandit_en.pdf) | [Read online](notes/multi-armed-bandit/multi-armed-bandit_experiments_en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/multi-armed-bandit/multi-armed-bandit_experiments_en.ipynb) |
| 2. Markov decision processes | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/mdp/mdp_en.pdf) | [Read online](notes/mdp/mdp_experiments_en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/mdp/mdp_experiments_en.ipynb) |
| 3. Temporal-difference learning | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/temporal-difference-learning/temporal-difference-learning_en.pdf) | [Read online](notes/temporal-difference-learning/temporal-difference-learning_experiments_en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/temporal-difference-learning/temporal-difference-learning_experiments_en.ipynb) |
| 4. DQN: neural value learning | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/dqn/dqn_en.pdf) | [Read online](notes/dqn/dqn_experiments_en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/dqn/dqn_experiments_en.ipynb) |
| 5. Policy gradient / REINFORCE | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/policy-gradient/pg_en.pdf) | [Read online](notes/policy-gradient/pg_experiments_en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/policy-gradient/pg_experiments_en.ipynb) |
| 6. Actor-Critic / A2C | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/actor-critic/ac_en.pdf) | [Read online](notes/actor-critic/ac_experiments_en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/actor-critic/ac_experiments_en.ipynb) |
| 7. PPO: constrained policy updates | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/ppo/ppo_en.pdf) | [Read online](notes/ppo/ppo_experiments_en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/ppo/ppo_experiments_en.ipynb) |
| 8. SAC: maximum-entropy continuous control | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/sac/sac_en.pdf) | [Read online](notes/sac/sac_experiments_en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/sac/sac_experiments_en.ipynb) |
| 9. Offline RL: CQL and IQL | [PDF](offline-rl-text-en) | [Read online](notes/offline-rl/offline-rl_experiments_en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/offline-rl/offline-rl_experiments_en.ipynb) |
| 10. Model-based RL: Dyna-Q | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/model-based-rl/model-based-rl_en.pdf) | [Read online](notes/model-based-rl/model-based-rl_experiments_en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/model-based-rl/model-based-rl_experiments_en.ipynb) |
| 11. Decision Transformer | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/decision-transformer/decision-transformer_en.pdf) | [Read online](notes/decision-transformer/decision-transformer_experiments_en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/decision-transformer/decision-transformer_experiments_en.ipynb) |
| 12. RLHF: from preferences to rewards | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/rlhf/rlhf_en.pdf) | [Read online](notes/rlhf/rlhf_experiments_en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/rlhf/rlhf_experiments_en.ipynb) |
| 13. DPO: preference optimization without a reward model | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/dpo/dpo_en.pdf) | [Read online](notes/dpo/dpo_experiments_en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/dpo/dpo_experiments_en.ipynb) |
| 14. GRPO and RLVR: verifiable rewards | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/grpo/grpo_en.pdf) | [Read online](notes/grpo/grpo_experiments_en.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/grpo/grpo_experiments_en.ipynb) |

The site displays saved notebook outputs and does not train models while you read. To run the experiments, use Colab in the table above or the local install in the [README](https://github.com/Powfu-zwx/BreakRL/blob/main/README.md#run-the-experiments).
