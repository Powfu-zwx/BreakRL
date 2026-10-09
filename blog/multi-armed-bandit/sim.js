// Lightweight multi-seed regret simulator (Zero external dependency)
(function() {
  const canvas = document.getElementById('regret-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId = null;

  // Environment: 3 arms with gaps
  const trueMeans = [0.80, 0.50, 0.30];
  const bestMean = 0.80;
  const K = trueMeans.length;
  const T = 400;
  const NUM_RUNS = 40;

  function dpr() {
    return window.devicePixelRatio || 1;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const ratio = dpr();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.scale(ratio, ratio);
  }

  function pullArm(arm) {
    return Math.random() < trueMeans[arm] ? 1 : 0;
  }

  // Beta random generator via gamma approximation
  function betaRandom(alpha, beta) {
    function gammaRandom(a) {
      if (a < 1) {
        return gammaRandom(a + 1) * Math.pow(Math.random(), 1 / a);
      }
      const d = a - 1 / 3;
      const c = 1 / Math.sqrt(9 * d);
      while (true) {
        let z = 0;
        let u1 = Math.random();
        let u2 = Math.random();
        z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const v = Math.pow(1 + c * z, 3);
        if (v <= 0) continue;
        const u = Math.random();
        if (u < 1 - 0.0331 * z * z * z * z) return d * v;
        if (Math.log(u) < 0.5 * z * z + d * (1 - v + Math.log(v))) return d * v;
      }
    }
    const x = gammaRandom(alpha);
    const y = gammaRandom(beta);
    return x / (x + y);
  }

  function simulateRun(algo) {
    const regretCurve = new Float32Array(T);
    let cumRegret = 0;

    const counts = new Uint32Array(K);
    const rewards = new Float32Array(K);
    const alphas = new Float32Array(K).fill(1);
    const betas = new Float32Array(K).fill(1);

    // Initial pull for UCB1
    if (algo === 'ucb') {
      for (let a = 0; a < K; a++) {
        const r = pullArm(a);
        counts[a] = 1;
        rewards[a] = r;
        cumRegret += (bestMean - trueMeans[a]);
        regretCurve[a] = cumRegret;
      }
    }

    const startStep = algo === 'ucb' ? K : 0;

    for (let t = startStep; t < T; t++) {
      let chosen = 0;

      if (algo === 'greedy') {
        let maxQ = -Infinity;
        const bestCandidates = [];
        for (let a = 0; a < K; a++) {
          const q = counts[a] === 0 ? 0 : rewards[a] / counts[a];
          if (q > maxQ) {
            maxQ = q;
            bestCandidates.length = 0;
            bestCandidates.push(a);
          } else if (q === maxQ) {
            bestCandidates.push(a);
          }
        }
        chosen = bestCandidates[Math.floor(Math.random() * bestCandidates.length)];
      } else if (algo === 'egreedy') {
        const eps = 0.1;
        if (Math.random() < eps) {
          chosen = Math.floor(Math.random() * K);
        } else {
          let maxQ = -Infinity;
          const bestCandidates = [];
          for (let a = 0; a < K; a++) {
            const q = counts[a] === 0 ? 0 : rewards[a] / counts[a];
            if (q > maxQ) {
              maxQ = q;
              bestCandidates.length = 0;
              bestCandidates.push(a);
            } else if (q === maxQ) {
              bestCandidates.push(a);
            }
          }
          chosen = bestCandidates[Math.floor(Math.random() * bestCandidates.length)];
        }
      } else if (algo === 'ucb') {
        let maxIdx = -Infinity;
        for (let a = 0; a < K; a++) {
          const mean = rewards[a] / counts[a];
          const bonus = Math.sqrt((2 * Math.log(t + 1)) / counts[a]);
          const idx = mean + bonus;
          if (idx > maxIdx) {
            maxIdx = idx;
            chosen = a;
          }
        }
      } else if (algo === 'ts') {
        let maxDraw = -Infinity;
        for (let a = 0; a < K; a++) {
          const draw = betaRandom(alphas[a], betas[a]);
          if (draw > maxDraw) {
            maxDraw = draw;
            chosen = a;
          }
        }
      }

      const r = pullArm(chosen);
      counts[chosen]++;
      rewards[chosen] += r;
      alphas[chosen] += r;
      betas[chosen] += (1 - r);

      cumRegret += (bestMean - trueMeans[chosen]);
      regretCurve[t] = cumRegret;
    }

    return regretCurve;
  }

  window.runRegretSimulation = function() {
    if (animationId) cancelAnimationFrame(animationId);
    resize();

    const selected = document.querySelector('input[name="sim-algo"]:checked');
    const algo = selected ? selected.value : 'greedy';

    const runs = [];
    for (let i = 0; i < NUM_RUNS; i++) {
      runs.push(simulateRun(algo));
    }

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const padX = 40;
    const padY = 25;
    const maxRegret = 180;

    const colors = {
      greedy: { line: 'rgba(176, 70, 50, 0.28)', avg: '#b04632' },
      egreedy: { line: 'rgba(184, 115, 42, 0.28)', avg: '#b8732a' },
      ucb: { line: 'rgba(35, 116, 64, 0.28)', avg: '#237440' },
      ts: { line: 'rgba(45, 95, 150, 0.28)', avg: '#2d5f96' }
    };
    const c = colors[algo] || colors.greedy;

    let progress = 0;
    const speed = 12; // steps per frame

    function drawFrame() {
      progress = Math.min(T, progress + speed);

      ctx.clearRect(0, 0, w, h);

      // Grid lines
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.strokeStyle = isDark ? '#262522' : '#ebe9e0';
      ctx.lineWidth = 1;

      // Horizontal grid
      [50, 100, 150].forEach(val => {
        const y = h - padY - (val / maxRegret) * (h - 2 * padY);
        ctx.beginPath();
        ctx.moveTo(padX, y);
        ctx.lineTo(w - 15, y);
        ctx.stroke();

        ctx.fillStyle = isDark ? '#7a7870' : '#99978e';
        ctx.font = '10px "Anthropic Sans", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(val, padX - 6, y + 3);
      });

      // Axis lines
      ctx.strokeStyle = isDark ? '#403e39' : '#d0cfc7';
      ctx.beginPath();
      ctx.moveTo(padX, padY);
      ctx.lineTo(padX, h - padY);
      ctx.lineTo(w - 15, h - padY);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = isDark ? '#7a7870' : '#99978e';
      ctx.font = '10px "Anthropic Sans", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('Regret R_T', padX + 50, padY - 8);
      ctx.textAlign = 'center';
      ctx.fillText('Rounds (T = 400)', (w + padX) / 2, h - 8);

      // Draw runs
      ctx.lineWidth = 1.3;
      ctx.strokeStyle = c.line;

      for (let i = 0; i < NUM_RUNS; i++) {
        const curve = runs[i];
        ctx.beginPath();
        for (let t = 0; t < progress; t++) {
          const x = padX + (t / (T - 1)) * (w - padX - 20);
          const y = h - padY - (curve[t] / maxRegret) * (h - 2 * padY);
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw Mean curve
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = c.avg;
      ctx.beginPath();
      for (let t = 0; t < progress; t++) {
        let sum = 0;
        for (let i = 0; i < NUM_RUNS; i++) sum += runs[i][t];
        const mean = sum / NUM_RUNS;
        const x = padX + (t / (T - 1)) * (w - padX - 20);
        const y = h - padY - (mean / maxRegret) * (h - 2 * padY);
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (progress < T) {
        animationId = requestAnimationFrame(drawFrame);
      }
    }

    drawFrame();
  };

  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(window.runRegretSimulation, 250);
  });
  window.addEventListener('resize', () => {
    if (window.runRegretSimulation) window.runRegretSimulation();
  });
})();

// Interactive Thompson Sampling Posterior Lens with Fluid Spring Interpolation
(function() {
  const canvas = document.getElementById('ts-lens-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let round = 0;
  let isAutoPlaying = false;
  let animFrameId = null;
  let lastStepTime = 0;
  const STEP_INTERVAL = 380; // ms between TS iterations in auto play
  
  // Environment: 2 Bernoulli arms
  const trueMeans = [0.65, 0.45]; // Arm 1 is better
  
  // Actual integer params (target)
  let targetAlphas = [1, 1];
  let targetBetas = [1, 1];
  
  // Display animated params (interpolated via lerp)
  let dispAlphas = [1, 1];
  let dispBetas = [1, 1];
  
  let targetSamples = [null, null];
  let dispSamples = [null, null];
  
  let lastChosen = null;
  let lastReward = null;

  function dpr() {
    return window.devicePixelRatio || 1;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const ratio = dpr();
    if (canvas.width !== rect.width * ratio || canvas.height !== rect.height * ratio) {
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      ctx.scale(ratio, ratio);
    }
  }

  function logBetaPdf(x, a, b) {
    if (x <= 0 || x >= 1) return -Infinity;
    function logGamma(z) {
      const g = 7;
      const C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
        771.32342877765313, -176.61502916214059, 12.507343278686905,
        -0.13857109583115912, 9.9843695780195716e-6, 1.5056327351493116e-7];
      if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * Math.exp(logGamma(1 - z)));
      z -= 1;
      let base = z + g + 0.5;
      let sum = C[0];
      for (let i = 1; i < g + 2; i++) sum += C[i] / (z + i);
      return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(base) - base + Math.log(sum);
    }
    const logB = logGamma(a) + logGamma(b) - logGamma(a + b);
    return (a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - logB;
  }

  function betaPdf(x, a, b) {
    if (a <= 1.001 && b <= 1.001) return 1.0;
    const l = logBetaPdf(x, a, b);
    return Math.exp(Math.min(100, Math.max(-100, l)));
  }

  function betaRandom(alpha, beta) {
    function gammaRandom(a) {
      if (a < 1) return gammaRandom(a + 1) * Math.pow(Math.random(), 1 / a);
      const d = a - 1 / 3;
      const c = 1 / Math.sqrt(9 * d);
      while (true) {
        let z = 0;
        let u1 = Math.random();
        let u2 = Math.random();
        z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const v = Math.pow(1 + c * z, 3);
        if (v <= 0) continue;
        const u = Math.random();
        if (u < 1 - 0.0331 * z * z * z * z) return d * v;
        if (Math.log(u) < 0.5 * z * z + d * (1 - v + Math.log(v))) return d * v;
      }
    }
    const x = gammaRandom(alpha);
    const y = gammaRandom(beta);
    return x / (x + y);
  }

  // Render loop with 60FPS fluid transition
  function renderLoop(timestamp) {
    resize();
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const padX = 35;
    const padY = 20;

    // Smooth lerp parameters towards target (liquid morphing)
    const lerpSpeed = 0.14;
    for (let i = 0; i < 2; i++) {
      dispAlphas[i] += (targetAlphas[i] - dispAlphas[i]) * lerpSpeed;
      dispBetas[i] += (targetBetas[i] - dispBetas[i]) * lerpSpeed;
      if (targetSamples[i] !== null) {
        if (dispSamples[i] === null) dispSamples[i] = targetSamples[i];
        else dispSamples[i] += (targetSamples[i] - dispSamples[i]) * 0.22;
      }
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.clearRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = isDark ? '#3d3b36' : '#d8d7cf';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX, h - padY);
    ctx.lineTo(w - 15, h - padY);
    ctx.stroke();

    // Ticks
    ctx.fillStyle = isDark ? '#7a7870' : '#8c8a82';
    ctx.font = '10px "Anthropic Sans", sans-serif';
    ctx.textAlign = 'center';
    [0, 0.25, 0.5, 0.75, 1.0].forEach(val => {
      const x = padX + val * (w - padX - 15);
      ctx.beginPath();
      ctx.moveTo(x, h - padY);
      ctx.lineTo(x, h - padY + 4);
      ctx.stroke();
      ctx.fillText(val.toFixed(2), x, h - padY + 14);
    });

    // Evaluate peak height for scaling
    let maxDensity = 2.4;
    for (let i = 0; i < 2; i++) {
      const a = dispAlphas[i];
      const b = dispBetas[i];
      if (a > 1 && b > 1) {
        const mode = (a - 1) / (a + b - 2);
        const peak = betaPdf(mode, a, b);
        if (peak > maxDensity) maxDensity = peak;
      }
    }
    maxDensity *= 1.18;

    const colors = [
      { stroke: '#2e6b45', fill: isDark ? 'rgba(46, 107, 69, 0.24)' : 'rgba(46, 107, 69, 0.15)', dot: '#237440' },
      { stroke: '#a85832', fill: isDark ? 'rgba(168, 88, 50, 0.24)' : 'rgba(168, 88, 50, 0.15)', dot: '#b04632' }
    ];

    // Draw Beta densities
    for (let i = 0; i < 2; i++) {
      const a = dispAlphas[i];
      const b = dispBetas[i];
      const c = colors[i];

      ctx.beginPath();
      const numPts = 140;
      for (let p = 0; p <= numPts; p++) {
        const theta = p / numPts;
        const pdfVal = betaPdf(theta, a, b);
        const x = padX + theta * (w - padX - 15);
        const y = h - padY - (pdfVal / maxDensity) * (h - 2 * padY);
        if (p === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = c.stroke;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.lineTo(padX + (w - padX - 15), h - padY);
      ctx.lineTo(padX, h - padY);
      ctx.fillStyle = c.fill;
      ctx.fill();

      // Draw sampled point (with smooth landing)
      if (dispSamples[i] !== null) {
        const sx = padX + dispSamples[i] * (w - padX - 15);
        const sy = h - padY;

        // Subtle glow ring on winning arm
        if (lastChosen === i) {
          ctx.beginPath();
          ctx.arc(sx, sy, 8, 0, 2 * Math.PI);
          ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(sx, sy, 5, 0, 2 * Math.PI);
        ctx.fillStyle = c.dot;
        ctx.fill();
        ctx.strokeStyle = isDark ? '#141413' : '#ffffff';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        ctx.strokeStyle = c.dot;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(sx, h - padY);
        ctx.lineTo(sx, h - padY - 26);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Auto Play timer handling inside requestAnimationFrame for smooth cadence
    if (isAutoPlaying) {
      if (!lastStepTime) lastStepTime = timestamp;
      if (timestamp - lastStepTime > STEP_INTERVAL) {
        lastStepTime = timestamp;
        if (round >= 60) {
          window.toggleAutoTsLens();
        } else {
          executeStep();
        }
      }
    }

    animFrameId = requestAnimationFrame(renderLoop);
  }

  function updateStatus(text) {
    const el = document.getElementById('ts-lens-status-text');
    if (el) el.innerHTML = text;
    const rEl = document.getElementById('ts-lens-round-num');
    if (rEl) rEl.textContent = `Round t = ${round}`;
  }

  function executeStep() {
    round++;

    // 1. Posterior Sampling
    const theta0 = betaRandom(targetAlphas[0], targetBetas[0]);
    const theta1 = betaRandom(targetAlphas[1], targetBetas[1]);
    targetSamples = [theta0, theta1];

    // 2. Greedy selection
    lastChosen = theta0 >= theta1 ? 0 : 1;

    // 3. Environment draw
    lastReward = Math.random() < trueMeans[lastChosen] ? 1 : 0;

    // 4. Update target counts
    if (lastReward === 1) {
      targetAlphas[lastChosen] += 1;
    } else {
      targetBetas[lastChosen] += 1;
    }

    const armName = lastChosen === 0 ? '<strong style="color:#237440">Arm 1</strong>' : '<strong style="color:#b04632">Arm 2</strong>';
    const sampleVal = targetSamples[lastChosen].toFixed(2);
    const rivalVal = targetSamples[1 - lastChosen].toFixed(2);
    const resText = lastReward === 1 ? '<span style="color:#237440">Success (+1)</span>' : '<span style="color:#b04632">Failure (0)</span>';

    const isZh = document.documentElement.lang.startsWith('zh');
    if (isZh) {
      updateStatus(`抽样世界：θ₁=${theta0.toFixed(2)}, θ₂=${theta1.toFixed(2)} → 选定 ${armName} (${sampleVal} > ${rivalVal})。环境返回 ${resText}，曲线自适应变形。`);
    } else {
      updateStatus(`Sampled: θ₁=${theta0.toFixed(2)}, θ₂=${theta1.toFixed(2)} → Picked ${armName} (${sampleVal} > ${rivalVal}). Environment returned ${resText}, morphing posterior.`);
    }
  }

  window.stepTsLens = function() {
    if (isAutoPlaying) {
      window.toggleAutoTsLens();
    }
    executeStep();
  };

  window.toggleAutoTsLens = function() {
    const btn = document.getElementById('ts-lens-auto-btn');
    const isZh = document.documentElement.lang.startsWith('zh');

    isAutoPlaying = !isAutoPlaying;
    lastStepTime = 0;

    if (btn) {
      if (isAutoPlaying) {
        btn.textContent = isZh ? '暂停' : 'Pause';
      } else {
        btn.textContent = isZh ? '自动演练' : 'Auto Play';
      }
    }
  };

  window.resetTsLens = function() {
    if (isAutoPlaying) {
      window.toggleAutoTsLens();
    }
    round = 0;
    targetAlphas = [1, 1];
    targetBetas = [1, 1];
    dispAlphas = [1, 1];
    dispBetas = [1, 1];
    targetSamples = [null, null];
    dispSamples = [null, null];
    lastChosen = null;
    lastReward = null;

    const isZh = document.documentElement.lang.startsWith('zh');
    if (isZh) {
      updateStatus('先验重置为平坦无偏 Beta(1, 1)。点击「自动演练」或「单步」观察信念分布如何自适应收窄。');
    } else {
      updateStatus('Priors reset to flat Beta(1, 1). Click "Auto Play" or "Step" to draw candidate worlds and watch beliefs concentrate.');
    }
  };

  window.addEventListener('DOMContentLoaded', () => {
    window.resetTsLens();
    requestAnimationFrame(renderLoop);
  });
})();

