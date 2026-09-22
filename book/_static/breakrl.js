/* BreakRL docs chrome: Spinning Up-like, not card theater. */

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

function installBrand() {
  useTextBrand();
  installHeaderBrand();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', installBrand);
} else {
  installBrand();
}
