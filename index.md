# BreakRL

面向中文读者的强化学习教学材料，覆盖从基础决策到深度强化学习、离线与模型式强化学习、决策 Transformer 的序列建模视角，以及 LLM 后训练三部曲（RLHF、DPO、GRPO/RLVR）。

与同类教材的区别：每章实验都是**消融对照**——不只展示算法怎么跑通，更让你亲眼看到去掉关键机制后它如何失败。

**训练不收敛？** 从症状出发查 [RL 失败模式图鉴](failure-atlas.md)：每条失败模式都有根因机制、可复现的消融实验与修复手段。

每章由两部分组成：**正文 PDF**（叙事、公式推导与机制分析）与**实验 Notebook**（可复现实验与配图）。本站点在线渲染全部实验 Notebook；正文 PDF 通过下表链接查看。源码仓库：[github.com/Powfu-zwx/BreakRL](https://github.com/Powfu-zwx/BreakRL)。

| 章节 | 正文 | 实验 |
| --- | --- | --- |
| 1. 多臂老虎机：探索与利用 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/multi-armed-bandit/multi-armed-bandit.pdf) | [在线阅读](notes/multi-armed-bandit/multi-armed-bandit_experiments.ipynb) |
| 2. 马尔可夫决策过程：序列决策形式化 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/mdp/mdp.pdf) | [在线阅读](notes/mdp/mdp_experiments.ipynb) |
| 3. 时序差分学习：长期价值估计 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/temporal-difference-learning/temporal-difference-learning.pdf) | [在线阅读](notes/temporal-difference-learning/temporal-difference-learning_experiments.ipynb) |
| 4. DQN：神经网络价值学习 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/dqn/dqn.pdf) | [在线阅读](notes/dqn/dqn_experiments.ipynb) |
| 5. Policy Gradient / REINFORCE：直接优化策略 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/policy-gradient/pg.pdf) | [在线阅读](notes/policy-gradient/pg_experiments.ipynb) |
| 6. Actor-Critic / A2C：价值辅助策略更新 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/actor-critic/ac.pdf) | [在线阅读](notes/actor-critic/ac_experiments.ipynb) |
| 7. PPO：约束策略更新 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/ppo/ppo.pdf) | [在线阅读](notes/ppo/ppo_experiments.ipynb) |
| 8. SAC：最大熵连续控制 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/sac/sac.pdf) | [在线阅读](notes/sac/sac_experiments.ipynb) |
| 9. 离线强化学习：CQL 与 IQL | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/offline-rl/offline-rl.pdf) | [在线阅读](notes/offline-rl/offline-rl_experiments.ipynb) |
| 10. 模型式强化学习：从环境模型到 Dyna-Q | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/model-based-rl/model-based-rl.pdf) | [在线阅读](notes/model-based-rl/model-based-rl_experiments.ipynb) |
| 11. Decision Transformer：序列建模的强化学习 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/decision-transformer/decision-transformer.pdf) | [在线阅读](notes/decision-transformer/decision-transformer_experiments.ipynb) |
| 12. RLHF：从偏好到奖励 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/rlhf/rlhf.pdf) | [在线阅读](notes/rlhf/rlhf_experiments.ipynb) |
| 13. DPO：不训奖励模型的偏好优化 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/dpo/dpo.pdf) | [在线阅读](notes/dpo/dpo_experiments.ipynb) |
| 14. GRPO 与 RLVR：可验证奖励 | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/grpo/grpo.pdf) | [在线阅读](notes/grpo/grpo_experiments.ipynb) |

复现实验的环境配置见仓库 [README](https://github.com/Powfu-zwx/BreakRL#快速开始)。

文字、PDF 与视觉材料采用 [CC BY 4.0](https://github.com/Powfu-zwx/BreakRL/blob/main/LICENSE)；Notebook 代码采用 [MIT 许可](https://github.com/Powfu-zwx/BreakRL/blob/main/LICENSE-CODE)。
