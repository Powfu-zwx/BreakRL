# BreakRL

**用失败学强化学习。**

BreakRL 是一本双语、失败优先的强化学习教材：每章先解释算法为什么有效，再通过消融实验展示去掉关键机制后的失败。

**当前教材：** v1.2.x。V2 仍是未开工的内部规格，不会替换或清空 `main`。

## 三分钟开始

1. 先看[最小演示](demo)，用一个滑块理解“损失下降、回报塌缩”；
2. 打开[失败模式图鉴第 8 条](failure-atlas.md#atlas-8-offline-loss)（离线损失正常、回报塌缩）；
3. 阅读离线强化学习章：[正文 PDF](offline-rl-text) 与[已保存实验](notes/offline-rl/offline-rl_experiments.ipynb)。

阅读站点不需要安装环境，也不会自动执行训练。下面的目录是全书其余部分——请先走完上面这一环，而不是从第 1 章开始。

## 怎么读

1. 先读正文 PDF，理解问题、公式和机制；
2. 再看实验 Notebook，观察算法在小任务上的行为；
3. 最后对比消融结果，找到“能运行”和“真正有效”的差别。

训练不收敛时，可以直接查 [RL 失败模式图鉴](failure-atlas.md)。每条记录都按“症状 → 机制 → 复现 → 修复”组织。

## 全部章节

| 章节 | 正文 | 实验 | 运行 |
| --- | --- | --- | --- |
| 1. 多臂老虎机：探索与利用 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/multi-armed-bandit/multi-armed-bandit.pdf) | [在线阅读](notes/multi-armed-bandit/multi-armed-bandit_experiments.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/multi-armed-bandit/multi-armed-bandit_experiments.ipynb) |
| 2. 马尔可夫决策过程 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/mdp/mdp.pdf) | [在线阅读](notes/mdp/mdp_experiments.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/mdp/mdp_experiments.ipynb) |
| 3. 时序差分学习 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/temporal-difference-learning/temporal-difference-learning.pdf) | [在线阅读](notes/temporal-difference-learning/temporal-difference-learning_experiments.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/temporal-difference-learning/temporal-difference-learning_experiments.ipynb) |
| 4. DQN：神经网络价值学习 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/dqn/dqn.pdf) | [在线阅读](notes/dqn/dqn_experiments.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/dqn/dqn_experiments.ipynb) |
| 5. Policy Gradient / REINFORCE | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/policy-gradient/pg.pdf) | [在线阅读](notes/policy-gradient/pg_experiments.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/policy-gradient/pg_experiments.ipynb) |
| 6. Actor-Critic / A2C | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/actor-critic/ac.pdf) | [在线阅读](notes/actor-critic/ac_experiments.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/actor-critic/ac_experiments.ipynb) |
| 7. PPO：约束策略更新 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/ppo/ppo.pdf) | [在线阅读](notes/ppo/ppo_experiments.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/ppo/ppo_experiments.ipynb) |
| 8. SAC：最大熵连续控制 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/sac/sac.pdf) | [在线阅读](notes/sac/sac_experiments.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/sac/sac_experiments.ipynb) |
| 9. 离线强化学习：CQL 与 IQL | [PDF](offline-rl-text) | [在线阅读](notes/offline-rl/offline-rl_experiments.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/offline-rl/offline-rl_experiments.ipynb) |
| 10. 模型式强化学习：Dyna-Q | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/model-based-rl/model-based-rl.pdf) | [在线阅读](notes/model-based-rl/model-based-rl_experiments.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/model-based-rl/model-based-rl_experiments.ipynb) |
| 11. Decision Transformer | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/decision-transformer/decision-transformer.pdf) | [在线阅读](notes/decision-transformer/decision-transformer_experiments.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/decision-transformer/decision-transformer_experiments.ipynb) |
| 12. RLHF：从偏好到奖励 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/rlhf/rlhf.pdf) | [在线阅读](notes/rlhf/rlhf_experiments.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/rlhf/rlhf_experiments.ipynb) |
| 13. DPO：不训奖励模型的偏好优化 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/dpo/dpo.pdf) | [在线阅读](notes/dpo/dpo_experiments.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/dpo/dpo_experiments.ipynb) |
| 14. GRPO 与 RLVR：可验证奖励 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/book/notes/grpo/grpo.pdf) | [在线阅读](notes/grpo/grpo_experiments.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/grpo/grpo_experiments.ipynb) |

本站点只展示仓库中保存的 Notebook 输出，不会在阅读时自动执行训练。想运行实验，请从章节表打开 Colab，或按仓库 [中文 README](https://github.com/Powfu-zwx/BreakRL/blob/main/README.zh.md#开始实验) 安装本地环境。
