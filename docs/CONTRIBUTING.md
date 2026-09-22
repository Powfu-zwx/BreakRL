# 贡献指南

欢迎 issue 与 PR：修正错误、改进实验、补充失败模式、撰写新章节都是贡献。英文版见 [CONTRIBUTING-en.md](CONTRIBUTING-en.md)。

## 命名规则

中文是源件，英文是译本。**文件名无后缀为中文，`-en` 为英文**，正文、PDF、notebook 一律如此（`dqn.tex` / `dqn-en.tex`）。路径怎么拼由 [`tools/chapters.py`](../tools/chapters.py) 决定，不要在别处另写一份。

## 新增或改动章节

章节清单只有一份：[`book/chapters.yml`](../book/chapters.yml)。改完它运行

```bash
python tools/sync_pages.py
```

两个 README、两个首页的章节表和 `book/_toc.yml` 都由此生成，不要手改。语言切换按钮按 `-en` 后缀配对，新页面自动生效。

一章一个目录 `book/notes/<chapter>/`，中英两版各三份：`<chapter>.tex`、同名编译产物 `<chapter>.pdf`、`<chapter>.ipynb`（英文版带 `-en`）。实验图 `fig*.pdf` 由 notebook 生成。正文结构遵循 [`docs/rl-note-template.tex`](rl-note-template.tex)：先讲故事 → 形式化 → 机制（配三图消融）→ 算法流程 → 对比 → 体系位置 → 参考资料；figure 环境统一用 `[!htbp]`。

## 双语对齐

英文版只翻译 markdown 单元格；代码单元与保存的输出必须和中文版逐字一致（`tools/check_repo.py` 强制校验）。英文译文可以滞后于中文，但**代码与输出不能只改一边**。

## 环境准备

读者可以从章节表在 Colab 中打开任意一章。每个 notebook 的第一个 code cell 是 Colab 引导（克隆仓库、装实验依赖、进入章节目录），由 `tools/colab_setup.py` 生成并标 `remove-cell`；改完 helper 后运行 `python tools/sync_colab_bootstrap.py`，不要手改这个 cell。`BREAKRL_CHAPTER` 是 `book/notes/` 下的目录名。

本地修改用 Python 3.10、PyTorch 与 Gymnasium：

```bash
conda create -n rl_env python=3.10
conda activate rl_env
python -m pip install -r requirements.txt
python -m ipykernel install --user --name rl_env --display-name rl_env
python tools/run_jupyter.py   # Windows 证书库规避；无此问题可直接 python -m jupyter lab
```

`requirements.txt` 只写下界，以便 Colab 解析到当前可用版本。已提交的图表与 notebook 输出由 Python 3.10.21、numpy 2.2.6、matplotlib 3.10.9、torch 2.9.0、gymnasium 1.3.0 生成，站点工具链见 [`requirements-site.txt`](../requirements-site.txt)；换成更新的版本可能让实验的末位数字发生偏移。

## 检查与编译

```bash
python tools/check_repo.py                               # 结构检查（CI 同款）
python tools/test_colab_setup.py                         # Colab 引导单元测试
node tools/test_lang_toggle.js                           # 语言切换回归
conda run -n tex_env tectonic book/notes/<chapter>/<chapter>.tex   # 改了正文必须重编译 PDF
jupyter-book build book && python tools/check_site.py book/_build/html
```

**TeX 与 PDF 必须同一次提交**：改了正文不重编译，线上 PDF 就是旧版本。

## Notebook 注意事项

- 线上站点渲染的是 notebook **已保存的输出**（不重新执行）：重跑实验后确认输出与正文/图注的数值一致再提交；
- 重跑会把 `fig*.pdf` 覆盖到当前目录——这是预期行为（图与代码同源），但要检查 diff 确认变化合理；
- 对正文的定量断言（具体数值、曲线形态）必须能在输出或 stdout 中找到依据。

## 失败模式图鉴

[`book/failure-atlas.md`](../book/failure-atlas.md) 的每条按「症状 → 机制 → 复现 → 修复」组织，「复现」链到对应章节的实验 notebook 与图号。补充新条目请开 issue 说明症状与复现步骤。

## 许可与发布

文字、PDF、TeX、视觉材料与生成的数据文件采用 [CC BY 4.0](../LICENSE-CC-BY-4.0)，Notebook 与仓库辅助脚本中的代码采用 [MIT](../LICENSE-MIT)。Notebook 中的说明文字与输出仍按 CC BY 4.0 处理。版本号与 release 由维护者按 [`CITATION.cff`](../CITATION.cff) 统一管理。
