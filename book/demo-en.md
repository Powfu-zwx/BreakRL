# Minimum demo

<div id="breakrl-demo" class="breakrl-demo">
  <div class="breakrl-demo__header">
    <p class="breakrl-demo__headline">The loss goes down. The return collapses.</p>
    <p class="breakrl-demo__lede">When offline data does not cover an action, the greedy Q-learning target can overestimate it. The loss looks healthy while the policy learns an action the data never contained.</p>
  </div>

  <div class="breakrl-demo__controls">
    <label class="breakrl-demo__label" for="breakrl-demo-coverage">
      <span>Data coverage</span>
      <output id="breakrl-demo-coverage-value" for="breakrl-demo-coverage">35%</output>
    </label>
    <input id="breakrl-demo-coverage" class="breakrl-demo__range" type="range" min="20" max="100" step="5" value="35"
      aria-describedby="breakrl-demo-coverage-hint">
    <p id="breakrl-demo-coverage-hint" class="breakrl-demo__hint">Low coverage: unseen actions are easier for Q values to overestimate.</p>
  </div>

  <div class="breakrl-demo__plot-wrap">
    <svg id="breakrl-demo-chart" class="breakrl-demo__plot" viewBox="0 0 760 390" role="img"
      aria-labelledby="breakrl-demo-chart-title breakrl-demo-chart-description">
      <title id="breakrl-demo-chart-title">Falling loss and actual return</title>
      <desc id="breakrl-demo-chart-description">With low data coverage, the loss keeps falling while actual return collapses late in training.</desc>
    </svg>
  </div>

  <div class="breakrl-demo__readout" role="status" aria-live="polite">
    <strong id="breakrl-demo-status">Failure mode: the loss falls while actual return collapses late in training.</strong>
    <span id="breakrl-demo-metric" class="breakrl-demo__metric">Final return 0.08 · TD loss 0.11</span>
  </div>

  <div class="breakrl-demo__legend" aria-label="Legend">
    <span><i class="breakrl-demo__swatch breakrl-demo__swatch--loss" aria-hidden="true"></i><span>TD loss (lower is better)</span></span>
    <span><i class="breakrl-demo__swatch breakrl-demo__swatch--return" aria-hidden="true"></i><span>Actual return (higher is better)</span></span>
    <span><i class="breakrl-demo__swatch breakrl-demo__swatch--baseline" aria-hidden="true"></i><span>Behavior-cloning baseline</span></span>
  </div>

  <p class="breakrl-demo__note">This is a fixed teaching illustration: it does not train a model and does not report the exact numbers from one experiment. Same failure mode: this demo → Failure Atlas #8 → the Offline RL chapter.</p>
  <p class="breakrl-demo__links">
    <a href="failure-atlas-en.html#atlas-8-offline-loss">Failure Atlas #8</a>
    <span aria-hidden="true"> · </span>
    <a href="notes/offline-rl/offline-rl-en.html">Read the Offline RL chapter</a>
    <span aria-hidden="true"> · </span>
    <a href="offline-rl-text-en.html">Open the chapter PDF</a>
  </p>
</div>
