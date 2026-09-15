"""Check the generated Jupyter Book for missing local links and stray pages."""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))

from breakrl_locale import is_chinese_page  # noqa: E402
from paths import BOOK_BUILD  # noqa: E402

DEFAULT_BUILD = BOOK_BUILD
CHINESE_LANG_VALUES = {"zh-CN", "zh_CN", "zh"}
_H1_IN_SELECTOR = re.compile(r"(^|[\s,>+~])h1($|[\s,:+.\[#>~])", re.I)
_DISPLAY_NONE = re.compile(r"display\s*:\s*none", re.I)


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


def css_hides_h1(css: str) -> bool:
    """Return True if any CSS rule hides an h1 with display:none."""
    stripped = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    compact = re.sub(r"\s+", " ", stripped)
    for match in re.finditer(r"([^{}]+)\{([^{}]+)\}", compact):
        selector, body = match.group(1), match.group(2)
        if _H1_IN_SELECTOR.search(selector) and _DISPLAY_NONE.search(body):
            return True
    return False


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


def page_files(build_root: Path) -> list[Path]:
    """Every HTML page a reader can reach, in a stable order.

    Jupyter Book ships a few HTML macro templates in ``_static``; they contain
    unresolved Sphinx expressions by design and are not public pages. Anything
    under ``.github`` is repository metadata that leaked into the build.
    """
    return sorted(
        path
        for path in build_root.rglob("*.html")
        if "_static" not in path.relative_to(build_root).parts
        and ".github" not in path.relative_to(build_root).parts
    )


def check_site(build_root: Path = DEFAULT_BUILD) -> list[str]:
    errors = []
    if not build_root.is_dir():
        return [f"missing site build directory: {build_root}"]

    for path in sorted(build_root.rglob("*.html")):
        if ".github" in path.relative_to(build_root).parts:
            errors.append(f"stray non-book page in build: {path.relative_to(build_root)}")

    html_files = page_files(build_root)
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
        if is_chinese_page(relative.name.removesuffix(".html")):
            if parser.html_lang not in CHINESE_LANG_VALUES:
                errors.append(f"{relative}: Chinese page must declare html lang=\"zh-CN\"")
            if parser.docsearch_language not in CHINESE_LANG_VALUES:
                errors.append(f"{relative}: Chinese page must declare docsearch:language=zh-CN")
        else:
            if parser.html_lang != "en":
                errors.append(f"{relative}: English page must declare html lang=\"en\"")
            if parser.docsearch_language != "en":
                errors.append(f"{relative}: English page must declare docsearch:language=en")
        for value in parser.links:
            target = _local_target(build_root, path, value)
            if target is not None and not target.exists():
                errors.append(f"{relative}: missing local target {value}")

    for atlas_name in ("failure-atlas-en.html", "failure-atlas.html"):
        atlas = build_root / atlas_name
        if not atlas.is_file():
            errors.append(f"missing {atlas_name}")
        elif 'id="atlas-8-offline-loss"' not in atlas.read_text(encoding="utf-8"):
            errors.append(f"{atlas_name}: missing id=\"atlas-8-offline-loss\"")

    # The homepage links the atlas across pages. The language toggle must not
    # rewrite that into an in-page hash, which resolves to nothing.
    for homepage in ("index.html", "index-zh.html"):
        path = build_root / homepage
        if not path.is_file():
            errors.append(f"missing homepage: {homepage}")
        elif 'href="#failure-atlas' in path.read_text(encoding="utf-8"):
            errors.append(
                f"{homepage}: Failure Atlas #8 link was rewritten into a broken in-page hash"
            )

    demo = build_root / "demo.html"
    if not demo.is_file():
        errors.append("missing demo.html")
    else:
        demo_html = demo.read_text(encoding="utf-8")
        if "<h1" not in demo_html.lower():
            errors.append("demo.html: missing <h1>; keep a level-one heading in the accessibility tree")

    static = build_root / "_static"
    for css_path in sorted(static.glob("breakrl*.css")) + sorted(static.glob("lang-toggle.css")):
        if css_hides_h1(css_path.read_text(encoding="utf-8")):
            errors.append(f"{css_path.relative_to(build_root)}: must not display:none an h1")
    return errors


def main() -> int:
    build_root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else DEFAULT_BUILD
    errors = check_site(build_root)
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    pages = len(page_files(build_root))
    print(f"checked generated site: {pages} HTML pages and local links OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
