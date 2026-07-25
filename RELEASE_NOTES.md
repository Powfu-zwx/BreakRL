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
