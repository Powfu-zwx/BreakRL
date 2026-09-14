(function () {
  'use strict';

  function pagename() {
    if (window.DOCUMENTATION_OPTIONS && DOCUMENTATION_OPTIONS.pagename) {
      return String(DOCUMENTATION_OPTIONS.pagename);
    }
    var path = String(window.location.pathname || '');
    var trimmed = path.replace(/\/+$/, '');
    if (!trimmed || /(?:^|\/)index\.html$/.test(trimmed) || /\/$/.test(path)) {
      return 'index';
    }
    var marker = '/BreakRL/';
    var start = trimmed.indexOf(marker);
    var relative = start >= 0 ? trimmed.slice(start + marker.length) : trimmed.replace(/^.*\//, '');
    return relative.replace(/\.html$/, '');
  }

  function setSurface() {
    var page = pagename();
    var root = document.documentElement;
    var home = page === 'index' || page === 'index-zh';
    var demo = page === 'demo';
    var atlas = page === 'failure-atlas' || page === 'failure-atlas-en';
    var pdf = page === 'offline-rl-text' || page === 'offline-rl-text-en';
    var chapter = page.indexOf('notes/offline-rl/offline-rl_experiments') === 0;
    root.classList.toggle('breakrl-home', home);
    root.classList.toggle('breakrl-demo-page', demo);
    root.classList.toggle('breakrl-atlas', atlas);
    root.classList.toggle('breakrl-reader', pdf || chapter);
    document.body.classList.toggle('breakrl-home', home);
    document.body.classList.toggle('breakrl-demo-page', demo);
    document.body.classList.toggle('breakrl-atlas', atlas);
    document.body.classList.toggle('breakrl-reader', pdf || chapter);
    return { page: page, home: home, demo: demo, atlas: atlas, pdf: pdf, chapter: chapter };
  }

  function brandHref() {
    var logo = document.querySelector('a.navbar-brand.logo');
    if (logo && logo.getAttribute('href')) {
      return logo.getAttribute('href');
    }
    return 'index.html';
  }

  function installHeaderBrand() {
    if (document.querySelector('.breakrl-brand')) {
      return;
    }
    var inner = document.querySelector('#pst-header .bd-header__inner, .bd-header .bd-header__inner, .bd-header');
    if (!inner) {
      return;
    }
    var link = document.createElement('a');
    link.className = 'breakrl-brand';
    link.href = brandHref();
    link.setAttribute('aria-label', 'BreakRL');
    link.innerHTML = '<span>Break<span class="breakrl-brand__rl">RL</span></span>';
    var toggle = inner.querySelector('.sidebar-toggle.primary-toggle');
    if (toggle && toggle.parentNode) {
      toggle.insertAdjacentElement('afterend', link);
    } else {
      inner.insertBefore(link, inner.firstChild);
    }
  }

  function relabelToc() {
    var lang = document.documentElement.getAttribute('data-breakrl-lang') || 'en';
    document.querySelectorAll('.bd-sidebar p.caption .caption-text').forEach(function (node) {
      var original = node.getAttribute('data-breakrl-caption') || (node.textContent || '').trim();
      if (!node.getAttribute('data-breakrl-caption')) {
        node.setAttribute('data-breakrl-caption', original);
      }
      if (original === '从这里开始 / Start here' || original === 'Start here') {
        node.textContent = lang === 'zh' ? '从这里开始' : 'Start here';
      } else if (original === 'English' || original === 'Chapters') {
        node.textContent = 'Chapters';
      } else if (original === '中文版' || original === '章节') {
        node.textContent = lang === 'zh' ? '章节' : '中文版';
      }
    });
    document.querySelectorAll('.bd-sidebar a[href$="demo.html"]').forEach(function (node) {
      node.textContent = lang === 'zh' ? '最小演示' : 'Minimum demo';
    });
    document.querySelectorAll('.breakrl-footer').forEach(function (node) {
      node.textContent = lang === 'zh'
        ? 'BreakRL 是一本双语、失败优先的强化学习教材。正文 CC BY 4.0，代码 MIT。'
        : 'BreakRL is a bilingual, failure-first RL textbook. Text CC BY 4.0. Code MIT.';
    });
  }

  function keepHomepageVisible() {
    var article = document.getElementById('breakrl');
    var english = document.getElementById('breakrl-english');
    if (article && !english && article.hidden) {
      article.hidden = false;
    }
  }

  function pathRibbon(surface) {
    if (!surface.pdf && !surface.chapter) {
      return;
    }
    if (document.querySelector('.breakrl-ribbon')) {
      return;
    }
    var lang = document.documentElement.getAttribute('data-breakrl-lang') ||
      (document.documentElement.lang === 'en' ? 'en' : 'zh');
    var zh = lang === 'zh';
    var demoHref = surface.page.indexOf('notes/') === 0 ? '../../demo.html' : 'demo.html';
    var atlasHref = zh
      ? (surface.page.indexOf('notes/') === 0 ? '../../failure-atlas.html#atlas-8-offline-loss' : 'failure-atlas.html#atlas-8-offline-loss')
      : (surface.page.indexOf('notes/') === 0 ? '../../failure-atlas-en.html#atlas-8-offline-loss' : 'failure-atlas-en.html#atlas-8-offline-loss');
    var pdfHref = zh
      ? (surface.page.indexOf('notes/') === 0 ? '../../offline-rl-text.html' : 'offline-rl-text.html')
      : (surface.page.indexOf('notes/') === 0 ? '../../offline-rl-text-en.html' : 'offline-rl-text-en.html');
    var nav = document.createElement('nav');
    nav.className = 'breakrl-ribbon';
    nav.setAttribute('aria-label', zh ? '旗舰路径' : 'Flagship path');
    function crumb(href, label, current) {
      if (current) {
        return '<span class="breakrl-ribbon__here">' + label + '</span>';
      }
      return '<a href="' + href + '">' + label + '</a>';
    }
    nav.innerHTML = [
      crumb(demoHref, zh ? '最小演示' : 'Demo', false),
      '<span aria-hidden="true">/</span>',
      crumb(atlasHref, zh ? '图鉴第 8 条' : 'Atlas #8', false),
      '<span aria-hidden="true">/</span>',
      crumb(pdfHref, zh ? '正文 PDF' : 'Chapter PDF', surface.pdf),
      surface.chapter
        ? '<span aria-hidden="true">/</span><span class="breakrl-ribbon__here">' + (zh ? '实验' : 'Experiment') + '</span>'
        : ''
    ].join('');
    var article = document.querySelector('article.bd-article');
    if (article && article.firstElementChild) {
      article.firstElementChild.insertBefore(nav, article.firstElementChild.firstChild);
    }
  }

  function init() {
    var surface = setSurface();
    installHeaderBrand();
    relabelToc();
    keepHomepageVisible();
    pathRibbon(surface);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('DOMContentLoaded', function () {
    relabelToc();
  });

  var observer = new MutationObserver(function () {
    relabelToc();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-breakrl-lang']
  });
})();
