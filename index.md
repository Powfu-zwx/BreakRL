# BreakRL

面向中英文读者的强化学习教学材料，覆盖从基础决策到深度强化学习、离线与模型式强化学习、决策 Transformer 的序列建模视角，以及 LLM 后训练三部曲（RLHF、DPO、GRPO/RLVR）。

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

全书提供中英双语版本：下表为中文版章节；英文版见下方 English 分区，或仓库 [README.en.md](https://github.com/Powfu-zwx/BreakRL/blob/main/README.en.md) 的章节表。站点右上角的「中文 / EN」按钮可随时切换语言，选择会被记住。

复现实验的环境配置见仓库 [README](https://github.com/Powfu-zwx/BreakRL#快速开始)。

文字、PDF、TeX、视觉材料与生成的数据文件采用 [CC BY 4.0](https://github.com/Powfu-zwx/BreakRL/blob/main/LICENSE)；Notebook 与仓库辅助脚本中的代码采用 [MIT 许可](https://github.com/Powfu-zwx/BreakRL/blob/main/LICENSE-CODE)。

---

# BreakRL (English)

**BreakRL** is a bilingual (Chinese and English), ablation-driven textbook on reinforcement learning: from multi-armed bandits through deep RL, offline and model-based methods, a Decision Transformer bridge into sequence modeling, and the LLM post-training trilogy (RLHF, DPO, GRPO/RLVR). Each chapter pairs a written derivation with reproducible experiments in which key mechanisms are removed — so you watch the algorithm fail, not just run.

- **Ablation-first**: PPO without clipping collapses to −8000, DQN without replay stalls at ~10 points, RLHF without a KL anchor gets reward-hacked;
- **[The RL Failure Atlas](failure-atlas-en.md)** (in English): 17 failure modes as *symptom → mechanism → reproduction → fix* — start here when training won't converge;
- **Fully reproducible**: small models and 3–20 seeds per chapter; Decision Transformer can take several hours on CPU, DPO about an hour, GRPO about 40 minutes, PPO about 30–60 minutes, and SAC about 20–40 minutes, with exact runtimes documented by each Notebook.

The full book is available in both Chinese and English; the table below links the English editions. The [English README](https://github.com/Powfu-zwx/BreakRL/blob/main/README.en.md) mirrors this in the repository. Use the 中文/EN switch in the top bar to toggle between editions at any time; the choice is remembered.

| # | Chapter | Experiments |
| --- | --- | --- |
| 1. Multi-armed bandits: exploration vs exploitation | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/multi-armed-bandit/multi-armed-bandit_en.pdf) | [Read online](notes/multi-armed-bandit/multi-armed-bandit_experiments_en.ipynb) |
| 2. Markov decision processes | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/mdp/mdp_en.pdf) | [Read online](notes/mdp/mdp_experiments_en.ipynb) |
| 3. Temporal-difference learning | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/temporal-difference-learning/temporal-difference-learning_en.pdf) | [Read online](notes/temporal-difference-learning/temporal-difference-learning_experiments_en.ipynb) |
| 4. DQN: neural value learning | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/dqn/dqn_en.pdf) | [Read online](notes/dqn/dqn_experiments_en.ipynb) |
| 5. Policy gradient / REINFORCE | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/policy-gradient/pg_en.pdf) | [Read online](notes/policy-gradient/pg_experiments_en.ipynb) |
| 6. Actor-Critic / A2C | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/actor-critic/ac_en.pdf) | [Read online](notes/actor-critic/ac_experiments_en.ipynb) |
| 7. PPO: constrained policy updates | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/ppo/ppo_en.pdf) | [Read online](notes/ppo/ppo_experiments_en.ipynb) |
| 8. SAC: maximum-entropy continuous control | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/sac/sac_en.pdf) | [Read online](notes/sac/sac_experiments_en.ipynb) |
| 9. Offline RL: CQL and IQL | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/offline-rl/offline-rl_en.pdf) | [Read online](notes/offline-rl/offline-rl_experiments_en.ipynb) |
| 10. Model-based RL: from environment models to Dyna-Q | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/model-based-rl/model-based-rl_en.pdf) | [Read online](notes/model-based-rl/model-based-rl_experiments_en.ipynb) |
| 11. Decision Transformer: RL as sequence modeling | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/decision-transformer/decision-transformer_en.pdf) | [Read online](notes/decision-transformer/decision-transformer_experiments_en.ipynb) |
| 12. RLHF: from preferences to rewards | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/rlhf/rlhf_en.pdf) | [Read online](notes/rlhf/rlhf_experiments_en.ipynb) |
| 13. DPO: preference optimization without a reward model | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/dpo/dpo_en.pdf) | [Read online](notes/dpo/dpo_experiments_en.ipynb) |
| 14. GRPO and RLVR: verifiable rewards | [PDF](https://github.com/Powfu-zwx/BreakRL/blob/main/notes/grpo/grpo_en.pdf) | [Read online](notes/grpo/grpo_experiments_en.ipynb) |
