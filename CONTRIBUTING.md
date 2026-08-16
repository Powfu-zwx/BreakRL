# 贡献指南

欢迎 issue 与 PR：修正错误、改进实验、补充失败模式、撰写新章节都是贡献。

## 环境准备

```bash
conda create -n rl_env python=3.10
conda activate rl_env
python -m pip install -r requirements.txt
python -m ipykernel install --user --name rl_env --display-name rl_env
python run_jupyter.py   # Windows 证书库规避；无此问题可直接 python -m jupyter lab
```

## 章节结构约定

每章一个目录 `notes/<chapter>/`，包含且仅包含：

- 一个 `<chapter>.tex` 与同名编译产物 `<chapter>.pdf`；
- 一个 `<chapter>_experiments.ipynb`；
- 三张 `fig*.pdf` 实验图（由 notebook 生成）。

**英文版（双语对齐）**：每章均含中文版（`<chapter>.tex` / `<chapter>.pdf` / `<chapter>_experiments.ipynb`）与英文版（`<chapter>_en.tex` / `<chapter>_en.pdf` / `<chapter>_experiments_en.ipynb`）。英文版只翻译 markdown 单元格，代码与输出和中文版保持一致（`scripts/check_consistency.py` 会强制校验英文版 Notebook 的代码单元与中文版一致），并登记进 `_toc.yml` 的 English 分区、`README.en.md` 与 `index.md` 的英文表。**修改中文版内容（正文结论、实验数值、图）时必须同步英文版**——两份不一致视为未完成。

正文遵循模板 [`notes/rl_note_template.tex`](notes/rl_note_template.tex) 的结构：先讲故事 → 形式化 → 机制（配三图消融）→ 算法流程 → 对比 → 体系位置 → 参考资料。figure 环境统一用 `[!htbp]`。notebook 按三个 Figure 小节 + 小结组织。

新增章节需同步更新 `_toc.yml`、`README.md` 与 `index.md` 的章节表，以及正文中的章节编号交叉引用。

## 检查与编译

```bash
python scripts/check_consistency.py            # 结构检查（CI 同款）
conda run -n tex_env tectonic notes/<chapter>/<chapter>.tex   # TeX 改动后必须重编译 PDF
```

**TeX 与 PDF 必须同一次提交**：改了正文不重编译，线上 PDF 就是旧版本。

## Notebook 注意事项

- 线上站点渲染的是 notebook **已保存的输出**（不重新执行）：重跑实验后确认输出与正文/图注的数值一致再提交；
- 重跑会把 `fig*.pdf` 覆盖到当前目录——这是预期行为（图与代码同源），但要检查 diff 确认变化合理；
- 对正文的定量断言（具体数值、曲线形态）必须能在输出或 stdout 中找到依据。

## 失败模式图鉴

[`failure-atlas.md`](failure-atlas.md) 的每条按「症状 → 机制 → 复现 → 修复」组织。提交新条目请使用 issue 模板「失败模式提交」，被采纳后会链接到对应章节实验。

## 许可与发布

文字、PDF、TeX 与视觉材料采用 [CC BY 4.0](LICENSE)，Notebook 代码采用 [MIT](LICENSE-CODE)。版本号与 release 由维护者按 [`CITATION.cff`](CITATION.cff) 统一管理。
