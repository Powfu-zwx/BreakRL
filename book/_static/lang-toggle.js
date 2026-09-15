(function () {
  'use strict';

  var STORAGE_KEY = 'breakrl-lang';
  var LANG_ZH = 'zh';
  var LANG_EN = 'en';

  // Pages pair by filename. Chapter notebooks follow the convention
  // `scripts/check_consistency.py` enforces — the English edition of
  // `notes/<chapter>/<name>_experiments.html` is its `_en` sibling — so a new
  // chapter's toggle works without an edit here. The site's own text pages are
  // listed instead, because their names do not say which edition they are.
  // Sphinx's search and genindex pages, and the single-language demo, pair with
  // nothing and stay put.
  var TEXT_PAGES = indexPairs([
    ['index-zh.html', 'index.html'],
    ['failure-atlas.html', 'failure-atlas-en.html'],
    ['offline-rl-text.html', 'offline-rl-text-en.html']
  ]);

  function indexPairs(pairs) {
    var index = {};
    pairs.forEach(function (pair) {
      index[pair[0]] = { zh: pair[0], en: pair[1] };
      index[pair[1]] = { zh: pair[0], en: pair[1] };
    });
    return index;
  }

  var UI_LABELS = {
    zh: {
      language: '语言',
      switchToZh: '切换到中文',
      switchToEn: '切换到英文',
      skip: '跳转至主要内容',
      backToTop: '回到顶部',
      search: '搜索',
      navigation: '网页导航',
      pageNavigation: '当前页面',
      repository: '源码库',
      pageContents: '目录',
      previous: '上一页',
      next: '下一页',
      author: '作者：'
    },
    en: {
      language: 'Language',
      switchToZh: 'Switch to Chinese',
      switchToEn: 'Switch to English',
      skip: 'Skip to main content',
      backToTop: 'Back to top',
      search: 'Search',
      navigation: 'Site navigation',
      pageNavigation: 'Page navigation',
      repository: 'Repository',
      pageContents: 'Contents',
      previous: 'Previous',
      next: 'Next',
      author: 'Author:'
    }
  };

  var originalTitle = null;

  // A pathname split into the directory that holds the page and the page's own
  // filename. A URL ending in `/` serves that directory's index page.
  function pageLocation(pathname) {
    var path = String(pathname || '').split(/[?#]/)[0];
    var cut = path.lastIndexOf('/') + 1;
    return { directory: path.slice(0, cut), name: path.slice(cut) || 'index.html' };
  }

  function pagePair(location) {
    if (TEXT_PAGES[location.name]) {
      return TEXT_PAGES[location.name];
    }
    if (!/(^|\/)notes\//.test(location.directory)) {
      return null;
    }
    if (/_experiments_en\.html$/.test(location.name)) {
      return { zh: location.name.replace(/_en\.html$/, '.html'), en: location.name };
    }
    if (/_experiments\.html$/.test(location.name)) {
      return { zh: location.name, en: location.name.replace(/\.html$/, '_en.html') };
    }
    return null;
  }

  function pageName(pathname) {
    return pageLocation(pathname).name;
  }

  function parallelPath(pathname, lang) {
    var location = pageLocation(pathname);
    var pair = pagePair(location);
    if (!pair || !pair[lang] || location.name === pair[lang]) {
      return null;
    }
    return location.directory + pair[lang];
  }

  function parallelTarget(lang) {
    var target = parallelPath(window.location.pathname, lang);
    if (!target) {
      return null;
    }
    return target + (window.location.search || '') + (window.location.hash || '');
  }

  // The build states each page's own language in the HTML it generates
  // (`scripts/breakrl_locale.py` owns that rule), so the toggle reads it rather
  // than deriving the same answer a second time.
  function pageLanguage() {
    var lang = document.documentElement.getAttribute('lang') || '';
    return /^zh\b/i.test(lang) ? LANG_ZH : LANG_EN;
  }

  function storedLang() {
    var value = null;
    try {
      value = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {}
    return value === LANG_EN || value === LANG_ZH ? value : null;
  }

  function setDirectText(selector, text) {
    document.querySelectorAll(selector).forEach(function (node) {
      var textNode = null;
      for (var i = 0; i < node.childNodes.length; i += 1) {
        if (node.childNodes[i].nodeType === 3) {
          textNode = node.childNodes[i];
        }
      }
      if (textNode) {
        textNode.nodeValue = text;
      } else {
        node.appendChild(document.createTextNode(text));
      }
    });
  }

  function setText(selector, text) {
    document.querySelectorAll(selector).forEach(function (node) {
      node.textContent = text;
    });
  }

  function setAttribute(selector, name, value) {
    document.querySelectorAll(selector).forEach(function (node) {
      node.setAttribute(name, value);
    });
  }

  function setUiLanguage(lang) {
    var labels = UI_LABELS[lang];
    var meta = document.querySelector('meta[name="docsearch:language"]');
    if (meta) {
      meta.setAttribute('content', lang === LANG_EN ? 'en' : 'zh-CN');
    }

    setDirectText('#pst-skip-link a', labels.skip);
    setDirectText('#pst-back-to-top', labels.backToTop);
    setDirectText('#pst-page-navigation-heading-2', labels.pageContents);
    setText('.search-button__default-text', labels.search);
    setAttribute('.search-button-field', 'title', labels.search);
    setAttribute('.search-button-field', 'aria-label', labels.search);
    setAttribute('.primary-toggle', 'aria-label', labels.navigation);
    setAttribute('.secondary-toggle', 'aria-label', labels.pageNavigation);
    setAttribute('.btn-source-repository-button', 'title', labels.repository);

    document.querySelectorAll('.prev-next-subtitle').forEach(function (node) {
      var isNext = node.textContent.trim() === '下一页' || node.textContent.trim() === 'Next';
      node.textContent = isNext ? labels.next : labels.previous;
    });

    document.querySelectorAll('.component-author').forEach(function (node) {
      var name = node.textContent.replace(/^作者：|^Author:\s*/, '').trim();
      if (name) {
        node.textContent = labels.author + ' ' + name;
      }
    });

    var name = pageName(window.location.pathname);
    if (originalTitle === null) {
      originalTitle = document.title;
    }
    if (lang === LANG_EN && name === 'search.html') {
      document.title = 'Search - BreakRL';
    } else if (lang === LANG_EN && name === 'genindex.html') {
      document.title = 'Index - BreakRL';
    } else {
      document.title = originalTitle;
    }
  }

  function buildButton() {
    var group = document.createElement('div');
    group.className = 'lang-switch';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', '语言');

    [LANG_EN, LANG_ZH].forEach(function (lang) {
      var option = document.createElement('button');
      option.className = 'lang-opt';
      option.type = 'button';
      option.dataset.lang = lang;
      option.textContent = lang === LANG_ZH ? '中文' : 'EN';
      option.setAttribute('aria-pressed', 'false');
      option.addEventListener('click', function () {
        applyLang(lang);
      });
      group.appendChild(option);
    });
    return group;
  }

  function setLangState(lang) {
    document.documentElement.setAttribute('data-breakrl-lang', lang);
    document.documentElement.setAttribute('lang', lang === LANG_EN ? 'en' : 'zh-CN');
    document.querySelectorAll('.lang-switch').forEach(function (group) {
      group.setAttribute('aria-label', UI_LABELS[lang].language);
      group.querySelectorAll('.lang-opt').forEach(function (option) {
        var active = option.dataset.lang === lang;
        option.classList.toggle('active', active);
        option.setAttribute('aria-pressed', String(active));
        if (active) {
          option.setAttribute('aria-current', 'true');
        } else {
          option.removeAttribute('aria-current');
        }
        option.setAttribute(
          'aria-label',
          option.dataset.lang === LANG_ZH
            ? UI_LABELS[lang].switchToZh
            : UI_LABELS[lang].switchToEn
        );
      });
    });
    setUiLanguage(lang);
    filterToc(lang);
  }

  function filterToc(lang) {
    document.querySelectorAll('.bd-sidebar p.caption').forEach(function (caption) {
      var text = (caption.textContent || '').trim();
      var isZh = text === '中文版' || text === '章节';
      var isEn = text === 'English' || text === 'Chapters';
      if (!isZh && !isEn) {
        return;
      }
      var hidden = (lang === LANG_EN && isZh) || (lang === LANG_ZH && isEn);
      caption.hidden = hidden;
      var list = caption.nextElementSibling;
      while (list && !(list.classList && list.classList.contains('bd-sidenav'))) {
        list = list.nextElementSibling;
      }
      if (list) {
        list.hidden = hidden;
      }
    });
  }

  function applyLang(lang) {
    if (lang !== LANG_EN && lang !== LANG_ZH) {
      return;
    }
    if (document.documentElement.getAttribute('data-breakrl-lang') === lang) {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {}
    var target = parallelTarget(lang);
    if (target && target !== window.location.pathname + window.location.search + window.location.hash) {
      window.location.replace(target);
      return;
    }
    setLangState(lang);
  }

  function installButton(host) {
    if (host.querySelector('.lang-switch')) {
      return null;
    }
    var group = buildButton();
    host.appendChild(group);
    return group;
  }

  function init() {
    var pageLang = pageLanguage();
    var saved = storedLang();
    if (saved && saved !== pageLang) {
      var target = parallelTarget(saved);
      if (target) {
        window.location.replace(target);
        return;
      }
    }

    var hosts = [];
    var end = document.querySelector('.navbar-header-items__end');
    if (end) {
      hosts.push(end);
    }
    var mobile = document.querySelector('.navbar-persistent--mobile');
    if (mobile) {
      hosts.push(mobile);
    }
    if (!hosts.length) {
      var header = document.querySelector('.bd-header');
      if (header) {
        hosts.push(header);
      }
    }
    hosts.forEach(installButton);
    setLangState(saved || pageLang);
  }

  window.BreakRLLanguageToggle = {
    textPages: TEXT_PAGES,
    parallelPath: parallelPath,
    parallelTarget: parallelTarget
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
