<div align="center">

<img src="assets/breakrl-wordmark.png" alt="BreakRL" width="400">

**消融实验驱动的强化学习教材**

从多臂老虎机到 RLHF · DPO · GRPO/RLVR —— 每章一份正文推导、一组可复现的消融实验

<p>
  <a href="https://github.com/Powfu-zwx/BreakRL/tags"><img src="https://img.shields.io/github/v/tag/Powfu-zwx/BreakRL?label=release&style=flat-square&color=2166AC" alt="release"></a>
  <a href="https://doi.org/10.5281/zenodo.21966485"><img src="https://zenodo.org/badge/DOI/10.5281/zenodo.21966485.svg" alt="DOI" style="max-width:100%"></a>
  <a href="https://github.com/Powfu-zwx/BreakRL/actions/workflows/quality.yml"><img src="https://img.shields.io/github/actions/workflow/status/Powfu-zwx/BreakRL/quality.yml?branch=main&label=checks&style=flat-square" alt="checks"></a>
  <a href="https://powfu-zwx.github.io/BreakRL/"><img src="https://img.shields.io/github/actions/workflow/status/Powfu-zwx/BreakRL/site.yml?branch=main&label=site&style=flat-square" alt="site"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-CC%20BY%204.0%20%2B%20MIT-97ca00?style=flat-square" alt="license"></a>
</p>

<p>
  <a href="README.en.md"><b>English</b></a> ·
  <a href="https://powfu-zwx.github.io/BreakRL/"><b>在线阅读</b></a> ·
  <a href="https://powfu-zwx.github.io/BreakRL/failure-atlas.html"><b>失败模式图鉴</b></a> ·
  <a href="#章节">章节</a> ·
  <a href="#快速开始">快速开始</a> ·
  <a href="#引用">引用</a>
</p>

</div>

---

与同类教材的区别：**每章实验都是消融对照**——不只展示算法怎么跑通，更让你亲眼看到去掉关键机制后它如何失败。

- **消融对照**：PPO 去掉 clip 崩到 −8000、DQN 去掉回放卡在 10 分、RLHF 去掉 KL 锚被 reward hacking 击穿——每章三张图，机制与失败各占一半；
- **失败模式图鉴**：全部失败案例按「症状 → 机制 → 复现 → 修复」汇总成[速查表](https://powfu-zwx.github.io/BreakRL/failure-atlas.html)，训练不收敛时按症状查根因；
- **全部可复现**：小模型、小任务、多随机种子（各章 3–20 个），单机 CPU/GPU 分钟级跑完任意一章的全部实验；
- **定位差异**：在位教材《动手学强化学习》与蘑菇书 EasyRL 讲「算法怎么工作」，BreakRL 讲「算法怎么失败」，并覆盖 RLHF / DPO / GRPO 后训练主线。

## 章节

| # | 章节 | 正文 | 实验 |
|---|------|------|------|
| 1 | 多臂老虎机：探索与利用 | [PDF](notes/multi-armed-bandit/multi-armed-bandit.pdf) | [在线阅读](https://powfu-zwx.github.io/BreakRL/notes/multi-armed-bandit/multi-armed-bandit_experiments.html) |
| 2 | 马尔可夫决策过程：序列决策形式化 | [PDF](notes/mdp/mdp.pdf) | [在线阅读](https://powfu-zwx.github.io/BreakRL/notes/mdp/mdp_experiments.html) |
| 3 | 时序差分学习：长期价值估计 | [PDF](notes/temporal-difference-learning/temporal-difference-learning.pdf) | [在线阅读](https://powfu-zwx.github.io/BreakRL/notes/temporal-difference-learning/temporal-difference-learning_experiments.html) |
| 4 | DQN：神经网络价值学习 | [PDF](notes/dqn/dqn.pdf) | [在线阅读](https://powfu-zwx.github.io/BreakRL/notes/dqn/dqn_experiments.html) |
| 5 | Policy Gradient / REINFORCE：直接优化策略 | [PDF](notes/policy-gradient/pg.pdf) | [在线阅读](https://powfu-zwx.github.io/BreakRL/notes/policy-gradient/pg_experiments.html) |
| 6 | Actor-Critic / A2C：价值辅助策略更新 | [PDF](notes/actor-critic/ac.pdf) | [在线阅读](https://powfu-zwx.github.io/BreakRL/notes/actor-critic/ac_experiments.html) |
| 7 | PPO：约束策略更新 | [PDF](notes/ppo/ppo.pdf) | [在线阅读](https://powfu-zwx.github.io/BreakRL/notes/ppo/ppo_experiments.html) |
| 8 | SAC：最大熵连续控制 | [PDF](notes/sac/sac.pdf) | [在线阅读](https://powfu-zwx.github.io/BreakRL/notes/sac/sac_experiments.html) |
| 9 | 离线强化学习：CQL 与 IQL | [PDF](notes/offline-rl/offline-rl.pdf) | [在线阅读](https://powfu-zwx.github.io/BreakRL/notes/offline-rl/offline-rl_experiments.html) |
| 10 | 模型式强化学习：从环境模型到 Dyna-Q | [PDF](notes/model-based-rl/model-based-rl.pdf) | [在线阅读](https://powfu-zwx.github.io/BreakRL/notes/model-based-rl/model-based-rl_experiments.html) |
| 11 | Decision Transformer：序列建模的强化学习 | [PDF](notes/decision-transformer/decision-transformer.pdf) | [在线阅读](https://powfu-zwx.github.io/BreakRL/notes/decision-transformer/decision-transformer_experiments.html) |
| 12 | RLHF：从偏好到奖励 | [PDF](notes/rlhf/rlhf.pdf) | [在线阅读](https://powfu-zwx.github.io/BreakRL/notes/rlhf/rlhf_experiments.html) |
| 13 | DPO：不训奖励模型的偏好优化 | [PDF](notes/dpo/dpo.pdf) | [在线阅读](https://powfu-zwx.github.io/BreakRL/notes/dpo/dpo_experiments.html) |
| 14 | GRPO 与 RLVR：可验证奖励 | [PDF](notes/grpo/grpo.pdf) | [在线阅读](https://powfu-zwx.github.io/BreakRL/notes/grpo/grpo_experiments.html) |

第 1–10 章构成经典主线（价值学习 → 策略优化 → 离线与模型式），第 11 章以序列建模桥接经典 RL 与 LLM，第 12–14 章是 LLM 后训练三部曲。新章节从 [`notes/rl_note_template.tex`](notes/rl_note_template.tex) 复制骨架开始写。

## RL 失败模式图鉴

17 种失败模式的症状速查表：「回报断崖式崩盘」「Q 值一路涨、策略却变差」「离线训练损失正常、回报塌缩」「奖励没问题、就是学不动」……每条给出根因机制、可一键复现的消融实验与修复手段。

→ [powfu-zwx.github.io/BreakRL/failure-atlas.html](https://powfu-zwx.github.io/BreakRL/failure-atlas.html)

## 快速开始

实验统一使用 conda 环境 **`rl_env`**（Python 3.10、PyTorch、Gymnasium），依赖以 [`requirements.txt`](requirements.txt) 为准：

```bash
conda create -n rl_env python=3.10
conda activate rl_env
python -m pip install -r requirements.txt
python -m ipykernel install --user --name rl_env --display-name rl_env
```

运行 Notebook（`run_jupyter.py` 内置 Windows 证书库规避；本机无此问题时可直接 `python -m jupyter lab`）：

```bash
conda activate rl_env
python run_jupyter.py
```

打开 `notes/<chapter>/*_experiments.ipynb`，内核选择 **rl_env**。重跑实验时请将输出写到仓库外的临时目录，避免覆盖已跟踪的实验产物。

## 编译与站点

**章节 PDF**：TeX 使用 XeLaTeX + ctex 编译，可在 Overleaf 完成，也可用本机 conda 环境 `tex_env` 中的 Tectonic。模板与所有章节统一使用 `[!htbp]` figure 浮动约定；没有 TeX 工具时不要手工修改 PDF。

```bash
conda run -n tex_env tectonic notes/<chapter>/<chapter>.tex
```

**在线站点**：Jupyter Book 渲染 `_toc.yml` 中的实验 Notebook（只读已保存输出，不重新执行），push 到 main 后 [`site.yml`](.github/workflows/site.yml) 自动构建并部署到 GitHub Pages（首次需在 Settings → Pages 将 Source 设为 GitHub Actions）。本地预览：

```bash
uvx --from "jupyter-book>=1.0,<2" jupyter-book build .   # 产物在 _build/html/
```

## 贡献

欢迎 issue 与 PR，完整指南见 [`CONTRIBUTING.md`](CONTRIBUTING.md)。要点：

1. 修改 `notes/` 中的 TeX、Notebook 或实验资源；
2. 运行结构检查：`python scripts/check_consistency.py`（只读验证章节结构、TeX figure 约定与 `_toc.yml` 覆盖，不执行训练、不编译 PDF；GitHub Actions 在 push 与 pull request 上自动运行同一检查）；
3. 检查完整 diff，提交变更；
4. 由维护者根据 [`CITATION.cff`](CITATION.cff) 更新版本并创建 release tag。

## 引用

仓库页右侧的 "Cite this repository" 可直接导出引用；元数据与当前版本号见 [`CITATION.cff`](CITATION.cff)。各版本已归档至 Zenodo：概念 DOI [`10.5281/zenodo.21966485`](https://doi.org/10.5281/zenodo.21966485)（始终指向最新版本）。

```bibtex
@software{breakrl,
  title  = {BreakRL: Reinforcement Learning Fundamentals},
  author = {{BreakRL Contributors}},
  year   = {2026},
  doi    = {10.5281/zenodo.21966485},
  url    = {https://github.com/Powfu-zwx/BreakRL}
}
```

## 许可

文字、PDF、TeX 与视觉材料采用 [CC BY 4.0](LICENSE)；Jupyter Notebook 中的代码采用 [MIT 许可](LICENSE-CODE)。
