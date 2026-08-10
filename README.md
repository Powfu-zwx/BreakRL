# TESAURO

面向中文读者的强化学习教学材料，覆盖从基础决策到深度强化学习，并从第 10 章延伸到模型式强化学习。

- 教材源码与实验：`notes/`
- 新章节骨架：`notes/rl_note_template.tex`（复制到 `notes/<chapter>/<chapter>.tex` 再写）
- 第 10 章：模型式强化学习（Dyna-Q）：学习环境模型并进行规划

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

TeX 使用 XeLaTeX + ctex 编译，通常在 Overleaf 完成。模板和所有章节统一使用 `[!htbp]` figure 浮动约定；当前机器没有 TeX 工具时不要手工修改 PDF。

单仓库工作流如下：

1. 修改 `notes/` 中的 TeX、Notebook 或实验资源。
2. 在 `rl_env` 中运行结构检查；Notebook 和 TeX 的完整验证按维护者安排在相应环境中完成。
3. 检查完整 diff，提交根仓库变更。
4. 由维护者根据 [`CITATION.cff`](CITATION.cff) 更新版本并创建 release tag。

检查脚本只读验证 Notebook 结构、TeX figure 约定和本地图片引用，不执行训练、不编译 PDF，也不覆盖源文件。GitHub Actions 会在 push 和 pull request 上自动运行同一检查。

## 许可

文字、PDF、TeX 与视觉材料采用 [CC BY 4.0](LICENSE)；Jupyter Notebook 中的代码采用 [MIT 许可](LICENSE-CODE)。
