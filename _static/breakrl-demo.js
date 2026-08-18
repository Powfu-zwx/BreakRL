(function () {
  'use strict';

  var root = document.getElementById('breakrl-demo');
  if (!root) {
    return;
  }

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var svg = document.getElementById('breakrl-demo-chart');
  var coverageInput = document.getElementById('breakrl-demo-coverage');
  var coverageValue = document.getElementById('breakrl-demo-coverage-value');
  var coverageHint = document.getElementById('breakrl-demo-coverage-hint');
  var status = document.getElementById('breakrl-demo-status');
  var metric = document.getElementById('breakrl-demo-metric');
  var language = 'en';
  var width = 760;
  var height = 390;
  var margin = { top: 28, right: 58, bottom: 54, left: 62 };
  var plotWidth = width - margin.left - margin.right;
  var plotHeight = height - margin.top - margin.bottom;

  function createSvgElement(name, attributes, parent) {
    var element = document.createElementNS(SVG_NS, name);
    Object.keys(attributes || {}).forEach(function (key) {
      element.setAttribute(key, attributes[key]);
    });
    if (parent) {
      parent.appendChild(element);
    }
    return element;
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function xScale(step) {
    return margin.left + (step / 12) * plotWidth;
  }

  function yScale(value) {
    return margin.top + (1 - value) * plotHeight;
  }

  function pathFor(points) {
    return points
      .map(function (point, index) {
        return (index === 0 ? 'M' : 'L') + ' ' + xScale(point.step).toFixed(2) + ' ' + yScale(point.value).toFixed(2);
      })
      .join(' ');
  }

  function seriesFor(coverage) {
    var loss = [];
    var actualReturn = [];
    var behaviorCloning = [];
    var plateau = 0.2 + 0.78 * coverage;
    var collapse = Math.max(0, 0.88 - 1.15 * coverage);

    for (var step = 0; step <= 12; step += 1) {
      var progress = step / 12;
      var late = Math.max(0, (progress - 0.34) / 0.66);
      var earlyReturn = 0.18 + 0.5 * Math.min(progress / 0.34, 1);
      var returnValue = earlyReturn + (plateau - 0.68) * late - collapse * late;
      var lossValue = 0.92 * Math.exp(-2.7 * progress) + 0.055 + 0.008 * (1 - coverage) * Math.cos(step * 0.8);
      loss.push({ step: step, value: clamp(lossValue, 0.04, 1) });
      actualReturn.push({ step: step, value: clamp(returnValue + 0.008 * Math.sin(step * 1.7), 0.08, 0.96) });
      behaviorCloning.push({ step: step, value: 0.62 });
    }

    return {
      loss: loss,
      actualReturn: actualReturn,
      behaviorCloning: behaviorCloning
    };
  }

  function translated(node) {
    return node.getAttribute('data-' + language) || '';
  }

  function setLanguage(nextLanguage) {
    language = nextLanguage === 'en' ? 'en' : 'zh';
    root.setAttribute('data-lang', language);
    root.querySelectorAll('[data-zh][data-en]').forEach(function (node) {
      node.textContent = translated(node);
    });
    root.querySelectorAll('[data-zh-href][data-en-href]').forEach(function (node) {
      node.setAttribute('href', node.getAttribute(language === 'en' ? 'data-en-href' : 'data-zh-href'));
    });
    root.querySelectorAll('[data-demo-language]').forEach(function (button) {
      var active = button.getAttribute('data-demo-language') === language;
      button.setAttribute('aria-pressed', String(active));
    });
    draw();
  }

  function draw() {
    var coverage = Number(coverageInput.value) / 100;
    var coveragePercent = Math.round(coverage * 100);
    var data = seriesFor(coverage);
    var finalReturn = data.actualReturn[data.actualReturn.length - 1].value;
    var finalLoss = data.loss[data.loss.length - 1].value;
    var lowCoverage = coverage < 0.55;

    coverageValue.textContent = coveragePercent + '%';
    if (lowCoverage) {
      coverageHint.textContent = language === 'zh'
        ? '低覆盖率：未见动作更容易被 Q 值高估。'
        : 'Low coverage: unseen actions are easier for Q values to overestimate.';
      status.textContent = language === 'zh'
        ? '失败模式：损失下降，但实际回报在训练后段塌缩。'
        : 'Failure mode: the loss falls while actual return collapses late in training.';
    } else if (coverage < 0.75) {
      coverageHint.textContent = language === 'zh'
        ? '覆盖率接近临界区：先看行为克隆基线，再决定是否相信 Q 值。'
        : 'Near the boundary: check the behavior-cloning baseline before trusting Q values.';
      status.textContent = language === 'zh'
        ? '临界状态：损失和回报开始重新一致，但仍有分布外风险。'
        : 'Boundary case: loss and return start to agree, but out-of-distribution risk remains.';
    } else {
      coverageHint.textContent = language === 'zh'
        ? '覆盖率较高：贪心目标更少依赖数据外动作。'
        : 'Higher coverage: the greedy target relies less on out-of-distribution actions.';
      status.textContent = language === 'zh'
        ? '覆盖率较高：损失下降与回报提升重新一致。'
        : 'Higher coverage: falling loss and improving return become aligned again.';
    }
    metric.textContent = language === 'zh'
      ? '最终回报 ' + finalReturn.toFixed(2) + ' · TD loss ' + finalLoss.toFixed(2)
      : 'Final return ' + finalReturn.toFixed(2) + ' · TD loss ' + finalLoss.toFixed(2);

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    var title = createSvgElement('title', { id: 'breakrl-demo-chart-title' }, svg);
    title.textContent = language === 'zh' ? '损失下降与实际回报' : 'Falling loss and actual return';
    var description = createSvgElement('desc', { id: 'breakrl-demo-chart-description' }, svg);
    description.textContent = language === 'zh'
      ? '低数据覆盖率下，损失曲线继续下降，实际回报曲线在训练后段塌缩。'
      : 'With low data coverage, the loss keeps falling while actual return collapses late in training.';

    var grid = createSvgElement('g', { 'aria-hidden': 'true' }, svg);
    [0, 0.25, 0.5, 0.75, 1].forEach(function (tick) {
      createSvgElement('line', {
        class: 'breakrl-demo__grid-line',
        x1: margin.left,
        x2: width - margin.right,
        y1: yScale(tick),
        y2: yScale(tick)
      }, grid);
      var yTick = createSvgElement('text', {
        class: 'breakrl-demo__tick',
        x: margin.left - 10,
        y: yScale(tick) + 4,
        'text-anchor': 'end'
      }, grid);
      yTick.textContent = Math.round(tick * 100) + '%';
    });

    [0, 3, 6, 9, 12].forEach(function (step) {
      var x = xScale(step);
      createSvgElement('line', {
        class: 'breakrl-demo__grid-line',
        x1: x,
        x2: x,
        y1: margin.top,
        y2: height - margin.bottom
      }, grid);
      var xTick = createSvgElement('text', {
        class: 'breakrl-demo__tick',
        x: x,
        y: height - margin.bottom + 22,
        'text-anchor': 'middle'
      }, grid);
      xTick.textContent = Math.round((step / 12) * 100) + '%';
    });

    var axes = createSvgElement('g', { 'aria-hidden': 'true' }, svg);
    createSvgElement('line', {
      class: 'breakrl-demo__axis-line',
      x1: margin.left,
      x2: margin.left,
      y1: margin.top,
      y2: height - margin.bottom
    }, axes);
    createSvgElement('line', {
      class: 'breakrl-demo__axis-line',
      x1: margin.left,
      x2: width - margin.right,
      y1: height - margin.bottom,
      y2: height - margin.bottom
    }, axes);

    var xLabel = createSvgElement('text', {
      class: 'breakrl-demo__axis-label',
      x: margin.left + plotWidth / 2,
      y: height - 10,
      'text-anchor': 'middle'
    }, axes);
    xLabel.textContent = language === 'zh' ? '训练进度' : 'Training progress';

    var yLabel = createSvgElement('text', {
      class: 'breakrl-demo__axis-label',
      'text-anchor': 'middle',
      transform: 'translate(16 ' + (margin.top + plotHeight / 2) + ') rotate(-90)'
    }, axes);
    yLabel.textContent = language === 'zh' ? '归一化数值' : 'Normalized value';

    var curves = createSvgElement('g', { 'aria-hidden': 'true' }, svg);
    createSvgElement('path', {
      class: 'breakrl-demo__series breakrl-demo__series--baseline',
      d: pathFor(data.behaviorCloning)
    }, curves);
    createSvgElement('path', {
      class: 'breakrl-demo__series breakrl-demo__series--loss',
      d: pathFor(data.loss)
    }, curves);
    createSvgElement('path', {
      class: 'breakrl-demo__series breakrl-demo__series--return',
      d: pathFor(data.actualReturn)
    }, curves);

    var finalX = xScale(12);
    createSvgElement('circle', {
      class: 'breakrl-demo__endpoint breakrl-demo__endpoint--loss',
      cx: finalX,
      cy: yScale(finalLoss),
      r: 5
    }, curves);
    createSvgElement('circle', {
      class: 'breakrl-demo__endpoint breakrl-demo__endpoint--return',
      cx: finalX,
      cy: yScale(finalReturn),
      r: 5
    }, curves);

    var lossLabel = createSvgElement('text', {
      class: 'breakrl-demo__series-label',
      x: finalX + 9,
      y: yScale(finalLoss) + 4
    }, curves);
    lossLabel.textContent = 'TD loss';
    var returnLabel = createSvgElement('text', {
      class: 'breakrl-demo__series-label',
      x: finalX + 9,
      y: yScale(finalReturn) + 4
    }, curves);
    returnLabel.textContent = language === 'zh' ? '实际回报' : 'Return';
  }

  coverageInput.addEventListener('input', draw);
  root.querySelectorAll('[data-demo-language]').forEach(function (button) {
    button.addEventListener('click', function () {
      setLanguage(button.getAttribute('data-demo-language'));
    });
  });

  setLanguage(document.documentElement.lang === 'en' ? 'en' : 'zh');
})();
