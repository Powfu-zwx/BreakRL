# TESAURO

面向中文读者的强化学习教学材料。

- 可编辑笔记：`notes/`
- 新章节骨架：`notes/rl_note_template.tex`（复制到 `notes/<chapter>/<chapter>.tex` 再写）
- 公开发布仓库（git submodule，当前 Fundamentals **v0.4.0**）：`release/fundamentals-v0.1` → [Powfu-zwx/TESAURO](https://github.com/Powfu-zwx/TESAURO)

目录名 `fundamentals-v0.1` 是历史路径；版本以 [`CITATION.cff`](CITATION.cff) / release tag 为准（现为 0.4.0）。

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

执行 Notebook 时请将输出写到仓库外的临时目录，避免覆盖已跟踪的实验产物。全部 Notebook 的结构检查可以使用：

```bash
python scripts/check_consistency.py
```

## 编译与发布

TeX 使用 XeLaTeX + ctex 编译，通常在 Overleaf 完成。模板和所有章节统一使用 `[!htbp]` figure 浮动约定；当前机器没有 TeX 工具时不要手工修改 PDF。

根工作区与发布子模块是两个独立 Git 仓库，发布步骤如下：

1. 修改 `notes/`，在 `rl_env` 中验证 Notebook，并在 TeX 环境中重新生成 PDF。
2. 将章节的 TeX、Notebook、图片和 PDF 同步到 `release/fundamentals-v0.1/`。
3. 在子模块中提交并打 release tag，确认远端已推送。
4. 回到根仓库提交更新后的子模块 gitlink，并运行 `python scripts/check_consistency.py`。

校验脚本只读比较两处 `notes/` 的文件清单和 SHA-256，不会覆盖文件；PDF 只有在重新编译后才应纳入同步。

## 许可

文字、PDF、TeX 与视觉材料采用 [CC BY 4.0](LICENSE)；Jupyter Notebook 中的代码采用 [MIT 许可](LICENSE-CODE)。

更完整的章节说明与引用方式见 [`release/fundamentals-v0.1/README.md`](release/fundamentals-v0.1/README.md)。
