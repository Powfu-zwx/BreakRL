(function () {
  'use strict';

  var CHINESE_FOOTER = 'BreakRL 是一本双语、失败优先的强化学习教材。正文 CC BY 4.0，代码 MIT。';

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

  // Give an element its Chinese label while remembering what the page itself
  // says, so switching back to English restores the text `_toc.yml` or
  // `_config.yml` holds instead of a copy kept here.
  function swapToChinese(selector, chinese, lang) {
    document.querySelectorAll(selector).forEach(function (node) {
      var original = node.getAttribute('data-breakrl-original');
      if (original === null) {
        original = (node.textContent || '').trim();
        node.setAttribute('data-breakrl-original', original);
      }
      node.textContent = lang === 'zh' ? chinese : original;
    });
  }

  function relabelToc() {
    var lang = document.documentElement.getAttribute('data-breakrl-lang') || 'en';
    document.querySelectorAll('.bd-sidebar p.caption .caption-text').forEach(function (node) {
      var original = node.getAttribute('data-breakrl-caption') || (node.textContent || '').trim();
      if (!node.getAttribute('data-breakrl-caption')) {
        node.setAttribute('data-breakrl-caption', original);
      }
      if (original === 'Start here') {
        node.textContent = lang === 'zh' ? '从这里开始' : 'Start here';
      } else if (original === '中文版') {
        node.textContent = lang === 'zh' ? '章节' : '中文版';
      }
    });
    swapToChinese('.bd-sidebar a[href$="demo.html"]', '最小演示', lang);
    swapToChinese('.breakrl-footer', CHINESE_FOOTER, lang);
  }

  function init() {
    useTextBrand();
    installHeaderBrand();
    relabelToc();
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
