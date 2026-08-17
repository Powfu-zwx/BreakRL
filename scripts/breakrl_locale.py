"""Set the generated HTML locale for the English book pages."""


def set_page_language(app, pagename, templatename, context, doctree):
    if pagename == "failure-atlas-en" or pagename.endswith("_en"):
        context["language"] = "en"


def setup(app):
    app.connect("html-page-context", set_page_language)
    return {
        "version": "1.0",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
