"""How a chapter's files are named and where they live.

`book/chapters.yml` is the list of chapters and their titles. This module is the
one place that turns a chapter into a path, so the generator, the checks, and the
Colab tooling cannot disagree about `notes/<slug>/<slug>-en.ipynb` versus some
older spelling.
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import yaml

from paths import BOOK, NOTES, REPO_ROOT

CHAPTERS_FILE = BOOK / "chapters.yml"
# The Chinese edition is the source and carries no suffix; the English edition is
# its translation and carries `-en`. One rule for tex, pdf, and notebooks alike.
EDITIONS = {"zh": "", "en": "-en"}
LANGUAGES = tuple(EDITIONS)


@dataclass(frozen=True)
class Chapter:
    number: int
    slug: str
    title: dict[str, str]
    repository: str

    def name(self, language: str, suffix: str) -> str:
        return f"{self.slug}{EDITIONS[language]}{suffix}"

    def directory(self) -> Path:
        return NOTES / self.slug

    def notebook(self, language: str) -> Path:
        return self.directory() / self.name(language, ".ipynb")

    def tex(self, language: str) -> Path:
        return self.directory() / self.name(language, ".tex")

    def pdf(self, language: str) -> Path:
        return self.directory() / self.name(language, ".pdf")

    def site_stem(self, language: str) -> str:
        """Rendered experiment page path, relative to the site root and unsuffixed."""
        return f"notes/{self.slug}/{self.name(language, '')}"

    def colab_url(self, language: str) -> str:
        path = self.notebook(language).relative_to(REPO_ROOT).as_posix()
        return f"https://colab.research.google.com/github/{self.repository}/blob/main/{path}"


def load_chapters() -> list[Chapter]:
    document = yaml.safe_load(CHAPTERS_FILE.read_text(encoding="utf-8"))
    repository = document["repo"]
    return [
        Chapter(
            number=index,
            slug=entry["slug"],
            title={"zh": entry["zh"], "en": entry["en"]},
            repository=repository,
        )
        for index, entry in enumerate(document["chapters"], start=1)
    ]
