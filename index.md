# BreakRL

**用失败学强化学习。**

BreakRL 是一本以实验为主线的强化学习教材：每章先解释算法为什么有效，再通过消融实验展示去掉关键机制后的失败。

## 三分钟开始

1. 先看[最小演示](demo)，用一个滑块理解“损失下降、回报塌缩”；
2. 先读机制解释，再观察 Notebook 中已经保存的结果；
3. 遇到训练异常时，打开[RL 失败模式图鉴](failure-atlas)按症状查找。

阅读站点不需要安装环境，也不会自动执行训练。

## 怎么读

1. 先读正文 PDF，理解问题、公式和机制；
2. 再看实验 Notebook，观察算法在小任务上的行为；
3. 最后对比消融结果，找到“能运行”和“真正有效”的差别。

训练不收敛时，可以直接查 [RL 失败模式图鉴](failure-atlas.md)。每条记录都按“症状 → 机制 → 复现 → 修复”组织。

## 章节

| 章节 | 正文 | 实验 |
| --- | --- | --- |
| 1. 多臂老虎机：探索与利用 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/multi-armed-bandit/multi-armed-bandit.pdf) | [在线阅读](notes/multi-armed-bandit/multi-armed-bandit_experiments.ipynb) |
| 2. 马尔可夫决策过程 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/mdp/mdp.pdf) | [在线阅读](notes/mdp/mdp_experiments.ipynb) |
| 3. 时序差分学习 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/temporal-difference-learning/temporal-difference-learning.pdf) | [在线阅读](notes/temporal-difference-learning/temporal-difference-learning_experiments.ipynb) |
| 4. DQN：神经网络价值学习 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/dqn/dqn.pdf) | [在线阅读](notes/dqn/dqn_experiments.ipynb) |
| 5. Policy Gradient / REINFORCE | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/policy-gradient/pg.pdf) | [在线阅读](notes/policy-gradient/pg_experiments.ipynb) |
| 6. Actor-Critic / A2C | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/actor-critic/ac.pdf) | [在线阅读](notes/actor-critic/ac_experiments.ipynb) |
| 7. PPO：约束策略更新 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/ppo/ppo.pdf) | [在线阅读](notes/ppo/ppo_experiments.ipynb) |
| 8. SAC：最大熵连续控制 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/sac/sac.pdf) | [在线阅读](notes/sac/sac_experiments.ipynb) |
| 9. 离线强化学习：CQL 与 IQL | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/offline-rl/offline-rl.pdf) | [在线阅读](notes/offline-rl/offline-rl_experiments.ipynb) |
| 10. 模型式强化学习：Dyna-Q | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/model-based-rl/model-based-rl.pdf) | [在线阅读](notes/model-based-rl/model-based-rl_experiments.ipynb) |
| 11. Decision Transformer | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/decision-transformer/decision-transformer.pdf) | [在线阅读](notes/decision-transformer/decision-transformer_experiments.ipynb) |
| 12. RLHF：从偏好到奖励 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/rlhf/rlhf.pdf) | [在线阅读](notes/rlhf/rlhf_experiments.ipynb) |
| 13. DPO：不训奖励模型的偏好优化 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/dpo/dpo.pdf) | [在线阅读](notes/dpo/dpo_experiments.ipynb) |
| 14. GRPO 与 RLVR：可验证奖励 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/grpo/grpo.pdf) | [在线阅读](notes/grpo/grpo_experiments.ipynb) |

本站点只展示仓库中保存的 Notebook 输出，不会在阅读时自动执行训练。想运行实验，请参考仓库的 [README](https://github.com/Powfu-zwx/BreakRL#开始实验)。

---

# BreakRL (English)

**Learn reinforcement learning through failure.**

BreakRL is an experiment-first textbook: each chapter explains why an algorithm works, then uses ablations to show what fails when a key mechanism is removed.

## Start in three minutes

1. Try the [minimum demo](demo) and drag one slider to see loss fall while return collapses;
2. Read the mechanism first, then inspect the saved notebook results;
3. When training behaves unexpectedly, use the [RL Failure Atlas](failure-atlas-en) to search by symptom.

You do not need an environment to read the site, and it does not execute training automatically.

## How to read

1. Read the derivation and mechanism;
2. Open the experiment notebook and observe the algorithm on a small task;
3. Compare the ablations and identify the difference between “it runs” and “it works.”

When training does not converge, start with the [RL Failure Atlas](failure-atlas-en.md), organized as “symptom → mechanism → reproduction → fix.”

## Chapters

| Chapter | Text | Experiments |
| --- | --- | --- |
| 1. Multi-armed bandits | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/multi-armed-bandit/multi-armed-bandit_en.pdf) | [Read online](notes/multi-armed-bandit/multi-armed-bandit_experiments_en.ipynb) |
| 2. Markov decision processes | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/mdp/mdp_en.pdf) | [Read online](notes/mdp/mdp_experiments_en.ipynb) |
| 3. Temporal-difference learning | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/temporal-difference-learning/temporal-difference-learning_en.pdf) | [Read online](notes/temporal-difference-learning/temporal-difference-learning_experiments_en.ipynb) |
| 4. DQN: neural value learning | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/dqn/dqn_en.pdf) | [Read online](notes/dqn/dqn_experiments_en.ipynb) |
| 5. Policy gradient / REINFORCE | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/policy-gradient/pg_en.pdf) | [Read online](notes/policy-gradient/pg_experiments_en.ipynb) |
| 6. Actor-Critic / A2C | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/actor-critic/ac_en.pdf) | [Read online](notes/actor-critic/ac_experiments_en.ipynb) |
| 7. PPO: constrained policy updates | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/ppo/ppo_en.pdf) | [Read online](notes/ppo/ppo_experiments_en.ipynb) |
| 8. SAC: maximum-entropy continuous control | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/sac/sac_en.pdf) | [Read online](notes/sac/sac_experiments_en.ipynb) |
| 9. Offline RL: CQL and IQL | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/offline-rl/offline-rl_en.pdf) | [Read online](notes/offline-rl/offline-rl_experiments_en.ipynb) |
| 10. Model-based RL: Dyna-Q | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/model-based-rl/model-based-rl_en.pdf) | [Read online](notes/model-based-rl/model-based-rl_experiments_en.ipynb) |
| 11. Decision Transformer | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/decision-transformer/decision-transformer_en.pdf) | [Read online](notes/decision-transformer/decision-transformer_experiments_en.ipynb) |
| 12. RLHF: from preferences to rewards | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/rlhf/rlhf_en.pdf) | [Read online](notes/rlhf/rlhf_experiments_en.ipynb) |
| 13. DPO: preference optimization without a reward model | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/dpo/dpo_en.pdf) | [Read online](notes/dpo/dpo_experiments_en.ipynb) |
| 14. GRPO and RLVR: verifiable rewards | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/grpo/grpo_en.pdf) | [Read online](notes/grpo/grpo_experiments_en.ipynb) |

The site displays saved notebook outputs and does not train models while you read. To run the experiments, see the [English README](https://github.com/Powfu-zwx/BreakRL/blob/main/README.en.md#run-the-experiments).
