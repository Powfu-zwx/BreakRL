# BreakRL

14 章强化学习讲义，提供中英文 PDF 和可运行的 Notebook。内容涵盖多臂老虎机、深度强化学习、离线强化学习，以及小任务上的 RLHF、DPO 和 GRPO。

[在线阅读](https://powfu-zwx.github.io/BreakRL/) · [交互演示](https://powfu-zwx.github.io/BreakRL/demo.html) · [失败图鉴](https://powfu-zwx.github.io/BreakRL/failure-atlas.html#atlas-8-offline-loss) · [English](README-en.md)

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

## 文件与维护

`book/notes/` 保存正文、实验和图表；`book/` 其余文件用于在线阅读；`tools/` 用于构建与检查。

章节清单在 `book/chapters.yml`。修改后运行 `python tools/sync_pages.py`；检查用 `python tools/check_repo.py`。改动 TeX 时一并更新 PDF。

## 许可

正文、图表和数据：[CC BY 4.0](LICENSE-CC-BY-4.0)。代码：[MIT](LICENSE-MIT)。引用信息见 [CITATION.cff](CITATION.cff)。
