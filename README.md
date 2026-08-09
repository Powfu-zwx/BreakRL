# TESAURO

面向中文读者的强化学习教学材料。

- 可编辑笔记：`notes/`
- 新章节骨架：`notes/rl_note_template.tex`（复制到 `notes/<chapter>/<chapter>.tex` 再写）
- 公开发布仓库（git submodule，当前 Fundamentals **v0.4.0**）：`release/fundamentals-v0.1` → [Powfu-zwx/TESAURO](https://github.com/Powfu-zwx/TESAURO)

目录名 `fundamentals-v0.1` 是历史路径；版本以 [`CITATION.cff`](CITATION.cff) / release tag 为准（现为 0.4.0）。

## 环境

本仓库实验默认使用 conda 环境 **`rl_env`**（Python 3.10 + PyTorch + Gymnasium）。

```bash
conda activate rl_env
# 若缺少 JupyterLab：
# conda install -n rl_env jupyterlab ipykernel
python -m ipykernel install --user --name rl_env --display-name rl_env
```

也可用 `requirements.txt` 自行建环境；勿把 conda base / 系统 Python 与用户目录下的破损 `torch` 混用。

## 运行 Notebook

```bash
conda activate rl_env
python run_jupyter.py
```

若本机 Windows 证书库导致 `import jupyterlab` 报 `ASN1: NOT_ENOUGH_DATA`，请用上面的 `run_jupyter.py`（内含 SSL 规避），不要直接 `jupyter lab`。

打开 `notes/<chapter>/*_experiments.ipynb`，内核选择 **rl_env**。

更完整的章节说明、许可与引用方式见 [`release/fundamentals-v0.1/README.md`](release/fundamentals-v0.1/README.md)。
