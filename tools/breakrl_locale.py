"""Mark English pages as English in the generated HTML.

The site default is Chinese, because the Chinese edition is the source and
carries no filename suffix. Every translation is named with `-en`, so that one
suffix is the whole locale map. Sphinx writes this value into `<html lang>` and
`docsearch:language` verbatim, so it has to be a BCP 47 tag.
"""

ENGLISH_LANGUAGE = "en"


def is_english_page(pagename):
    return pagename.endswith("-en")


def set_page_language(app, pagename, templatename, context, doctree):
    if is_english_page(pagename):
        context["language"] = ENGLISH_LANGUAGE


def setup(app):
    app.connect("html-page-context", set_page_language)
    return {
        "version": "2.0",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
