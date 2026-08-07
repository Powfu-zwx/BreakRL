# TESAURO

<p align="center">
  <img src="assets/tesauro-wordmark.png" width="560" alt="TESAURO">
</p>

<p align="center">
  <strong>Reinforcement Learning Fundamentals</strong><br>
  从价值估计到连续控制，把强化学习讲成可推导、可运行、可复现的系统。
</p>

<p align="center">
  <img src="assets/tesauro-dqn-preview.png" width="960" alt="DQN lesson page, notebook implementation, and experiment result">
</p>

TESAURO 是一套面向中文读者的强化学习教学材料。每一章围绕一个明确问题展开：先建立直觉，再给出必要公式，最后用可运行的 notebook 观察结论如何在实验中成立或失效。

当前发布的是 **Fundamentals**：一条从多臂老虎机、MDP 和 TD learning 出发，通向 DQN、PPO 与 SAC 的经典深度 model-free RL 主线。

## 如何使用

1. 按下方顺序阅读 PDF，先建立整体的决策与价值学习框架。
2. 在涉及算法的章节中对照 TeX，追踪目标函数、估计量和稳定化机制。
3. 运行 notebook，改变随机种子、超参数或算法组件，亲自观察训练曲线与失败模式。

建议具备 Python、基础概率论以及 PyTorch 入门知识。阅读本项目不要求预先掌握强化学习。

## 内容

| # | 章节 | 核心问题 | 材料 |
|---|---|---|---|
| 1 | [多臂老虎机](notes/multi-armed-bandit/multi-armed-bandit.pdf) | 探索与利用如何权衡？ | [PDF](notes/multi-armed-bandit/multi-armed-bandit.pdf) · [TeX](notes/multi-armed-bandit/multi-armed-bandit.tex) |
| 2 | [马尔可夫决策过程](notes/mdp/mdp.pdf) | 如何形式化一个序列决策问题？ | PDF |
| 3 | [时序差分学习](notes/temporal-difference-learning/temporal-difference-learning.pdf) | 如何从一步反馈中估计长期价值？ | PDF |
| 4 | [DQN](notes/dqn/dqn.pdf) | 神经网络如何稳定地学习价值函数？ | [PDF](notes/dqn/dqn.pdf) · [TeX](notes/dqn/dqn.tex) · [Notebook](notes/dqn/dqn_experiments.ipynb) |
| 5 | [Policy Gradient / REINFORCE](notes/policy-gradient/pg.pdf) | 为什么直接优化策略？ | [PDF](notes/policy-gradient/pg.pdf) · [TeX](notes/policy-gradient/pg.tex) · [Notebook](notes/policy-gradient/pg_experiments.ipynb) |
| 6 | [Actor-Critic / A2C](notes/actor-critic/ac.pdf) | 价值估计如何帮助策略更新？ | [PDF](notes/actor-critic/ac.pdf) · [TeX](notes/actor-critic/ac.tex) · [Notebook](notes/actor-critic/ac_experiments.ipynb) |
| 7 | [PPO](notes/ppo/ppo.pdf) | 如何约束策略更新的幅度？ | [PDF](notes/ppo/ppo.pdf) · [TeX](notes/ppo/ppo.tex) · [Notebook](notes/ppo/ppo_experiments.ipynb) |
| 8 | [SAC](notes/sac/sac.pdf) | 连续控制中如何兼顾探索与利用？ | [PDF](notes/sac/sac.pdf) · [TeX](notes/sac/sac.tex) · [Notebook](notes/sac/sac_experiments.ipynb) |

第 1 章提供 PDF 与 TeX；第 2–3 章目前提供 PDF；算法章节（4–8）同时提供 TeX 源码与 notebook。

## 材料的组织方式

- **笔记**：解释一个方法要解决什么问题，以及它为什么这样设计。
- **推导**：保留目标函数、关键近似和实现假设，便于回查细节。
- **实验**：以受控 toy 环境检验单个机制的作用，不将局部现象包装成通用性能结论。

## 运行 Notebook

实验使用 Python、PyTorch 与 Gymnasium。推荐用 conda 环境 **`rl_env`**：

```bash
conda activate rl_env
python -m ipykernel install --user --name rl_env --display-name rl_env
jupyter lab
```

若从零创建环境，也可：

```bash
python -m venv .venv
pip install -r requirements.txt
jupyter lab
```

打开对应章节目录中的 `*_experiments.ipynb`，内核选择 **rl_env**（或当前虚拟环境）。实验默认可用 CPU；若系统可用，PyTorch 会自动使用 CUDA。

本地工作区若遇 Windows 证书库导致 JupyterLab 无法启动，可用仓库根目录的 `python run_jupyter.py`。

## 当前范围

本版本聚焦经典深度 model-free RL，覆盖价值学习、策略梯度、Actor-Critic、稳定策略优化与最大熵连续控制。模型式强化学习、多智能体强化学习及其他主题不包含在本次发布中。

## 许可

文字、PDF、TeX 与视觉材料采用 [CC BY 4.0](LICENSE)；Jupyter notebook 中的代码采用 [MIT 许可](LICENSE-CODE)。引用方式见 [CITATION.cff](CITATION.cff)。
