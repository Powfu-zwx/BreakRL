# 最小演示

<div id="breakrl-demo" class="breakrl-demo">
  <div class="breakrl-demo__header">
    <p class="breakrl-demo__headline">损失下降，回报却塌缩</p>
    <p class="breakrl-demo__lede">离线数据没有覆盖的动作，会被 Q 学习的贪心目标高估。于是训练损失看起来正常，策略却学会了数据中从未出现过的动作。</p>
  </div>

  <div class="breakrl-demo__controls">
    <label class="breakrl-demo__label" for="breakrl-demo-coverage">
      <span>数据覆盖率</span>
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
      <desc id="breakrl-demo-chart-description">低数据覆盖率下，损失曲线继续下降，实际回报曲线在训练后段塌缩。</desc>
    </svg>
  </div>

  <div class="breakrl-demo__readout" role="status" aria-live="polite">
    <strong id="breakrl-demo-status">失败模式：损失下降，但实际回报在训练后段塌缩。</strong>
    <span id="breakrl-demo-metric" class="breakrl-demo__metric">最终回报 0.08 · TD loss 0.11</span>
  </div>

  <div class="breakrl-demo__legend" aria-label="图例">
    <span><i class="breakrl-demo__swatch breakrl-demo__swatch--loss" aria-hidden="true"></i><span>TD loss（越低越好）</span></span>
    <span><i class="breakrl-demo__swatch breakrl-demo__swatch--return" aria-hidden="true"></i><span>实际回报（越高越好）</span></span>
    <span><i class="breakrl-demo__swatch breakrl-demo__swatch--baseline" aria-hidden="true"></i><span>行为克隆基线</span></span>
  </div>

  <p class="breakrl-demo__note">这是一个固定的教学示意，不会训练模型，也不代表某次实验的具体数值。同一条失败模式：最小演示 → 图鉴第 8 条 → 离线强化学习章。</p>
  <p class="breakrl-demo__links">
    <a href="failure-atlas.html#atlas-8-offline-loss">失败模式图鉴第 8 条</a>
    <span aria-hidden="true"> · </span>
    <a href="notes/offline-rl/offline-rl.html">阅读离线强化学习章</a>
    <span aria-hidden="true"> · </span>
    <a href="offline-rl-text.html">打开正文 PDF</a>
  </p>
</div>
