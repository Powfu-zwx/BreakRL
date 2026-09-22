'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const sourcePath = path.join(__dirname, '..', 'book', '_static', 'lang-toggle.js');
const source = fs.readFileSync(sourcePath, 'utf8');
const location = {
  pathname: '/BreakRL/notes/dqn/dqn.html',
  search: '?tab=loss',
  hash: '#figure-3'
};
const sandbox = {
  window: { location },
  document: {
    readyState: 'loading',
    addEventListener() {}
  }
};

vm.runInNewContext(source, sandbox, { filename: sourcePath });
const toggle = sandbox.window.BreakRLLanguageToggle;
assert.ok(toggle, 'language toggle test API is available');

// The pairing rule is "add or strip `-en`", so the expected pairs come from the
// repository rather than a list kept here: a new page is covered on arrival.
const bookDir = path.join(__dirname, '..', 'book');
const pairs = fs
  .readdirSync(bookDir)
  .filter((file) => file.endsWith('-en.md'))
  .map((file) => {
    const en = file.replace(/\.md$/, '.html');
    return [en.replace(/-en\.html$/, '.html'), en];
  });
const chapterPairs = fs
  .readdirSync(path.join(bookDir, 'notes'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .flatMap((chapter) =>
    fs
      .readdirSync(path.join(bookDir, 'notes', chapter.name))
      .filter((file) => file.endsWith('-en.ipynb'))
      .map((file) => {
        const en = `notes/${chapter.name}/${file.replace(/\.ipynb$/, '.html')}`;
        return [en.replace(/-en\.html$/, '.html'), en];
      })
  );
assert.ok(pairs.length > 0, 'found site pages to pair');
assert.ok(chapterPairs.length > 0, 'found chapter notebooks to pair');

for (const [zh, en] of [...pairs, ...chapterPairs]) {
  assert.equal(toggle.parallelPath(`/BreakRL/${zh}`, 'en'), `/BreakRL/${en}`);
  assert.equal(toggle.parallelPath(`/BreakRL/${en}`, 'zh'), `/BreakRL/${zh}`);
  assert.equal(toggle.parallelPath(`/BreakRL/${en}`, 'en'), null);
  assert.equal(toggle.parallelPath(`/BreakRL/${zh}`, 'zh'), null);
}

assert.equal(toggle.parallelPath('/BreakRL/', 'en'), '/BreakRL/index-en.html');
assert.equal(toggle.parallelPath('/BreakRL/index.html', 'en'), '/BreakRL/index-en.html');
assert.equal(toggle.parallelPath('/BreakRL/index-en.html', 'zh'), '/BreakRL/index.html');

// Sphinx's search and index pages have no counterpart: the toggle must not
// offer a path off them.
for (const alone of ['/BreakRL/search.html', '/BreakRL/genindex.html', '/BreakRL/404.html']) {
  assert.equal(toggle.parallelPath(alone, 'zh'), null);
  assert.equal(toggle.parallelPath(alone, 'en'), null);
}

assert.equal(toggle.parallelTarget('en'), '/BreakRL/notes/dqn/dqn-en.html?tab=loss#figure-3');

// A saved language sends the reader to the other edition of the page they are
// on. The page's own language comes from the `<html lang>` the build emits, so
// each case states what the build would have written.
function preferredRedirect(pathname, savedLanguage, htmlLang) {
  let callback;
  let redirect = null;
  const testWindow = {
    location: {
      pathname,
      search: '?from=deep-link',
      hash: '#section',
      replace(target) {
        redirect = target;
      }
    },
    localStorage: {
      getItem() {
        return savedLanguage;
      }
    }
  };
  const testDocument = {
    readyState: 'loading',
    addEventListener(_event, handler) {
      callback = handler;
    },
    documentElement: {
      getAttribute(name) {
        return name === 'lang' ? htmlLang : null;
      }
    }
  };
  vm.runInNewContext(source, { window: testWindow, document: testDocument }, { filename: sourcePath });
  callback();
  return redirect;
}

assert.equal(
  preferredRedirect('/BreakRL/notes/dqn/dqn-en.html', 'zh', 'en'),
  '/BreakRL/notes/dqn/dqn.html?from=deep-link#section'
);
assert.equal(
  preferredRedirect('/BreakRL/notes/dqn/dqn.html', 'en', 'zh-CN'),
  '/BreakRL/notes/dqn/dqn-en.html?from=deep-link#section'
);
assert.equal(
  preferredRedirect('/BreakRL/', 'en', 'zh-CN'),
  '/BreakRL/index-en.html?from=deep-link#section'
);

console.log(
  `language toggle regression checks passed (${pairs.length + chapterPairs.length} pairs from the repository)`
);
