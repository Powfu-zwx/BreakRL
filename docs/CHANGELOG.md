# Changelog

Release notes for BreakRL. The project was named TESAURO through v0.7.0.

## Unreleased

- Reorganize the repository into `book/`, `docs/`, and `scripts/` with a single path module.
- Add a Colab launch button for every chapter notebook, with a generated first-cell bootstrap that clones the chapter files and installs experiment extras.
- Fix the Colab bootstrap to use a full shallow clone so `requirements.txt` and chapter data are actually present.
- Make English the default README and Jupyter Book language; keep Chinese as `README.zh.md` and a toggleable site edition.
- Show a minimum-demo animation on the README and drop the extra Chapter 9 experiment still from the landing page.
- Add repository badges for the live site, quality checks, DOI, Python 3.10, and both licenses.

## 1.2.1 — 2026-08-17

- Reframe the Chinese and English README files as teaching guides.
- Align the Jupyter Book landing page with the learning path.
- Update citation and Zenodo metadata to 1.2.1.

## 1.2.0 — 2026-08-17

- Fix bilingual site routing, keyboard access, locale metadata, and generated-site link checks.
- Separate training and evaluation environments, distinguish terminated from truncated transitions, and seed action spaces.
- Repair offline-RL cache migration and notebook figure paths.
- Pin the Jupyter Book 1.x site toolchain and add Dependabot plus CODEOWNERS.

## 1.1.0 — 2026-08-16

- Correctness pass over the existing chapters, including CQL regularization direction, IQL λ limits, SAC Tanh correction, model-based error bounds, RLHF Bradley-Terry scale invariance, PPO clip wording, and learning-rate wording.
- Add Chapter 11, Decision Transformer; shift the LLM trilogy to chapters 12–14.
- Expand the Failure Atlas to 17 entries.
- Add an English README, contributing guide, failure-mode issue template, and Zenodo metadata.

## 1.0.0 — 2026-08-16

- Rename the project from TESAURO to BreakRL.
- Unify the repository, GitHub Pages site, citation, and license branding.
- Replace the site wordmark and remove the README collage.

## 0.7.0 — 2026-08-12

- Add GRPO/RLVR and complete the LLM post-training trilogy (RLHF, DPO, GRPO/RLVR).

## 0.6.0 — 2026-08-12

- Add the RLHF chapter, including reward-hacking ablations.

## 0.5.0 — 2026-08-10

- Add Chapter 10, model-based RL / Dyna-Q, with PDF, TeX, notebook, and figures.
- Merge the former release repository into this tree.

## 0.4.0 — 2026-08-09

- Add Chapter 9, offline RL (CQL and IQL), with the medium CartPole dataset and BC baseline.

## 0.3.1 — 2026-08-08

- Fix `CITATION.cff` repository casing.
- Publish `run_jupyter.py` for the Windows certificate-store workaround.
- Use `[!htbp]` figure placement in chapters 1–3.

## 0.3.0 — 2026-08-07

- Bring chapters 1–3 (bandits, MDPs, temporal-difference learning) to the same PDF + TeX + notebook + figure completeness as the later algorithm chapters.

## 0.2.0 — 2026-07-25

- Flatten `notes/fundamentals/*` to `notes/*`.
- Drop n-step TD and the mainline-summary chapter.
- Keep an eight-chapter deep model-free path from bandits through SAC.

## 0.1.2 — 2026-07-11

- Sync citation metadata to 0.1.2. Teaching content is unchanged.

## 0.1.1 — 2026-07-10

- First public TESAURO fundamentals release: bandits through SAC, with PDFs, TeX, and notebooks.

## 0.1.0 — 2026-07-10

- Initial tagged fundamentals snapshot.
