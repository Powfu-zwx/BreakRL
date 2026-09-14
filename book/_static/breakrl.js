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
    var home = page === 'index' || page === 'index-zh';
    var demo = page === 'demo';
    var atlas = page === 'failure-atlas' || page === 'failure-atlas-en';
    var pdf = page === 'offline-rl-text' || page === 'offline-rl-text-en';
    document.documentElement.classList.toggle('breakrl-home', home);
    document.documentElement.classList.toggle('breakrl-demo-page', demo);
    document.documentElement.classList.toggle('breakrl-atlas', atlas);
    document.documentElement.classList.toggle('breakrl-reader', pdf);
    document.body.classList.toggle('breakrl-home', home);
    document.body.classList.toggle('breakrl-demo-page', demo);
    document.body.classList.toggle('breakrl-atlas', atlas);
    document.body.classList.toggle('breakrl-reader', pdf);
  }

  function brandHref() {
    var brand = document.querySelector('a.navbar-brand');
    if (brand && brand.getAttribute('href')) {
      return brand.getAttribute('href');
    }
    return 'index.html';
  }

  function useTextBrand() {
    document.querySelectorAll('a.navbar-brand').forEach(function (brand) {
      brand.querySelectorAll('img').forEach(function (img) {
        img.remove();
      });
      var title = brand.querySelector('.logo__title, .title');
      if (title) {
        title.textContent = 'BreakRL';
      } else if (!brand.textContent.trim()) {
        var label = document.createElement('span');
        label.className = 'logo__title';
        label.textContent = 'BreakRL';
        brand.appendChild(label);
      }
    });
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
    link.textContent = 'BreakRL';
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

  function init() {
    setSurface();
    useTextBrand();
    installHeaderBrand();
    relabelToc();
    keepHomepageVisible();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('DOMContentLoaded', relabelToc);

  new MutationObserver(relabelToc).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-breakrl-lang']
  });
})();
