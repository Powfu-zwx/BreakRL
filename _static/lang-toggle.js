(function () {
  'use strict';

  var STORAGE_KEY = 'breakrl-lang';
  var LANG_ZH = 'zh';
  var LANG_EN = 'en';

  function currentLang() {
    var path = window.location.pathname;
    if (/(?:_en|failure-atlas-en)\.html$/.test(path)) {
      return LANG_EN;
    }
    return LANG_ZH;
  }

  function parallelTarget(lang) {
    var path = window.location.pathname;
    var file = path.split('/').pop() || '';
    if (lang === LANG_EN) {
      if (file === 'failure-atlas.html') {
        return path.replace(/failure-atlas\.html$/, 'failure-atlas-en.html');
      }
      if (/\.html$/.test(file) && file !== 'index.html') {
        return path.replace(/\.html$/, '_en.html');
      }
    } else {
      if (file === 'failure-atlas-en.html') {
        return path.replace(/failure-atlas-en\.html$/, 'failure-atlas.html');
      }
      if (/_en\.html$/.test(file)) {
        return path.replace(/_en\.html$/, '.html');
      }
    }
    return null;
  }

  function storedLang() {
    var value = null;
    try {
      value = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {}
    return value === LANG_EN || value === LANG_ZH ? value : null;
  }

  function buildButton() {
    var btn = document.createElement('button');
    btn.className = 'lang-switch';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Switch language / 切换语言');
    var zh = document.createElement('span');
    zh.className = 'lang-opt';
    zh.dataset.lang = LANG_ZH;
    zh.textContent = '中文';
    var en = document.createElement('span');
    en.className = 'lang-opt';
    en.dataset.lang = LANG_EN;
    en.textContent = 'EN';
    btn.appendChild(zh);
    btn.appendChild(en);
    return btn;
  }

  function setLangState(lang) {
    document.documentElement.setAttribute('data-breakrl-lang', lang);
    document.querySelectorAll('.lang-switch').forEach(function (btn) {
      btn.querySelectorAll('.lang-opt').forEach(function (opt) {
        opt.classList.toggle('active', opt.dataset.lang === lang);
      });
    });
    filterToc(lang);
    filterIndex(lang);
  }

  function filterToc(lang) {
    document.querySelectorAll('.bd-sidebar p.caption').forEach(function (cap) {
      var text = (cap.textContent || '').trim();
      var isZh = text === '中文版';
      var isEn = text === 'English';
      if (!isZh && !isEn) {
        return;
      }
      var hidden = (lang === LANG_EN && isZh) || (lang === LANG_ZH && isEn);
      cap.style.display = hidden ? 'none' : '';
      var list = cap.nextElementSibling;
      while (list && !(list.classList && list.classList.contains('bd-sidenav'))) {
        list = list.nextElementSibling;
      }
      if (list) {
        list.style.display = hidden ? 'none' : '';
      }
    });
  }

  function filterIndex(lang) {
    var cn = document.getElementById('breakrl');
    var en = document.getElementById('breakrl-english');
    if (!cn || !en) {
      return;
    }
    cn.style.display = lang === LANG_EN ? 'none' : '';
    en.style.display = lang === LANG_ZH ? 'none' : '';
  }

  function applyLang(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {}
    var target = parallelTarget(lang);
    if (target && target !== window.location.pathname) {
      window.location.replace(target);
      return;
    }
    setLangState(lang);
  }

  function installButton(host) {
    var btn = buildButton();
    host.appendChild(btn);
    btn.addEventListener('click', function (event) {
      var opt = event.target.closest ? event.target.closest('.lang-opt') : null;
      if (!opt || !host.contains(opt)) {
        return;
      }
      applyLang(opt.dataset.lang);
    });
    return btn;
  }

  function init() {
    var saved = storedLang();
    if (saved === LANG_EN && currentLang() === LANG_ZH) {
      var target = parallelTarget(LANG_EN);
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
    setLangState(saved || currentLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
