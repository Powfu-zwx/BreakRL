# TESAURO

面向中文读者的强化学习教学材料，覆盖从基础决策到深度强化学习，并延伸到模型式强化学习与 RLHF。

与同类教材的区别：每章实验都是**消融对照**——不只展示算法怎么跑通，更让你亲眼看到去掉关键机制后它如何失败。全部失败案例按「症状 → 机制 → 复现 → 修复」汇总为 [RL 失败模式图鉴](https://powfu-zwx.github.io/TESAURO/failure-atlas.html)。

- 在线阅读（实验 Notebook 渲染）：<https://powfu-zwx.github.io/TESAURO/>
- 教材源码与实验：`notes/`
- 新章节骨架：`notes/rl_note_template.tex`（复制到 `notes/<chapter>/<chapter>.tex` 再写）

## 章节

1. 多臂老虎机：探索与利用
2. 马尔可夫决策过程：序列决策形式化
3. 时序差分学习：长期价值估计
4. DQN：神经网络价值学习
5. Policy Gradient / REINFORCE：直接优化策略
6. Actor-Critic / A2C：价值辅助策略更新
7. PPO：约束策略更新
8. SAC：最大熵连续控制
9. 离线强化学习：CQL 与 IQL
10. 模型式强化学习：从环境模型到 Dyna-Q
11. RLHF：从偏好到奖励

每章提供 TeX 源码、实验 Notebook 与配图；章节 PDF 由维护者在 Overleaf 使用 XeLaTeX 编译后放入对应目录。

## 环境

实验统一使用 conda 环境 **`rl_env`**（Python 3.10、PyTorch、Gymnasium）。依赖来源以 [`requirements.txt`](requirements.txt) 为准：

```bash
conda create -n rl_env python=3.10
conda activate rl_env
python -m pip install -r requirements.txt
python -m ipykernel install --user --name rl_env --display-name rl_env
```

## 运行 Notebook

```bash
conda activate rl_env
python run_jupyter.py
```

`run_jupyter.py` 包含 Windows 证书库规避逻辑；若确认本机没有该问题，也可以在同一环境中使用 `python -m jupyter lab`。打开 `notes/<chapter>/*_experiments.ipynb`，内核选择 **rl_env**。

执行 Notebook 时请将输出写到仓库外的临时目录，避免覆盖已跟踪的实验产物。结构检查可以使用：

```bash
python scripts/check_consistency.py
```

## 编译与贡献

TeX 使用 XeLaTeX + ctex 编译，可在 Overleaf 完成，也可用本机 conda 环境 `tex_env` 中的 Tectonic：`conda run -n tex_env tectonic notes/<chapter>/<chapter>.tex`。模板和所有章节统一使用 `[!htbp]` figure 浮动约定；没有 TeX 工具时不要手工修改 PDF。

单仓库工作流如下：

1. 修改 `notes/` 中的 TeX、Notebook 或实验资源。
2. 在 `rl_env` 中运行结构检查；Notebook 和 TeX 的完整验证按维护者安排在相应环境中完成。
3. 检查完整 diff，提交根仓库变更。
4. 由维护者根据 [`CITATION.cff`](CITATION.cff) 更新版本并创建 release tag。

检查脚本只读验证 Notebook 结构、TeX figure 约定和本地图片引用，不执行训练、不编译 PDF，也不覆盖源文件。GitHub Actions 会在 push 和 pull request 上自动运行同一检查。

## 在线站点

站点由 Jupyter Book 渲染 `_toc.yml` 中的实验 Notebook（只读已保存输出，不重新执行），push 到 main 后 `.github/workflows/site.yml` 自动构建并部署到 GitHub Pages。本地预览：

```bash
uvx --from "jupyter-book>=1.0,<2" jupyter-book build .
```

产物在 `_build/html/`（已被 gitignore）。首次使用前需在仓库 Settings → Pages 将 Source 设为 GitHub Actions（一次性设置），此后每次 push 自动部署。

## 许可

文字、PDF、TeX 与视觉材料采用 [CC BY 4.0](LICENSE)；Jupyter Notebook 中的代码采用 [MIT 许可](LICENSE-CODE)。
