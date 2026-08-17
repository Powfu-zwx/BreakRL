# BreakRL Demo / 最小演示

<link rel="stylesheet" href="_static/breakrl-demo.css">

<div id="breakrl-demo" class="breakrl-demo" data-lang="zh">
  <div class="breakrl-demo__header">
    <div>
      <p class="breakrl-demo__eyebrow">FAILURE-FIRST RL</p>
      <h2 data-zh="损失下降，回报却塌缩" data-en="The loss goes down. The return collapses.">损失下降，回报却塌缩</h2>
      <p class="breakrl-demo__lede" data-zh="离线数据没有覆盖的动作，会被 Q 学习的贪心目标高估。于是训练损失看起来正常，策略却学会了数据中从未出现过的动作。"
        data-en="When offline data does not cover an action, the greedy Q-learning target can overestimate it. The loss looks healthy while the policy learns an action the data never contained.">离线数据没有覆盖的动作，会被 Q 学习的贪心目标高估。于是训练损失看起来正常，策略却学会了数据中从未出现过的动作。</p>
    </div>
    <div class="breakrl-demo__language" role="group" aria-label="演示语言">
      <button type="button" class="breakrl-demo__language-button" data-demo-language="zh" aria-pressed="true">中文</button>
      <button type="button" class="breakrl-demo__language-button" data-demo-language="en" aria-pressed="false">EN</button>
    </div>
  </div>

  <div class="breakrl-demo__controls">
    <label class="breakrl-demo__label" for="breakrl-demo-coverage">
      <span data-zh="数据覆盖率" data-en="Data coverage">数据覆盖率</span>
      <output id="breakrl-demo-coverage-value" for="breakrl-demo-coverage">35%</output>
    </label>
    <input id="breakrl-demo-coverage" class="breakrl-demo__range" type="range" min="20" max="100" step="5" value="35"
      aria-describedby="breakrl-demo-coverage-hint">
    <p id="breakrl-demo-coverage-hint" class="breakrl-demo__hint">低覆盖率：未见动作更容易被 Q 值高估。</p>
  </div>

  <div class="breakrl-demo__plot-wrap">
    <svg id="breakrl-demo-chart" class="breakrl-demo__plot" viewBox="0 0 760 390" role="img"
      aria-labelledby="breakrl-demo-chart-title breakrl-demo-chart-description">
      <title id="breakrl-demo-chart-title">损失下降与实际回报</title>
      <desc id="breakrl-demo-chart-description">一条损失下降曲线与一条在低数据覆盖率下先升后降的实际回报曲线。</desc>
    </svg>
  </div>

  <div class="breakrl-demo__readout" role="status" aria-live="polite">
    <strong id="breakrl-demo-status">失败模式：损失下降，但实际回报在训练后段塌缩。</strong>
    <span id="breakrl-demo-metric" class="breakrl-demo__metric">最终回报 0.08 · TD loss 0.08</span>
  </div>

  <div class="breakrl-demo__legend" aria-label="图例">
    <span><i class="breakrl-demo__swatch breakrl-demo__swatch--loss" aria-hidden="true"></i><span data-zh="TD loss（越低越好）" data-en="TD loss (lower is better)">TD loss（越低越好）</span></span>
    <span><i class="breakrl-demo__swatch breakrl-demo__swatch--return" aria-hidden="true"></i><span data-zh="实际回报（越高越好）" data-en="Actual return (higher is better)">实际回报（越高越好）</span></span>
    <span><i class="breakrl-demo__swatch breakrl-demo__swatch--baseline" aria-hidden="true"></i><span data-zh="行为克隆基线" data-en="Behavior-cloning baseline">行为克隆基线</span></span>
  </div>

  <p class="breakrl-demo__note" data-zh="这是一个固定的教学示意，不会训练模型，也不代表某次实验的具体数值。想看真实消融结果，请进入完整章节。"
    data-en="This is a fixed teaching illustration: it does not train a model and does not report the exact numbers from one experiment. Open the full chapter for the saved ablation results.">这是一个固定的教学示意，不会训练模型，也不代表某次实验的具体数值。想看真实消融结果，请进入完整章节。</p>
  <p class="breakrl-demo__links">
    <a href="notes/offline-rl/offline-rl_experiments.html" data-zh="阅读离线强化学习章节" data-en="Read the Offline RL chapter">阅读离线强化学习章节</a>
    <span aria-hidden="true"> · </span>
    <a href="failure-atlas.html" data-zh="查看失败模式图鉴" data-en="Browse the Failure Atlas">查看失败模式图鉴</a>
  </p>
</div>

<script src="_static/breakrl-demo.js"></script>
