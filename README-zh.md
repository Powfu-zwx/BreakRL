<div align="center">

# BreakRL

**讲清楚一个算法，再拆掉它的关键机制，看着它失败。**

14 章强化学习讲义 · 中英文 PDF · 可运行 Notebook · 消融实验

[![Stars](https://img.shields.io/github/stars/Powfu-zwx/BreakRL?style=flat-square&color=yellow)](https://github.com/Powfu-zwx/BreakRL/stargazers)
[![Forks](https://img.shields.io/github/forks/Powfu-zwx/BreakRL?style=flat-square&color=blue)](https://github.com/Powfu-zwx/BreakRL/network/members)
[![License: MIT](https://img.shields.io/badge/代码许可-MIT-green?style=flat-square)](LICENSE-MIT)
[![License: CC BY 4.0](https://img.shields.io/badge/正文许可-CC%20BY%204.0-orange?style=flat-square)](LICENSE-CC-BY-4.0)
[![Python](https://img.shields.io/badge/Python-3.10-blue?style=flat-square)](requirements.txt)

**[在线阅读](https://powfu-zwx.github.io/BreakRL/) · [交互演示](https://powfu-zwx.github.io/BreakRL/demo.html) · [失败图鉴](https://powfu-zwx.github.io/BreakRL/failure-atlas.html#atlas-8-offline-loss) · [English](README.md)**

</div>

## 为什么是 BreakRL

多数教材只展示算法能跑通的那一面。BreakRL 反过来：**先讲清原理，再刻意移除关键机制做消融，让你在失败中理解每个组件为什么存在**。

| 推导 | 运行 | 破坏 |
| --- | --- | --- |
| 每章从第一性原理推导公式，不跳步 | 每章附带可运行 Notebook，Colab 一键启动 | 每章内置消融实验，观察算法退化过程 |

内容覆盖经典 RL（老虎机、TD、DQN、PPO、SAC）、离线 RL 与模型式 RL、Decision Transformer，以及基于小任务的 RLHF、DPO、GRPO 后训练机制。

## 章节

每章包含推导、代码和消融实验。第 12–14 章使用玩具任务讲解后训练机制。

<!-- chapters:begin -->
| # | 章节 | 正文 | 实验 | 运行 |
| --- | --- | --- | --- | --- |
| 1 | 多臂老虎机：探索与利用 | [PDF](book/notes/multi-armed-bandit/multi-armed-bandit.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/multi-armed-bandit/multi-armed-bandit.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/multi-armed-bandit/multi-armed-bandit.ipynb) |
| 2 | 马尔可夫决策过程：序列决策形式化 | [PDF](book/notes/mdp/mdp.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/mdp/mdp.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/mdp/mdp.ipynb) |
| 3 | 时序差分学习：长期价值估计 | [PDF](book/notes/temporal-difference-learning/temporal-difference-learning.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/temporal-difference-learning/temporal-difference-learning.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/temporal-difference-learning/temporal-difference-learning.ipynb) |
| 4 | DQN：神经网络价值学习 | [PDF](book/notes/dqn/dqn.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/dqn/dqn.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/dqn/dqn.ipynb) |
| 5 | Policy Gradient / REINFORCE：直接优化策略 | [PDF](book/notes/policy-gradient/policy-gradient.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/policy-gradient/policy-gradient.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/policy-gradient/policy-gradient.ipynb) |
| 6 | Actor-Critic / A2C：价值辅助策略更新 | [PDF](book/notes/actor-critic/actor-critic.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/actor-critic/actor-critic.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/actor-critic/actor-critic.ipynb) |
| 7 | PPO：约束策略更新 | [PDF](book/notes/ppo/ppo.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/ppo/ppo.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/ppo/ppo.ipynb) |
| 8 | SAC：最大熵连续控制 | [PDF](book/notes/sac/sac.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/sac/sac.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/sac/sac.ipynb) |
| 9 | 离线强化学习：CQL 与 IQL | [PDF](book/notes/offline-rl/offline-rl.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/offline-rl/offline-rl.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/offline-rl/offline-rl.ipynb) |
| 10 | 模型式强化学习：从环境模型到 Dyna-Q | [PDF](book/notes/model-based-rl/model-based-rl.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/model-based-rl/model-based-rl.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/model-based-rl/model-based-rl.ipynb) |
| 11 | Decision Transformer：序列建模的强化学习 | [PDF](book/notes/decision-transformer/decision-transformer.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/decision-transformer/decision-transformer.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/decision-transformer/decision-transformer.ipynb) |
| 12 | RLHF：从偏好到奖励 | [PDF](book/notes/rlhf/rlhf.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/rlhf/rlhf.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/rlhf/rlhf.ipynb) |
| 13 | DPO：不训奖励模型的偏好优化 | [PDF](book/notes/dpo/dpo.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/dpo/dpo.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/dpo/dpo.ipynb) |
| 14 | GRPO 与 RLVR：可验证奖励 | [PDF](book/notes/grpo/grpo.pdf) | [Notebook](https://powfu-zwx.github.io/BreakRL/notes/grpo/grpo.html) | [Colab](https://colab.research.google.com/github/Powfu-zwx/BreakRL/blob/main/book/notes/grpo/grpo.ipynb) |
<!-- chapters:end -->

## 运行实验

点击表中的 **Colab** 可直接运行。网页展示已保存的输出，无需安装环境。

本地使用 Python 3.10：

```bash
conda create -n rl_env python=3.10
conda activate rl_env
python -m pip install -r requirements.txt
python -m ipykernel install --user --name rl_env --display-name rl_env
python tools/run_jupyter.py
```

打开 `book/notes/<章节>/<章节>.ipynb`，选择 `rl_env` 内核。无后缀为中文版，`-en` 为英文版。

## 项目结构

```
book/
  notes/          # 各章正文（TeX/PDF）、实验 Notebook 和图表
  chapters.yml    # 章节清单，README 表格和站点目录由它生成
  _toc.yml        # Jupyter Book 目录（自动生成）
tools/            # 构建与检查脚本
```

修改章节后运行 `python tools/sync_pages.py` 同步页面；`python tools/check_repo.py` 做一致性检查。改动 TeX 时一并更新 PDF。

## 许可与引用

正文、图表和数据：[CC BY 4.0](LICENSE-CC-BY-4.0)。代码：[MIT](LICENSE-MIT)。

引用信息见 [CITATION.cff](CITATION.cff)，或点击 GitHub 侧栏的 "Cite this repository" 直接复制 BibTeX。

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Powfu-zwx/BreakRL&type=Date)](https://star-history.com/#Powfu-zwx/BreakRL&Date)
