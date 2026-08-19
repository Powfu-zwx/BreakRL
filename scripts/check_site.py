"""Check the generated Jupyter Book for missing local links and stray pages."""
from html.parser import HTMLParser
from pathlib import Path
import sys
from urllib.parse import unquote, urlsplit

_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))

from paths import BOOK_BUILD  # noqa: E402

DEFAULT_BUILD = BOOK_BUILD


class LinkParser(HTMLParser):
    """Collect URLs that can point at local build assets."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[str] = []
        self.html_lang: str | None = None
        self.docsearch_language: str | None = None

    def _collect(self, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if name in {"href", "src"} and value:
                self.links.append(value)

    def _process_tag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        if tag == "html":
            self.html_lang = attributes.get("lang")
        if tag == "meta" and attributes.get("name") == "docsearch:language":
            self.docsearch_language = attributes.get("content")
        self._collect(attrs)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._process_tag(tag, attrs)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._process_tag(tag, attrs)


def _local_target(build_root: Path, source: Path, value: str) -> Path | None:
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc or not parsed.path:
        return None
    path = Path(unquote(parsed.path))
    target = build_root / path.lstrip("/") if parsed.path.startswith("/") else source.parent / path
    target = target.resolve()
    try:
        target.relative_to(build_root.resolve())
    except ValueError:
        return None
    if parsed.path.endswith("/"):
        target /= "index.html"
    elif not target.suffix and target.is_dir():
        target /= "index.html"
    return target


def check_site(build_root: Path = DEFAULT_BUILD) -> list[str]:
    errors = []
    if not build_root.is_dir():
        return [f"missing site build directory: {build_root}"]

    all_html_files = sorted(build_root.rglob("*.html"))
    for path in all_html_files:
        if ".github" in path.relative_to(build_root).parts:
            errors.append(f"stray non-book page in build: {path.relative_to(build_root)}")

    # Jupyter Book ships a few HTML macro templates in _static. They contain
    # unresolved Sphinx expressions by design and are not public pages.
    html_files = [
        path
        for path in all_html_files
        if "_static" not in path.relative_to(build_root).parts
        and ".github" not in path.relative_to(build_root).parts
    ]
    if not html_files:
        return [f"no HTML pages found under {build_root}"]

    for path in html_files:
        relative = path.relative_to(build_root)
        parser = LinkParser()
        try:
            parser.feed(path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError) as error:
            errors.append(f"cannot read {relative}: {error}")
            continue
        is_english_page = relative.name == "failure-atlas-en.html" or relative.name.endswith(
            "_en.html"
        )
        is_chinese_page = relative.name == "failure-atlas.html" or (
            relative.name.endswith("_experiments.html")
            and not relative.name.endswith("_experiments_en.html")
        )
        if is_english_page and parser.html_lang != "en":
            errors.append(f"{relative}: English page must declare html lang=\"en\"")
        if is_english_page and parser.docsearch_language != "en":
            errors.append(f"{relative}: English page must declare docsearch:language=en")
        if is_chinese_page and parser.html_lang not in {"zh-CN", "zh_CN", "zh"}:
            errors.append(f"{relative}: Chinese page must declare html lang=\"zh-CN\"")
        if is_chinese_page and parser.docsearch_language not in {"zh-CN", "zh_CN", "zh"}:
            errors.append(f"{relative}: Chinese page must declare docsearch:language=zh-CN")
        for value in parser.links:
            target = _local_target(build_root, path, value)
            if target is not None and not target.exists():
                errors.append(f"{relative}: missing local target {value}")
    return errors


def main() -> int:
    build_root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else DEFAULT_BUILD
    errors = check_site(build_root)
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    pages = sum(
        1
        for path in build_root.rglob("*.html")
        if "_static" not in path.relative_to(build_root).parts
        and ".github" not in path.relative_to(build_root).parts
    )
    print(f"checked generated site: {pages} HTML pages and local links OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
