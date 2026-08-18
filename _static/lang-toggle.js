(function () {
  'use strict';

  var STORAGE_KEY = 'breakrl-lang';
  var LANG_ZH = 'zh';
  var LANG_EN = 'en';

  // Only book pages have language counterparts. Shared utility pages stay put.
  var PAGE_MAP = {
    'index.html': { zh: 'index.html', en: 'index.html' },
    'search.html': { zh: 'search.html', en: 'search.html' },
    'genindex.html': { zh: 'genindex.html', en: 'genindex.html' },
    'failure-atlas.html': { zh: 'failure-atlas.html', en: 'failure-atlas-en.html' },
    'failure-atlas-en.html': { zh: 'failure-atlas.html', en: 'failure-atlas-en.html' },
    'notes/multi-armed-bandit/multi-armed-bandit_experiments.html': {
      zh: 'notes/multi-armed-bandit/multi-armed-bandit_experiments.html',
      en: 'notes/multi-armed-bandit/multi-armed-bandit_experiments_en.html'
    },
    'notes/multi-armed-bandit/multi-armed-bandit_experiments_en.html': {
      zh: 'notes/multi-armed-bandit/multi-armed-bandit_experiments.html',
      en: 'notes/multi-armed-bandit/multi-armed-bandit_experiments_en.html'
    },
    'notes/mdp/mdp_experiments.html': {
      zh: 'notes/mdp/mdp_experiments.html',
      en: 'notes/mdp/mdp_experiments_en.html'
    },
    'notes/mdp/mdp_experiments_en.html': {
      zh: 'notes/mdp/mdp_experiments.html',
      en: 'notes/mdp/mdp_experiments_en.html'
    },
    'notes/temporal-difference-learning/temporal-difference-learning_experiments.html': {
      zh: 'notes/temporal-difference-learning/temporal-difference-learning_experiments.html',
      en: 'notes/temporal-difference-learning/temporal-difference-learning_experiments_en.html'
    },
    'notes/temporal-difference-learning/temporal-difference-learning_experiments_en.html': {
      zh: 'notes/temporal-difference-learning/temporal-difference-learning_experiments.html',
      en: 'notes/temporal-difference-learning/temporal-difference-learning_experiments_en.html'
    },
    'notes/dqn/dqn_experiments.html': {
      zh: 'notes/dqn/dqn_experiments.html',
      en: 'notes/dqn/dqn_experiments_en.html'
    },
    'notes/dqn/dqn_experiments_en.html': {
      zh: 'notes/dqn/dqn_experiments.html',
      en: 'notes/dqn/dqn_experiments_en.html'
    },
    'notes/policy-gradient/pg_experiments.html': {
      zh: 'notes/policy-gradient/pg_experiments.html',
      en: 'notes/policy-gradient/pg_experiments_en.html'
    },
    'notes/policy-gradient/pg_experiments_en.html': {
      zh: 'notes/policy-gradient/pg_experiments.html',
      en: 'notes/policy-gradient/pg_experiments_en.html'
    },
    'notes/actor-critic/ac_experiments.html': {
      zh: 'notes/actor-critic/ac_experiments.html',
      en: 'notes/actor-critic/ac_experiments_en.html'
    },
    'notes/actor-critic/ac_experiments_en.html': {
      zh: 'notes/actor-critic/ac_experiments.html',
      en: 'notes/actor-critic/ac_experiments_en.html'
    },
    'notes/ppo/ppo_experiments.html': {
      zh: 'notes/ppo/ppo_experiments.html',
      en: 'notes/ppo/ppo_experiments_en.html'
    },
    'notes/ppo/ppo_experiments_en.html': {
      zh: 'notes/ppo/ppo_experiments.html',
      en: 'notes/ppo/ppo_experiments_en.html'
    },
    'notes/sac/sac_experiments.html': {
      zh: 'notes/sac/sac_experiments.html',
      en: 'notes/sac/sac_experiments_en.html'
    },
    'notes/sac/sac_experiments_en.html': {
      zh: 'notes/sac/sac_experiments.html',
      en: 'notes/sac/sac_experiments_en.html'
    },
    'notes/offline-rl/offline-rl_experiments.html': {
      zh: 'notes/offline-rl/offline-rl_experiments.html',
      en: 'notes/offline-rl/offline-rl_experiments_en.html'
    },
    'notes/offline-rl/offline-rl_experiments_en.html': {
      zh: 'notes/offline-rl/offline-rl_experiments.html',
      en: 'notes/offline-rl/offline-rl_experiments_en.html'
    },
    'notes/model-based-rl/model-based-rl_experiments.html': {
      zh: 'notes/model-based-rl/model-based-rl_experiments.html',
      en: 'notes/model-based-rl/model-based-rl_experiments_en.html'
    },
    'notes/model-based-rl/model-based-rl_experiments_en.html': {
      zh: 'notes/model-based-rl/model-based-rl_experiments.html',
      en: 'notes/model-based-rl/model-based-rl_experiments_en.html'
    },
    'notes/decision-transformer/decision-transformer_experiments.html': {
      zh: 'notes/decision-transformer/decision-transformer_experiments.html',
      en: 'notes/decision-transformer/decision-transformer_experiments_en.html'
    },
    'notes/decision-transformer/decision-transformer_experiments_en.html': {
      zh: 'notes/decision-transformer/decision-transformer_experiments.html',
      en: 'notes/decision-transformer/decision-transformer_experiments_en.html'
    },
    'notes/rlhf/rlhf_experiments.html': {
      zh: 'notes/rlhf/rlhf_experiments.html',
      en: 'notes/rlhf/rlhf_experiments_en.html'
    },
    'notes/rlhf/rlhf_experiments_en.html': {
      zh: 'notes/rlhf/rlhf_experiments.html',
      en: 'notes/rlhf/rlhf_experiments_en.html'
    },
    'notes/dpo/dpo_experiments.html': {
      zh: 'notes/dpo/dpo_experiments.html',
      en: 'notes/dpo/dpo_experiments_en.html'
    },
    'notes/dpo/dpo_experiments_en.html': {
      zh: 'notes/dpo/dpo_experiments.html',
      en: 'notes/dpo/dpo_experiments_en.html'
    },
    'notes/grpo/grpo_experiments.html': {
      zh: 'notes/grpo/grpo_experiments.html',
      en: 'notes/grpo/grpo_experiments_en.html'
    },
    'notes/grpo/grpo_experiments_en.html': {
      zh: 'notes/grpo/grpo_experiments.html',
      en: 'notes/grpo/grpo_experiments_en.html'
    }
  };

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

  function pageKey(pathname) {
    var path = String(pathname || '').split(/[?#]/)[0];
    var trimmed = path.replace(/\/+$/, '');
    if (!trimmed || /(?:^|\/)index\.html$/.test(trimmed) || /\/$/.test(path)) {
      return 'index.html';
    }
    var keys = Object.keys(PAGE_MAP);
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      if (trimmed === key || trimmed.slice(-(key.length + 1)) === '/' + key) {
        return key;
      }
    }
    return null;
  }

  function parallelPath(pathname, lang) {
    var key = pageKey(pathname);
    var page = key ? PAGE_MAP[key] : null;
    if (!page || !page[lang] || page[lang] === key) {
      return null;
    }
    var path = String(pathname || '').split(/[?#]/)[0];
    if (path === key) {
      return page[lang];
    }
    var marker = '/' + key;
    var start = path.lastIndexOf(marker);
    if (start < 0) {
      return null;
    }
    return path.slice(0, start + 1) + page[lang];
  }

  function parallelTarget(lang) {
    var target = parallelPath(window.location.pathname, lang);
    if (!target) {
      return null;
    }
    return target + (window.location.search || '') + (window.location.hash || '');
  }

  function pageLanguage(pathname) {
    var key = pageKey(pathname);
    var page = key ? PAGE_MAP[key] : null;
    if (!page || page.zh === page.en) {
      return null;
    }
    return page.en === key ? LANG_EN : LANG_ZH;
  }

  function storedLang() {
    var value = null;
    try {
      value = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {}
    return value === LANG_EN || value === LANG_ZH ? value : null;
  }

  function currentLang() {
    return pageLanguage(window.location.pathname) || storedLang() || LANG_EN;
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

    var key = pageKey(window.location.pathname);
    if (originalTitle === null) {
      originalTitle = document.title;
    }
    if (lang === LANG_EN && key === 'search.html') {
      document.title = 'Search - BreakRL';
    } else if (lang === LANG_EN && key === 'genindex.html') {
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
    filterIndex(lang);
  }

  function filterToc(lang) {
    document.querySelectorAll('.bd-sidebar p.caption').forEach(function (caption) {
      var text = (caption.textContent || '').trim();
      var isZh = text === '中文版';
      var isEn = text === 'English';
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

  function filterIndex(lang) {
    var cn = document.getElementById('breakrl');
    var en = document.getElementById('breakrl-english');
    if (cn) {
      cn.hidden = lang === LANG_EN;
    }
    if (en) {
      en.hidden = lang === LANG_ZH;
    }

    document.querySelectorAll('.bd-sidebar-secondary a').forEach(function (link) {
      var href = link.getAttribute('href');
      var isEn = href === '#' || href === '#breakrl-english';
      var isZh = href === '#breakrl';
      if (!isZh && !isEn) {
        return;
      }
      var entry = link.parentElement;
      while (entry && entry.tagName !== 'LI') {
        entry = entry.parentElement;
      }
      if (entry) {
        entry.hidden = (lang === LANG_EN && isZh) || (lang === LANG_ZH && isEn);
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
    var saved = storedLang();
    var pageLang = pageLanguage(window.location.pathname);
    if (saved && pageLang && saved !== pageLang) {
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
    setLangState(saved || pageLang || LANG_EN);
  }

  window.BreakRLLanguageToggle = {
    pageKey: pageKey,
    pageLanguage: pageLanguage,
    parallelPath: parallelPath,
    parallelTarget: parallelTarget,
    pageMap: PAGE_MAP
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
