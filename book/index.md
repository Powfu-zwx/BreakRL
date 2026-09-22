# BreakRL

**从失败中学强化学习。**

BreakRL 是一份双语、失败优先的强化学习讲义。每章先讲清一个机制，再把它去掉，让你看见失败。

## 三分钟上手

1. 打开[最小演示](demo)，拖动覆盖率滑块（教学示意图，不训练模型）；
2. 打开 <a href="failure-atlas.html#atlas-8-offline-loss">失败图鉴第 8 条</a>（离线损失正常，回报塌缩）；
3. 读离线强化学习章：[正文 PDF](offline-rl-text) 与[已保存的实验](notes/offline-rl/offline-rl.ipynb)。

阅读不需要装任何东西。页面渲染已保存的输出，不会训练。下表是其余各章；从上面这三步开始，不必从第 1 章读起。

## 怎么读

1. 读正文，看问题、公式和机制；
2. 打开实验 notebook，在小任务上看算法怎么跑；
3. 对比消融：跑完了不等于方法可用。

训练不收敛时，按症状查 [RL 失败模式图鉴](failure-atlas.md)（「症状 → 机制 → 复现 → 修复」）。

## 全部章节

<!-- chapters:begin -->
| # | 章节 | 正文 | 实验 | 运行 |
| --- | --- | --- | --- | --- |
| 1 | 多臂老虎机：探索与利用 | [PDF](notes/multi-armed-bandit/multi-armed-bandit.pdf) | [Notebook](notes/multi-armed-bandit/multi-armed-bandit.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/multi-armed-bandit/multi-armed-bandit.ipynb) |
| 2 | 马尔可夫决策过程：序列决策形式化 | [PDF](notes/mdp/mdp.pdf) | [Notebook](notes/mdp/mdp.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/mdp/mdp.ipynb) |
| 3 | 时序差分学习：长期价值估计 | [PDF](notes/temporal-difference-learning/temporal-difference-learning.pdf) | [Notebook](notes/temporal-difference-learning/temporal-difference-learning.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/temporal-difference-learning/temporal-difference-learning.ipynb) |
| 4 | DQN：神经网络价值学习 | [PDF](notes/dqn/dqn.pdf) | [Notebook](notes/dqn/dqn.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/dqn/dqn.ipynb) |
| 5 | Policy Gradient / REINFORCE：直接优化策略 | [PDF](notes/policy-gradient/policy-gradient.pdf) | [Notebook](notes/policy-gradient/policy-gradient.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/policy-gradient/policy-gradient.ipynb) |
| 6 | Actor-Critic / A2C：价值辅助策略更新 | [PDF](notes/actor-critic/actor-critic.pdf) | [Notebook](notes/actor-critic/actor-critic.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/actor-critic/actor-critic.ipynb) |
| 7 | PPO：约束策略更新 | [PDF](notes/ppo/ppo.pdf) | [Notebook](notes/ppo/ppo.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/ppo/ppo.ipynb) |
| 8 | SAC：最大熵连续控制 | [PDF](notes/sac/sac.pdf) | [Notebook](notes/sac/sac.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/sac/sac.ipynb) |
| 9 | 离线强化学习：CQL 与 IQL | [PDF](notes/offline-rl/offline-rl.pdf) | [Notebook](notes/offline-rl/offline-rl.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/offline-rl/offline-rl.ipynb) |
| 10 | 模型式强化学习：从环境模型到 Dyna-Q | [PDF](notes/model-based-rl/model-based-rl.pdf) | [Notebook](notes/model-based-rl/model-based-rl.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/model-based-rl/model-based-rl.ipynb) |
| 11 | Decision Transformer：序列建模的强化学习 | [PDF](notes/decision-transformer/decision-transformer.pdf) | [Notebook](notes/decision-transformer/decision-transformer.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/decision-transformer/decision-transformer.ipynb) |
| 12 | RLHF：从偏好到奖励 | [PDF](notes/rlhf/rlhf.pdf) | [Notebook](notes/rlhf/rlhf.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/rlhf/rlhf.ipynb) |
| 13 | DPO：不训奖励模型的偏好优化 | [PDF](notes/dpo/dpo.pdf) | [Notebook](notes/dpo/dpo.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/dpo/dpo.ipynb) |
| 14 | GRPO 与 RLVR：可验证奖励 | [PDF](notes/grpo/grpo.pdf) | [Notebook](notes/grpo/grpo.ipynb) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/grpo/grpo.ipynb) |
<!-- chapters:end -->

第 12–14 章用玩具序列任务和两位数加法讲机制，不能替代真实的 RLHF、DPO 或 GRPO 训练。

站点展示已保存的 notebook 输出，阅读时不会训练模型。要运行实验，用上表的 Colab，或按 [README](https://github.com/Powfu-zwx/BreakRL/blob/main/README.md#运行实验) 装本地环境。
