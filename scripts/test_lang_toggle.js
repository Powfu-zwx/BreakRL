'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const sourcePath = path.join(__dirname, '..', 'book', '_static', 'lang-toggle.js');
const source = fs.readFileSync(sourcePath, 'utf8');
const location = {
  pathname: '/BreakRL/notes/dqn/dqn_experiments.html',
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

// Chapter notebooks pair by the `_en` suffix, so the expected pairs come from the
// repository rather than a list kept here: a new chapter is covered on arrival.
const notesDir = path.join(__dirname, '..', 'book', 'notes');
const chapterPairs = fs
  .readdirSync(notesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .flatMap((chapter) =>
    fs
      .readdirSync(path.join(notesDir, chapter.name))
      .filter((file) => file.endsWith('_experiments.ipynb'))
      .map((file) => {
        const zh = `notes/${chapter.name}/${file.replace(/\.ipynb$/, '.html')}`;
        return [zh, zh.replace(/\.html$/, '_en.html')];
      })
  );
assert.ok(chapterPairs.length > 0, 'found chapter notebooks to pair');

const pairs = [
  ...chapterPairs,
  ['failure-atlas.html', 'failure-atlas-en.html'],
  ['offline-rl-text.html', 'offline-rl-text-en.html'],
  ['index-zh.html', 'index.html']
];

for (const [zh, en] of pairs) {
  assert.equal(toggle.parallelPath(`/BreakRL/${zh}`, 'en'), `/BreakRL/${en}`);
  assert.equal(toggle.parallelPath(`/BreakRL/${en}`, 'zh'), `/BreakRL/${zh}`);
  assert.equal(toggle.parallelPath(`/BreakRL/${en}`, 'en'), null);
  assert.equal(toggle.parallelPath(`/BreakRL/${zh}`, 'zh'), null);
}

assert.equal(toggle.parallelPath('/BreakRL/', 'zh'), '/BreakRL/index-zh.html');
assert.equal(toggle.parallelPath('/BreakRL/index.html', 'zh'), '/BreakRL/index-zh.html');
assert.equal(toggle.parallelPath('/BreakRL/index-zh.html', 'en'), '/BreakRL/index.html');
assert.equal(toggle.parallelPath('/BreakRL/index.html', 'en'), null);
assert.equal(toggle.pageLanguage('/BreakRL/'), 'en');
assert.equal(toggle.pageLanguage('/BreakRL/index.html'), 'en');
assert.equal(toggle.pageLanguage('/BreakRL/index-zh.html'), 'zh');

// Sphinx's search and index pages, and the single-language demo, have no
// counterpart: the toggle must neither navigate away nor claim a language.
for (const alone of ['/BreakRL/search.html', '/BreakRL/genindex.html', '/BreakRL/demo.html']) {
  assert.equal(toggle.parallelPath(alone, 'zh'), null);
  assert.equal(toggle.parallelPath(alone, 'en'), null);
  assert.equal(toggle.pageLanguage(alone), null);
}

// Editions pair inside the chapter directories, where they are published
// together; a page named like a notebook anywhere else pairs with nothing.
assert.equal(toggle.parallelPath('/BreakRL/setup_experiments.html', 'en'), null);

assert.equal(toggle.parallelTarget('en'), '/BreakRL/notes/dqn/dqn_experiments_en.html?tab=loss#figure-3');
assert.equal(toggle.pageLanguage('/BreakRL/notes/dqn/dqn_experiments.html'), 'zh');
assert.equal(toggle.pageLanguage('/BreakRL/notes/dqn/dqn_experiments_en.html'), 'en');

function preferredRedirect(pathname, savedLanguage) {
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
    documentElement: {}
  };
  vm.runInNewContext(source, { window: testWindow, document: testDocument }, { filename: sourcePath });
  callback();
  return redirect;
}

assert.equal(
  preferredRedirect('/BreakRL/notes/dqn/dqn_experiments_en.html', 'zh'),
  '/BreakRL/notes/dqn/dqn_experiments.html?from=deep-link#section'
);
assert.equal(
  preferredRedirect('/BreakRL/notes/dqn/dqn_experiments.html', 'en'),
  '/BreakRL/notes/dqn/dqn_experiments_en.html?from=deep-link#section'
);

assert.equal(
  preferredRedirect('/BreakRL/notes/dqn/dqn_experiments.html', 'en'),
  '/BreakRL/notes/dqn/dqn_experiments_en.html?from=deep-link#section'
);

assert.equal(
  preferredRedirect('/BreakRL/index.html', 'zh'),
  '/BreakRL/index-zh.html?from=deep-link#section'
);
assert.equal(
  preferredRedirect('/BreakRL/', 'zh'),
  '/BreakRL/index-zh.html?from=deep-link#section'
);

console.log(`language toggle regression checks passed (${pairs.length} explicit pairs)`);
