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

const pairs = [
  [
    'notes/multi-armed-bandit/multi-armed-bandit_experiments.html',
    'notes/multi-armed-bandit/multi-armed-bandit_experiments_en.html'
  ],
  ['notes/mdp/mdp_experiments.html', 'notes/mdp/mdp_experiments_en.html'],
  [
    'notes/temporal-difference-learning/temporal-difference-learning_experiments.html',
    'notes/temporal-difference-learning/temporal-difference-learning_experiments_en.html'
  ],
  ['notes/dqn/dqn_experiments.html', 'notes/dqn/dqn_experiments_en.html'],
  ['notes/policy-gradient/pg_experiments.html', 'notes/policy-gradient/pg_experiments_en.html'],
  ['notes/actor-critic/ac_experiments.html', 'notes/actor-critic/ac_experiments_en.html'],
  ['notes/ppo/ppo_experiments.html', 'notes/ppo/ppo_experiments_en.html'],
  ['notes/sac/sac_experiments.html', 'notes/sac/sac_experiments_en.html'],
  ['notes/offline-rl/offline-rl_experiments.html', 'notes/offline-rl/offline-rl_experiments_en.html'],
  ['notes/model-based-rl/model-based-rl_experiments.html', 'notes/model-based-rl/model-based-rl_experiments_en.html'],
  [
    'notes/decision-transformer/decision-transformer_experiments.html',
    'notes/decision-transformer/decision-transformer_experiments_en.html'
  ],
  ['notes/rlhf/rlhf_experiments.html', 'notes/rlhf/rlhf_experiments_en.html'],
  ['notes/dpo/dpo_experiments.html', 'notes/dpo/dpo_experiments_en.html'],
  ['notes/grpo/grpo_experiments.html', 'notes/grpo/grpo_experiments_en.html'],
  ['failure-atlas.html', 'failure-atlas-en.html']
];

for (const [zh, en] of pairs) {
  assert.equal(toggle.parallelPath(`/BreakRL/${zh}`, 'en'), `/BreakRL/${en}`);
  assert.equal(toggle.parallelPath(`/BreakRL/${en}`, 'zh'), `/BreakRL/${zh}`);
  assert.equal(toggle.parallelPath(`/BreakRL/${en}`, 'en'), null);
  assert.equal(toggle.parallelPath(`/BreakRL/${zh}`, 'zh'), null);
}

for (const shared of ['/', '/BreakRL/', '/BreakRL/index.html', '/BreakRL/search.html', '/BreakRL/genindex.html']) {
  assert.equal(toggle.parallelPath(shared, 'zh'), null);
  assert.equal(toggle.parallelPath(shared, 'en'), null);
}

assert.equal(toggle.parallelTarget('en'), '/BreakRL/notes/dqn/dqn_experiments_en.html?tab=loss#figure-3');
assert.equal(toggle.pageLanguage('/BreakRL/notes/dqn/dqn_experiments.html'), 'zh');
assert.equal(toggle.pageLanguage('/BreakRL/notes/dqn/dqn_experiments_en.html'), 'en');
assert.equal(toggle.pageLanguage('/BreakRL/search.html'), null);

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

assert.match(source, /saved \|\| pageLang \|\| LANG_EN/);
assert.match(source, /\[LANG_EN, LANG_ZH\]/);
assert.match(source, /href === '#' \|\| href === '#breakrl-english'/);
assert.match(source, /setAttribute\('aria-pressed'/);
assert.match(source, /role', 'group'/);
assert.match(source, /bd-sidebar-secondary/);
assert.doesNotMatch(source, /replace\(\/\\\.html\$\//);

console.log(`language toggle regression checks passed (${pairs.length} explicit pairs)`);
