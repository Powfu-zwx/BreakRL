// 60FPS Fluid GridWorld Bellman Ripple Simulator
(function() {
  const canvas = document.getElementById('mdp-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const ROWS = 4;
  const COLS = 5;
  const NUM_STATES = ROWS * COLS;

  // Special states: Goal (+1.0) at [0, 4], Trap (-1.0) at [1, 2]
  const GOAL = 0 * COLS + 4;
  const TRAP = 1 * COLS + 2;
  const OBSTACLE = 2 * COLS + 2; // wall at [2, 2]

  let gamma = 0.90;
  let windNoise = 0.10; // slip probability

  // Target and smoothly animated display values
  let V = new Float32Array(NUM_STATES);
  let dispV = new Float32Array(NUM_STATES);
  let policy = new Int8Array(NUM_STATES).fill(-1); // 0: Up, 1: Right, 2: Down, 3: Left

  let iteration = 0;
  let isAutoPlaying = false;
  let lastStepTime = 0;
  const STEP_INTERVAL = 320; // ms per Bellman sweep

  function dpr() {
    return window.devicePixelRatio || 1;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const ratio = dpr();
    if (canvas.width !== Math.round(rect.width * ratio) || canvas.height !== Math.round(rect.height * ratio)) {
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      ctx.scale(ratio, ratio);
    }
  }

  // Transitions: 4 actions: 0: Up, 1: Right, 2: Down, 3: Left
  const dRow = [-1, 0, 1, 0];
  const dCol = [0, 1, 0, -1];

  function getNextState(s, a) {
    if (s === GOAL || s === TRAP || s === OBSTACLE) return s;
    const r = Math.floor(s / COLS);
    const c = s % COLS;
    const nr = r + dRow[a];
    const nc = c + dCol[a];
    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return s; // bounce off border
    const ns = nr * COLS + nc;
    if (ns === OBSTACLE) return s; // bounce off obstacle
    return ns;
  }

  // Bellman Optimality Operator T* V
  function bellmanSweep() {
    iteration++;
    const nextV = new Float32Array(NUM_STATES);

    for (let s = 0; s < NUM_STATES; s++) {
      if (s === GOAL) {
        nextV[s] = 1.0;
        continue;
      }
      if (s === TRAP) {
        nextV[s] = -1.0;
        continue;
      }
      if (s === OBSTACLE) {
        nextV[s] = 0.0;
        continue;
      }

      let maxQ = -Infinity;
      let bestA = 0;

      for (let a = 0; a < 4; a++) {
        // Intended action with prob (1 - windNoise)
        // Slip to perpendicular actions with windNoise / 2 each
        const intended = getNextState(s, a);
        const slip1 = getNextState(s, (a + 1) % 4);
        const slip2 = getNextState(s, (a + 3) % 4);

        const transReward = (ns) => (ns === GOAL ? 1.0 : (ns === TRAP ? -1.0 : -0.02));

        const rInt = transReward(intended);
        const rSlip1 = transReward(slip1);
        const rSlip2 = transReward(slip2);

        const expVal = (1.0 - windNoise) * (rInt + gamma * V[intended]) +
                       (windNoise * 0.5) * (rSlip1 + gamma * V[slip1]) +
                       (windNoise * 0.5) * (rSlip2 + gamma * V[slip2]);

        if (expVal > maxQ) {
          maxQ = expVal;
          bestA = a;
        }
      }

      nextV[s] = maxQ;
      policy[s] = bestA;
    }

    V = nextV;
    updateStatusText();
  }

  function updateStatusText() {
    const iterEl = document.getElementById('mdp-iter-num');
    if (iterEl) iterEl.textContent = `Iteration k = ${iteration}`;
    const statusEl = document.getElementById('mdp-status-text');
    if (!statusEl) return;
    const isZh = document.documentElement.lang.startsWith('zh');

    if (iteration === 0) {
      statusEl.innerHTML = isZh ? 
        '状态价值初始化为零。点击「自动演练」观察贝尔曼最优算子如何将终点价值像涟漪般向外回溯扩散。' : 
        'Values initialized to zero. Click "Auto Play" to watch the Bellman optimality wave ripple outward from the goal.';
    } else {
      const maxDelta = Math.max(...Array.from(V).map((v, i) => Math.abs(v - dispV[i])));
      if (isZh) {
        statusEl.innerHTML = `已完成第 <strong>${iteration}</strong> 轮同步备份。有效时域 $H_{\\text{eff}} \\approx ${(1 / (1 - gamma)).toFixed(1)}$，策略箭头随价值坡度动态成型。`;
      } else {
        statusEl.innerHTML = `Sweep <strong>${iteration}</strong> completed. Effective horizon $H_{\\text{eff}} \\approx ${(1 / (1 - gamma)).toFixed(1)}$. Policy arrows align with the value gradient.`;
      }
    }
  }

  // 60FPS fluid rendering with color interpolation
  function renderLoop(timestamp) {
    resize();
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Smooth lerp values
    const lerpSpeed = 0.18;
    for (let s = 0; s < NUM_STATES; s++) {
      dispV[s] += (V[s] - dispV[s]) * lerpSpeed;
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.clearRect(0, 0, w, h);

    const cellW = w / COLS;
    const cellH = h / ROWS;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const s = r * COLS + c;
        const x = c * cellW;
        const y = r * cellH;

        // Base cell fill
        if (s === OBSTACLE) {
          ctx.fillStyle = isDark ? '#23221f' : '#dedcd5';
          ctx.fillRect(x, y, cellW, cellH);
          // Diagonal hatching for obstacle
          ctx.strokeStyle = isDark ? '#363430' : '#c9c7bf';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x, y + cellH);
          ctx.lineTo(x + cellW, y);
          ctx.stroke();
        } else if (s === GOAL) {
          ctx.fillStyle = isDark ? 'rgba(46, 125, 75, 0.35)' : 'rgba(46, 125, 75, 0.22)';
          ctx.fillRect(x, y, cellW, cellH);
        } else if (s === TRAP) {
          ctx.fillStyle = isDark ? 'rgba(180, 60, 45, 0.35)' : 'rgba(180, 60, 45, 0.22)';
          ctx.fillRect(x, y, cellW, cellH);
        } else {
          // Heatmap based on value v in [-1, 1]
          const val = dispV[s];
          if (val >= 0) {
            const intensity = Math.min(1.0, val / 1.0);
            ctx.fillStyle = isDark ? 
              `rgba(46, 125, 75, ${intensity * 0.32})` : 
              `rgba(46, 125, 75, ${intensity * 0.20})`;
          } else {
            const intensity = Math.min(1.0, -val / 1.0);
            ctx.fillStyle = isDark ? 
              `rgba(180, 60, 45, ${intensity * 0.32})` : 
              `rgba(180, 60, 45, ${intensity * 0.20})`;
          }
          ctx.fillRect(x, y, cellW, cellH);
        }

        // Cell border
        ctx.strokeStyle = isDark ? '#2f2e2a' : '#dedcd3';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellW, cellH);

        // Value text
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '11.5px "Anthropic Sans", sans-serif';

        if (s === GOAL) {
          ctx.fillStyle = '#237440';
          ctx.font = 'bold 12.5px "Anthropic Sans", sans-serif';
          ctx.fillText('GOAL (+1)', x + cellW / 2, y + cellH / 2 - 8);
          ctx.font = '11px "Anthropic Sans", sans-serif';
          ctx.fillText(`V = ${dispV[s].toFixed(2)}`, x + cellW / 2, y + cellH / 2 + 10);
        } else if (s === TRAP) {
          ctx.fillStyle = '#b04632';
          ctx.font = 'bold 12.5px "Anthropic Sans", sans-serif';
          ctx.fillText('TRAP (-1)', x + cellW / 2, y + cellH / 2 - 8);
          ctx.font = '11px "Anthropic Sans", sans-serif';
          ctx.fillText(`V = ${dispV[s].toFixed(2)}`, x + cellW / 2, y + cellH / 2 + 10);
        } else if (s === OBSTACLE) {
          ctx.fillStyle = isDark ? '#6b6962' : '#8c8a82';
          ctx.fillText('WALL', x + cellW / 2, y + cellH / 2);
        } else {
          ctx.fillStyle = isDark ? '#d4d2c9' : '#20201e';
          ctx.fillText(`V = ${dispV[s].toFixed(2)}`, x + cellW / 2, y + cellH / 2 - 10);

          // Policy Arrow
          const act = policy[s];
          if (act >= 0 && Math.abs(dispV[s]) > 0.005) {
            drawArrow(x + cellW / 2, y + cellH / 2 + 10, act, isDark);
          }
        }
      }
    }

    // Auto Play handling
    if (isAutoPlaying) {
      if (!lastStepTime) lastStepTime = timestamp;
      if (timestamp - lastStepTime > STEP_INTERVAL) {
        lastStepTime = timestamp;
        if (iteration >= 16) {
          window.toggleAutoMdp();
        } else {
          bellmanSweep();
        }
      }
    }

    requestAnimationFrame(renderLoop);
  }

  function drawArrow(cx, cy, action, isDark) {
    const len = 10;
    ctx.strokeStyle = isDark ? '#e6e4dc' : '#20201e';
    ctx.lineWidth = 1.8;
    ctx.beginPath();

    let ex = cx + dCol[action] * len;
    let ey = cy + dRow[action] * len;
    ctx.moveTo(cx, cy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    // Arrowhead
    const headLen = 4;
    const angle = Math.atan2(dRow[action], dCol[action]);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - headLen * Math.cos(angle - Math.PI / 6), ey - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(ex - headLen * Math.cos(angle + Math.PI / 6), ey - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }

  window.stepMdp = function() {
    if (isAutoPlaying) window.toggleAutoMdp();
    bellmanSweep();
  };

  window.toggleAutoMdp = function() {
    const btn = document.getElementById('mdp-auto-btn');
    const isZh = document.documentElement.lang.startsWith('zh');
    isAutoPlaying = !isAutoPlaying;
    lastStepTime = 0;
    if (btn) {
      btn.textContent = isAutoPlaying ? (isZh ? '暂停' : 'Pause') : (isZh ? '自动演练' : 'Auto Play');
    }
  };

  window.resetMdp = function() {
    if (isAutoPlaying) window.toggleAutoMdp();
    iteration = 0;
    V.fill(0);
    dispV.fill(0);
    policy.fill(-1);
    V[GOAL] = 1.0;
    dispV[GOAL] = 1.0;
    V[TRAP] = -1.0;
    dispV[TRAP] = -1.0;
    updateStatusText();
  };

  window.setMdpGamma = function(val) {
    gamma = parseFloat(val);
    const label = document.getElementById('mdp-gamma-val');
    if (label) label.textContent = gamma.toFixed(2);
    // Restart sweep with new gamma
    window.resetMdp();
  };

  window.addEventListener('DOMContentLoaded', () => {
    window.resetMdp();
    requestAnimationFrame(renderLoop);
  });
})();
