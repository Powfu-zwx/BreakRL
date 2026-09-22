<div align="center">

<img src="assets/breakrl-wordmark.png" alt="BreakRL" width="400">

<p>
  <a href="https://powfu-zwx.github.io/BreakRL/"><img alt="在线阅读" src="https://img.shields.io/badge/read-online-0e8a16"></a>
  <a href="https://github.com/Powfu-zwx/BreakRL/actions/workflows/quality.yml"><img alt="仓库检查" src="https://github.com/Powfu-zwx/BreakRL/actions/workflows/quality.yml/badge.svg"></a>
  <a href="https://doi.org/10.5281/zenodo.21966485"><img alt="DOI" src="https://zenodo.org/badge/DOI/10.5281/zenodo.21966485.svg"></a>
  <a href="requirements.txt"><img alt="Python 3.10" src="https://img.shields.io/badge/python-3.10-3776AB"></a>
  <a href="LICENSE-CC-BY-4.0"><img alt="文本许可 CC BY 4.0" src="https://img.shields.io/badge/license-CC%20BY%204.0-lightgrey"></a>
  <a href="LICENSE-MIT"><img alt="代码许可 MIT" src="https://img.shields.io/badge/code-MIT-blue"></a>
</p>

**从失败中学强化学习**

每一章都是一次消融：从老虎机讲到 PPO 与 SAC，再到离线强化学习，最后是玩具任务上的 RLHF / DPO / GRPO。

<p>
  <a href="https://powfu-zwx.github.io/BreakRL/"><b>在线阅读</b></a> ·
  <a href="https://powfu-zwx.github.io/BreakRL/demo.html"><b>最小演示</b></a> ·
  <a href="https://powfu-zwx.github.io/BreakRL/failure-atlas.html#atlas-8-offline-loss"><b>图鉴第 8 条</b></a> ·
  <a href="https://powfu-zwx.github.io/BreakRL/notes/offline-rl/offline-rl.html"><b>离线强化学习</b></a> ·
  <a href="README-en.md"><b>English</b></a>
</p>

</div>

BreakRL 是一份双语、失败优先的强化学习**讲义**。每章先讲清一个机制，再把它去掉，让你看见失败。第 12–14 章用玩具序列任务和两位数加法讲机制，不能替代真实的 RLHF、DPO 或 GRPO 训练。

中文是源件，英文是译本；文件名无后缀为中文，`-en` 为英文。

<p align="center">
  <a href="https://powfu-zwx.github.io/BreakRL/demo.html"><img src="assets/readme-demo.gif" alt="最小演示：数据覆盖率低时损失下降、实际回报塌缩" width="720"></a>
</p>

<p align="center">
  打开<a href="https://powfu-zwx.github.io/BreakRL/demo.html">最小演示</a>拖动数据覆盖率：覆盖率低时，教学示意图会让损失一路下降而回报塌缩。它不训练模型。
</p>

## 三分钟上手

1. 打开[最小演示](https://powfu-zwx.github.io/BreakRL/demo.html)，拖动覆盖率滑块（教学示意图，不训练）；
2. 打开[失败图鉴第 8 条](https://powfu-zwx.github.io/BreakRL/failure-atlas.html#atlas-8-offline-loss)：离线损失正常，回报塌缩；
3. 读[离线强化学习章](https://powfu-zwx.github.io/BreakRL/notes/offline-rl/offline-rl.html)——[正文 PDF](https://powfu-zwx.github.io/BreakRL/offline-rl-text.html)。

阅读不需要装任何东西：站点只渲染已保存的实验输出。要重跑某一章，用下表的 Colab，或装本地环境改 notebook。下表是其余各章；从上面这三步开始，不必从第 1 章读起。

阅读循环是：

1. 读正文，看问题、公式和机制；
2. 打开 notebook，在小任务上看算法怎么跑；
3. 对比消融：跑完了不等于方法可用。

## 学习路径

| 阶段 | 章节 | 重点 |
| --- | --- | --- |
| 基础 | 1–3 | 探索、MDP、时序差分学习 |
| 深度强化学习 | 4–8 | DQN、策略梯度、Actor-Critic、PPO、SAC |
| 新视角 | 9–11 | 离线强化学习、模型式强化学习、Decision Transformer |
| 玩具后训练 | 12–14 | 玩具序列与两位数加法上的 RLHF、DPO、GRPO/RLVR |

## 章节

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

## 失败图鉴

训练不收敛时，从症状查起：回报塌缩、Q 值一路涨但策略变差、离线损失正常而回报塌缩、代理奖励上涨而真实质量下降。

先看[图鉴第 8 条](https://powfu-zwx.github.io/BreakRL/failure-atlas.html#atlas-8-offline-loss)（离线损失正常，回报塌缩），或[浏览完整图鉴](https://powfu-zwx.github.io/BreakRL/failure-atlas.html)。每条按「症状 → 机制 → 复现 → 修复」展开。

## 运行实验

站点展示已保存的 notebook 输出，阅读时不会训练模型。

**零安装：** 点上表的 **Colab**。第一个代码单元会克隆本仓库、装实验依赖并进入章节目录，让相对路径可用。有些章节在 CPU 上一分钟内跑完；PPO 大约一小时，Decision Transformer 在 CPU 上可能要几小时。

本地运行用 Python 3.10、PyTorch 与 Gymnasium：

```bash
conda create -n rl_env python=3.10
conda activate rl_env
python -m pip install -r requirements.txt
python -m ipykernel install --user --name rl_env --display-name rl_env
python tools/run_jupyter.py
```

打开 `book/notes/<chapter>/<chapter>.ipynb`，选 `rl_env` 内核。

## 引用与许可

教学、学习或研究用途见 [CITATION.cff](CITATION.cff)。正文、PDF、TeX、图和生成数据用 [CC BY 4.0](LICENSE-CC-BY-4.0)；notebook 与辅助脚本中的代码用 [MIT License](LICENSE-MIT)。发布历史见 [docs/CHANGELOG.md](docs/CHANGELOG.md)。

贡献指南见 [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)。

## 仓库结构

| 路径 | 用途 |
| --- | --- |
| [`book/`](book/) | 在线书：章节、实验、最小演示、失败图鉴 |
| [`book/chapters.yml`](book/chapters.yml) | 章节唯一清单，各处表格由此生成 |
| [`tools/`](tools/) | 一致性检查、Colab 引导、构建辅助 |
| [`docs/`](docs/) | 贡献指南、安全策略、变更日志 |
| [`assets/`](assets/) | README 品牌图与演示 GIF |
