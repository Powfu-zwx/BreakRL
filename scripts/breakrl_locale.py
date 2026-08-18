"""Set the generated HTML locale for Chinese book pages.

The site default language is English. Chinese experiment notebooks and the
Chinese failure atlas still need zh_CN so screen readers, search, and the
language toggle see the correct page locale.
"""


def is_chinese_page(pagename):
    if pagename == "failure-atlas":
        return True
    return pagename.endswith("_experiments") and not pagename.endswith("_experiments_en")


def set_page_language(app, pagename, templatename, context, doctree):
    if is_chinese_page(pagename):
        context["language"] = "zh_CN"


def setup(app):
    app.connect("html-page-context", set_page_language)
    return {
        "version": "1.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
