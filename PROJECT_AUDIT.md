# BreakRL 项目全审查

审查基线：`ff0ab06`（`main` 与 `origin/main` 一致）

修复基线：`2026-08-17`。源代码、站点、检查器、TeX/PDF、文档和本地元数据已按清单处理；数值 Notebook 未重跑，GitHub Release/仓库描述/Zenodo 归档仍需外部动作。

## 高优先级

1. **语言切换会生成 404**：`_static/lang-toggle.js:16-24,104-110` 对已是英文的页面再次追加 `_en`，并对 `search.html`、`genindex.html` 等工具页生成不存在的英文地址。已验证 `dqn_experiments_en_en.html`、`failure-atlas-en_en.html`、`search_en.html` 返回 404。应使用显式中英文平行页映射，当前语言重复选择应无操作。

2. **语言按钮不可键盘操作**：`_static/lang-toggle.js:45-60,119-125` 使用一个包含两个 `<span>` 的 `<button>`，键盘触发的目标是外层按钮，无法进入语言分支；缺少 `aria-pressed`、`aria-current` 或 `aria-selected`。应改为两个可聚焦、语义明确的控件。

3. **英文页面仍声明为中文**：`_config.yml:19-25` 全局设置 `language: zh_CN`；生成的英文页面仍为 `lang="zh-CN"`，全局搜索和主题 UI 仍为中文。`_static/lang-toggle.js:63-64` 未更新 `document.documentElement.lang`。影响屏幕阅读器、SEO、搜索和翻译工具。

4. **训练环境与评估环境复用**：Model-Based RL 的 `evaluate()` 修改训练环境后，训练继续使用评估前的旧 `state`，见 `notes/model-based-rl/model-based-rl_experiments.ipynb:73-120`。Offline RL 的数据生成路径同样复用评估环境，见 `notes/offline-rl/offline-rl_experiments.ipynb:200-235,281-290`。应拆分训练环境与评估环境。

5. **时间上限截断被当作终止**：多个 Notebook 用 `terminated or truncated` 统一生成 `done`，并在 bootstrap、GAE、离线 Q target 中清零后续价值。涉及 PPO（`notes/ppo/ppo_experiments.ipynb:203-230`）、SAC（`notes/sac/sac_experiments.ipynb:126-133,329-338`）、DQN（`notes/dqn/dqn_experiments.ipynb:88-105,354-358`）、Actor-Critic（`notes/actor-critic/ac_experiments.ipynb:174-181,248-268`）和 Offline RL（`notes/offline-rl/offline-rl_experiments.ipynb:234-246,268-289,396,448`）。应区分真正 `terminated` 与可 bootstrap 的 `truncated`，否则实验结果混入时间上限偏差。

6. **Policy Gradient 重跑不会更新 TeX 使用的图**：Notebook 将图保存到 `figures/`，见 `notes/policy-gradient/pg_experiments.ipynb:102-103,521-667`；TeX 从章节根目录加载 `fig*.pdf`，见 `notes/policy-gradient/pg.tex:95,138,157`。重跑后 PDF 可能继续使用旧图。

7. **TeX/PDF 存在排版和字体警告**：全部 28 个章节 TeX 可编译，但 Tectonic 报告多处 overfull box 和 CJK 缺字。典型位置：`decision-transformer_en.tex:113-123`（约 109pt 溢出）、`offline-rl_en.tex:203-213`（约 51pt 溢出）、`actor-critic_en.tex:271`（约 42pt 溢出）、`policy-gradient/pg.tex:181-187`（数学表格中的中文缺字）。当前 CI 未编译 TeX。

## 中优先级

8. **语言偏好只单向跳转**：`_static/lang-toggle.js:129-154` 只处理“保存英文偏好后中文页跳英文”，不处理“保存中文偏好后英文深链跳中文”。结果是英文正文配中文侧边栏，且按钮状态错误。

9. **保存输出无法证明是清洁运行结果**：多个 Notebook 的 `execution_count` 非连续，例如 `ppo_experiments.ipynb` 出现 `70...76,80,78,79`，`policy-gradient_experiments.ipynb` 出现 `1...8,15...18,14`。站点关闭 Notebook 执行，`_config.yml:8-10` 会直接发布保存输出；`scripts/check_consistency.py:92-98` 只检查代码单元，不检查输出、执行顺序和生成 provenance。

10. **Offline RL 缓存缺失时存在崩溃路径**：`notes/offline-rl/offline-rl_experiments.ipynb:281-290` 在 `med` 未达到回报阈值时仍执行 `collect(med, ...)`，`med=None` 会导致后续调用失败。当前提交的 `offline_rl_medium.npz` 掩盖了该问题。

11. **CI 不执行实验、不编译 TeX、不验证站点回归**：`quality.yml:20-23` 只安装 `nbformat` 并运行结构检查；`site.yml:23-30` 不安装项目依赖、不执行 Notebook、不编译 TeX；站点只在 push 到 `main` 时构建，见 `site.yml:3-6`。PR 可以带着运行时错误、PDF 错误、JS 错误和断链合并。

12. **构建工具链未锁定**：`requirements.txt:1-5` 只有下限，`site.yml:27-30` 使用未锁定的 `jupyter-book>=1.0,<2`。语言切换依赖主题 DOM 和响应式断点，依赖升级可能静默破坏站点。

13. **当前主分支超前于 v1.1.0 发布版本**：最新 tag/release 仍是 `v1.1.0`，但双语全量内容和语言切换提交均发生在该 tag 之后；`CITATION.cff:5-6` 仍声明 `1.1.0`，GitHub 仓库描述仍是 Chinese-only 定位。应发布新版本并同步 Zenodo、GitHub 描述和引用元数据。

14. **许可证和归档元数据不完整**：正文/PDF/TeX 为 CC BY，Notebook 代码为 MIT，见 `LICENSE:5-7`、`LICENSE-CODE:1-3`；但 `CITATION.cff:7` 与 `.zenodo.json:9` 只声明 CC BY，`.zenodo.json:20` 仍声明语言为 `zh`。应明确辅助脚本、Notebook、数据和混合文件的授权范围。

15. **跨章节编号和双语正文陈旧**：中文 Decision Transformer 正文将动态规划写成第 3 章，见 `notes/decision-transformer/decision-transformer.tex:88`；英文版已是第 2 章。中文同一段重复目标范围说明，见 `...decision-transformer.tex:90`。DPO Notebook 多处仍引用“chapter 11”，见 `notes/dpo/dpo_experiments.ipynb:130,166,241,358,384` 及英文版。

16. **运行时间说明与 README 冲突**：README 声称任意章节“分钟级”完成，见 `README.md:34`、`README.en.md:34`；实际 Notebook 给出 DT CPU 数小时、DPO CPU 约 1 小时、GRPO CPU 约 40 分钟、PPO CPU 30–60 分钟、SAC CPU 20–40 分钟。应按章节实际成本描述。

17. **Seed 未完整覆盖 Gymnasium action space**：DQN、Offline RL、Decision Transformer 和 SAC 使用 `action_space.sample()`，但未统一调用 `action_space.seed(seed)`；Policy Gradient 已有对应处理，见 `notes/policy-gradient/pg_experiments.ipynb:262-267`。同一 nominal seed 可能产生不同探索轨迹。

18. **Model-Based RL 会生成未登记的原始 JSON**：`notes/model-based-rl/model-based-rl_experiments.ipynb:293` 写入 `dyna_q_raw_results.json`，该文件既未跟踪也未被 `.gitignore` 忽略。重跑会污染工作区。

19. **站点包含孤立的 issue-template 页面**：构建产物包含 `.github/ISSUE_TEMPLATE/failure-mode.html`，但该文件不在 `_toc.yml`，且页面标题为空、正文是原始 issue 模板。站点上传整个 `_build/html`，见 `site.yml:29-34`。应显式排除 `.github/` 等非书籍路径。

20. **本机路径泄露到公开 Notebook 输出**：Decision Transformer 保存输出包含 `C:\Users\admin\Desktop\...`，见 `notes/decision-transformer/decision-transformer_experiments.ipynb:612-616` 及英文版。应清理 stderr/output 后再发布。

## 低优先级

21. **960–991.98px 区间语言按钮可能消失**：`_static/lang-toggle.css:34-37` 在 `991.98px` 以下隐藏桌面按钮，而当前主题约在 `960px` 切换移动宿主，存在响应式空档。

22. **语言切换丢失 hash 和 query**：`_static/lang-toggle.js:17-18,108-110` 只使用 `pathname` 跳转，从 `#figure-3` 或带 query 的 URL 切换会丢失位置和参数。

23. **首页右侧目录仍包含被隐藏语言**：`_static/lang-toggle.js:94-102` 只隐藏首页两段正文，不同步过滤页面级目录，切换后可能出现指向隐藏内容的链接。

24. **结构检查边界处理不稳**：`scripts/check_consistency.py:85-98` 在英文成对资产存在但中文 Notebook 缺失时可能直接 `IndexError`；同时未检查三张图数量、输出 parity、Markdown 顺序和 TeX/PDF 新鲜度。

25. **Jupyter 启动脚本静默吞掉 SSL 错误**：`run_jupyter.py:6-16` 全局替换证书加载函数，并将所有 `ssl.SSLError` 转为 `None`，会隐藏真实证书问题并影响后续库。

26. **Workflow action 使用可变 major tag**：`quality.yml:15,17`、`site.yml:22,24,32,45` 使用 `@v4` 等可变标签；仓库也没有 Dependabot、`SECURITY.md`、CODEOWNERS、dependency review 或 CodeQL 配置。

## 已验证

- 14 个章节目录、28 个双语 Notebook、28 个章节 PDF、29 个 TeX（含模板）存在。
- 42 张章节实验图存在并被引用。
- 所有 Notebook 可由 `nbformat` 解析，CN/EN 代码单元一致，保存输出一致，未发现 error output。
- `python scripts/check_consistency.py` 通过。
- 28 个 TeX 使用 Tectonic 编译无硬失败，但存在上述警告。
- Jupyter Book 本地构建成功。
- 普通站点内部链接扫描未发现实际缺失链接。
- GitHub Actions 最新 quality/site 运行成功，线上站点对应 `ff0ab06`。
- 本轮审查未执行任何 Notebook 或训练。

## 修复顺序

1. 修复评估环境复用、time-limit bootstrap 和 Policy Gradient 图路径。
2. 修复语言切换 404、键盘可访问性、英文 HTML locale 和响应式断点。
3. 修复 TeX 字体/溢出并将 TeX 编译加入 CI。
4. 修复缓存缺失、输出 provenance、seed、生成副产物和本机路径。
5. 增加站点/Notebook/PDF 回归检查，锁定依赖。
6. 发布新版本并同步 CFF、Zenodo、GitHub 描述和许可证元数据。

## 当前阻塞

1. 数值 Notebook 和实验图未因本轮算法修复而重生成，原因是审查阶段明确禁止执行实验；允许后需在固定 `rl_env` 中完整重跑 28 个 Notebook，核对输出、图和 PDF 引用。
2. `v1.2.0` tag/release、GitHub 仓库描述更新和 Zenodo 新版本归档需要远程发布权限；`.zenodo.json` 与 `CITATION.cff` 已准备完成。
