# v0.4.0 Release Notes

## What's New — Offline RL: CQL 与 IQL

第 9 章**离线强化学习**，完整提供 PDF + TeX 源码 + 实验 Notebook + 3 张配图。本章以「一个病，两种药」的结构让 **CQL 与 IQL 等权**：共同面对分布漂移（外推误差），CQL 把悲观写进价值函数，IQL 把悲观写进动作集合。

| # | 章节 | 内容 |
|---|---|---|
| 9 | 离线强化学习 | 外推误差（朴素离线 DQN 塌缩）、BC 及格线、CQL 保守惩罚、IQL in-sample 学习、两种悲观的分工 |

## Notes

- 实验在 **CartPole-v1** 的 medium 数据集上验证三张图：朴素离线 DQN 的 Q 估计与真实回报脱钩、跌破 BC；CQL 与 IQL 的回报都恢复到 BC 水平。
- 数据集 `offline_rl_medium.npz`（30k 条）由固定 seed 的「medium 检查点」行为策略以 ε=0.3 随机性采集，缓存为单源真理，notebook 可复现。
- BC 因训练 seed 方差较高，图中以 mean ± 1σ 灰色区间带表示「及格线」，判据为「恢复到 BC 水平」而非严格超过某个值。
- 全实验 CPU/GPU 可复现（约 5–8 分钟），学术绘图风格（serif、3 seeds 均值 ± 1σ）。

---

# v0.3.1 Release Notes

## Fixes

- 修正 `CITATION.cff` 中仓库地址的大小写（`tesauro` → `TESAURO`），品牌名统一大写。
- 发布 `run_jupyter.py`（Windows 证书库规避启动脚本），使 README 中的指引可直接使用。

## Changes

- 第 1–3 章插图改用 `[!htbp]` 浮动位置约定，避免 Overleaf 编译时的图片排版问题。

---

# v0.3.0 Release Notes

## What's New — Fundamentals Complete

前 3 章（多臂老虎机、MDP、时序差分学习）补齐到与算法章节同等的完整度，现在**全部 8 章**都提供 **PDF + TeX 源码 + 实验 Notebook + 配图**。

| # | 章节 | 新增内容 |
|---|---|---|
| 1 | 多臂老虎机 | 实验 Notebook（Greedy / ε-Greedy / UCB / Thompson 懊悔对比、最优臂选择比例、Thompson 后验演化）+ 3 张配图 |
| 2 | 马尔可夫决策过程 | **TeX 源码**（此前仅 PDF）+ 实验 Notebook（策略评估、值迭代价值波、策略迭代 vs 值迭代）+ 3 张配图 |
| 3 | 时序差分学习 | **TeX 源码**（此前仅 PDF）+ 实验 Notebook（TD vs MC 随机游走、N 步回报偏差-方差、悬崖行走 SARSA vs Q-Learning）+ 3 张配图 |

## Notes

- MAB 章节的衰减 ε-greedy 实验采用带下界的调度 ε_t = max(0.02, 1/(t+1))，并说明了纯 1/t 衰减在有限步数下几乎不探索（探索总量 ~ln T）的细节。
- 三个新 Notebook 沿用算法章节的学术绘图风格（serif、统一配色、多 seed 平均、mean ± 1σ 阴影），全部 CPU 可复现（< 2 分钟）。
- 前 3 章的 PDF 均以 TeX 源码重新编译生成。

---

# v0.2.0 Release Notes

## Breaking Changes

- **Directory flattened**: `notes/fundamentals/*` → `notes/*` 
- **Chapters removed**: n-step TD, 主线串讲 (mainline-summary)

## Content (8 chapters)

| # | Chapter |
|---|---|
| 1 | 多臂老虎机 (Multi-Armed Bandit) |
| 2 | 马尔可夫决策过程 (MDP) |
| 3 | 时序差分学习 (TD Learning) |
| 4 | DQN |
| 5 | Policy Gradient / REINFORCE |
| 6 | Actor-Critic / A2C |
| 7 | PPO |
| 8 | SAC |

前 3 章提供 PDF，后 5 章含 PDF + TeX + Jupyter Notebook。

## Rationale

砍掉偏题内容和中间过渡章节，收紧到一条清晰的 deep model-free RL 主线：价值估计 → 策略梯度 → Actor-Critic → PPO → SAC。
