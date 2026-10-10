// 60FPS Cliff Walking Dual Agent Sandbox: SARSA (On-Policy) vs Q-Learning (Off-Policy)
(function() {
  const canvas = document.getElementById('cliff-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const ROWS = 4;
  const COLS = 12;
  const NUM_STATES = ROWS * COLS;

  // Grid coordinates
  // Start: bottom-left [3, 0]
  // Goal: bottom-right [3, 11]
  // Cliff: bottom row [3, 1] through [3, 10]
  const START_R = 3;
  const START_C = 0;
  const GOAL_R = 3;
  const GOAL_C = 11;

  let alpha = 0.5;
  let gamma = 1.0;
  let epsilon = 0.1;

  // Two independent agents
  let qSarsa = Array.from({ length: NUM_STATES }, () => new Float32Array(4));
  let qQLearn = Array.from({ length: NUM_STATES }, () => new Float32Array(4));

  // Current visual positions for both agents
  let posSarsa = { r: START_R, c: START_C, dispR: START_R, dispC: START_C, falls: 0, steps: 0, path: [] };
  let posQLearn = { r: START_R, c: START_C, dispR: START_R, dispC: START_C, falls: 0, steps: 0, path: [] };

  // Pending next action for SARSA
  let nextActionSarsa = null;

  let isAutoPlaying = false;
  let episodeCount = 0;
  let lastStepTime = 0;
  const STEP_INTERVAL = 110; // ms per micro-step

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

  // Actions: 0: Up, 1: Right, 2: Down, 3: Left
  const dR = [-1, 0, 1, 0];
  const dC = [0, 1, 0, -1];

  function toState(r, c) {
    return r * COLS + c;
  }

  function isCliff(r, c) {
    return r === 3 && c >= 1 && c <= 10;
  }

  function isGoal(r, c) {
    return r === GOAL_R && c === GOAL_C;
  }

  function selectAction(Q, s, eps) {
    if (Math.random() < eps) {
      return Math.floor(Math.random() * 4);
    }
    const vals = Q[s];
    let maxV = -Infinity;
    let best = [];
    for (let a = 0; a < 4; a++) {
      if (vals[a] > maxV) {
        maxV = vals[a];
        best = [a];
      } else if (vals[a] === maxV) {
        best.push(a);
      }
    }
    return best[Math.floor(Math.random() * best.length)];
  }

  function stepEnv(r, c, a) {
    let nr = Math.max(0, Math.min(ROWS - 1, r + dR[a]));
    let nc = Math.max(0, Math.min(COLS - 1, c + dC[a]));
    if (isCliff(nr, nc)) {
      return { nextR: START_R, nextC: START_C, reward: -100, fell: true };
    }
    if (isGoal(nr, nc)) {
      return { nextR: nr, nextC: nc, reward: 0, fell: false };
    }
    return { nextR: nr, nextC: nc, reward: -1, fell: false };
  }

  // Advance one step for both agents
  function stepSimulation() {
    // 1. SARSA step
    const sSarsa = toState(posSarsa.r, posSarsa.c);
    const aSarsa = (nextActionSarsa !== null) ? nextActionSarsa : selectAction(qSarsa, sSarsa, epsilon);
    const resSarsa = stepEnv(posSarsa.r, posSarsa.c, aSarsa);
    const nextSSarsa = toState(resSarsa.nextR, resSarsa.nextC);
    const nextASarsa = selectAction(qSarsa, nextSSarsa, epsilon);

    // SARSA update
    const targetSarsa = resSarsa.reward + gamma * qSarsa[nextSSarsa][nextASarsa];
    qSarsa[sSarsa][aSarsa] += alpha * (targetSarsa - qSarsa[sSarsa][aSarsa]);

    posSarsa.path.push({ r: posSarsa.r, c: posSarsa.c });
    if (posSarsa.path.length > 25) posSarsa.path.shift();

    posSarsa.r = resSarsa.nextR;
    posSarsa.c = resSarsa.nextC;
    posSarsa.steps++;
    if (resSarsa.fell) posSarsa.falls++;
    nextActionSarsa = nextASarsa;

    if (isGoal(posSarsa.r, posSarsa.c)) {
      posSarsa.r = START_R;
      posSarsa.c = START_C;
      nextActionSarsa = null;
    }

    // 2. Q-Learning step
    const sQLearn = toState(posQLearn.r, posQLearn.c);
    const aQLearn = selectAction(qQLearn, sQLearn, epsilon);
    const resQLearn = stepEnv(posQLearn.r, posQLearn.c, aQLearn);
    const nextSQLearn = toState(resQLearn.nextR, resQLearn.nextC);

    // Q-Learning update: max_a Q(s', a)
    let maxNextQ = -Infinity;
    for (let a = 0; a < 4; a++) {
      if (qQLearn[nextSQLearn][a] > maxNextQ) maxNextQ = qQLearn[nextSQLearn][a];
    }
    const targetQLearn = resQLearn.reward + gamma * maxNextQ;
    qQLearn[sQLearn][aQLearn] += alpha * (targetQLearn - qQLearn[sQLearn][aQLearn]);

    posQLearn.path.push({ r: posQLearn.r, c: posQLearn.c });
    if (posQLearn.path.length > 25) posQLearn.path.shift();

    posQLearn.r = resQLearn.nextR;
    posQLearn.c = resQLearn.nextC;
    posQLearn.steps++;
    if (resQLearn.fell) posQLearn.falls++;

    if (isGoal(posQLearn.r, posQLearn.c)) {
      posQLearn.r = START_R;
      posQLearn.c = START_C;
      episodeCount++;
    }

    updateUI();
  }

  function updateUI() {
    const sarsaFallsEl = document.getElementById('cliff-sarsa-falls');
    if (sarsaFallsEl) sarsaFallsEl.textContent = posSarsa.falls;
    const qFallsEl = document.getElementById('cliff-q-falls');
    if (qFallsEl) qFallsEl.textContent = posQLearn.falls;

    const statusEl = document.getElementById('cliff-status-text');
    if (!statusEl) return;
    const isZh = document.documentElement.lang.startsWith('zh');

    if (isZh) {
      statusEl.innerHTML = `实时对照：<strong>SARSA</strong> 坠崖次数 <span style="color:#237440;font-weight:600">${posSarsa.falls}</span>（选择安全高位绕远）；<strong>Q-Learning</strong> 坠崖次数 <span style="color:#b04632;font-weight:600">${posQLearn.falls}</span>（紧贴悬崖走最优最短路径，探索随机步导致频繁坠崖）。`;
    } else {
      statusEl.innerHTML = `Live comparison: <strong>SARSA</strong> falls: <span style="color:#237440;font-weight:600">${posSarsa.falls}</span> (learns conservative detour); <strong>Q-Learning</strong> falls: <span style="color:#b04632;font-weight:600">${posQLearn.falls}</span> (learns optimal cliff edge, drops frequently on exploration).`;
    }
  }

  // 60FPS fluid rendering with animated positions
  function renderLoop(timestamp) {
    resize();
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    // Smooth position lerp
    const lerpSpeed = 0.28;
    posSarsa.dispR += (posSarsa.r - posSarsa.dispR) * lerpSpeed;
    posSarsa.dispC += (posSarsa.c - posSarsa.dispC) * lerpSpeed;
    posQLearn.dispR += (posQLearn.r - posQLearn.dispR) * lerpSpeed;
    posQLearn.dispC += (posQLearn.c - posQLearn.dispC) * lerpSpeed;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.clearRect(0, 0, w, h);

    const cellW = w / COLS;
    const cellH = h / ROWS;

    // 1. Draw Grid Cells
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = c * cellW;
        const y = r * cellH;

        if (isCliff(r, c)) {
          // Cliff area (reddish hatched)
          ctx.fillStyle = isDark ? 'rgba(180, 60, 45, 0.25)' : 'rgba(180, 60, 45, 0.16)';
          ctx.fillRect(x, y, cellW, cellH);
          ctx.strokeStyle = isDark ? '#4a2520' : '#e0b8b0';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y + cellH);
          ctx.lineTo(x + cellW, y);
          ctx.stroke();
        } else if (r === START_R && c === START_C) {
          ctx.fillStyle = isDark ? '#23221e' : '#edebe2';
          ctx.fillRect(x, y, cellW, cellH);
        } else if (isGoal(r, c)) {
          ctx.fillStyle = isDark ? 'rgba(46, 125, 75, 0.35)' : 'rgba(46, 125, 75, 0.22)';
          ctx.fillRect(x, y, cellW, cellH);
        }

        // Cell border
        ctx.strokeStyle = isDark ? '#2b2a26' : '#dedcd3';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellW, cellH);

        // Labels
        if (r === START_R && c === START_C) {
          ctx.fillStyle = isDark ? '#96948c' : '#64645e';
          ctx.font = 'bold 11px "Anthropic Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('START', x + cellW / 2, y + cellH / 2 + 4);
        } else if (isGoal(r, c)) {
          ctx.fillStyle = '#237440';
          ctx.font = 'bold 11px "Anthropic Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('GOAL', x + cellW / 2, y + cellH / 2 + 4);
        } else if (isCliff(r, c) && c === 5) {
          ctx.fillStyle = '#b04632';
          ctx.font = 'bold 11.5px "Anthropic Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('CLIFF (-100)', x + cellW, y + cellH / 2 + 4);
        }
      }
    }

    // 2. Draw Trails
    // SARSA trail (Green)
    if (posSarsa.path.length > 1) {
      ctx.strokeStyle = 'rgba(35, 116, 64, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < posSarsa.path.length; i++) {
        const p = posSarsa.path[i];
        const px = p.c * cellW + cellW * 0.35;
        const py = p.r * cellH + cellH * 0.5;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Q-Learning trail (Red/Orange)
    if (posQLearn.path.length > 1) {
      ctx.strokeStyle = 'rgba(176, 70, 50, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < posQLearn.path.length; i++) {
        const p = posQLearn.path[i];
        const px = p.c * cellW + cellW * 0.65;
        const py = p.r * cellH + cellH * 0.5;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // 3. Draw Agent Disks
    // SARSA Agent (Green)
    const sarsaX = posSarsa.dispC * cellW + cellW * 0.35;
    const sarsaY = posSarsa.dispR * cellH + cellH * 0.5;
    ctx.beginPath();
    ctx.arc(sarsaX, sarsaY, 7, 0, 2 * Math.PI);
    ctx.fillStyle = '#237440';
    ctx.fill();
    ctx.strokeStyle = isDark ? '#141413' : '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Q-Learning Agent (Red)
    const qX = posQLearn.dispC * cellW + cellW * 0.65;
    const qY = posQLearn.dispR * cellH + cellH * 0.5;
    ctx.beginPath();
    ctx.arc(qX, qY, 7, 0, 2 * Math.PI);
    ctx.fillStyle = '#b04632';
    ctx.fill();
    ctx.strokeStyle = isDark ? '#141413' : '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Auto-stepping
    if (isAutoPlaying) {
      if (!lastStepTime) lastStepTime = timestamp;
      if (timestamp - lastStepTime > STEP_INTERVAL) {
        lastStepTime = timestamp;
        stepSimulation();
      }
    }

    requestAnimationFrame(renderLoop);
  }

  window.stepCliff = function() {
    if (isAutoPlaying) window.toggleAutoCliff();
    stepSimulation();
  };

  window.toggleAutoCliff = function() {
    const btn = document.getElementById('cliff-auto-btn');
    const isZh = document.documentElement.lang.startsWith('zh');
    isAutoPlaying = !isAutoPlaying;
    lastStepTime = 0;
    if (btn) {
      btn.textContent = isAutoPlaying ? (isZh ? '暂停' : 'Pause') : (isZh ? '自动演练' : 'Auto Play');
    }
  };

  window.resetCliff = function() {
    if (isAutoPlaying) window.toggleAutoCliff();
    qSarsa = Array.from({ length: NUM_STATES }, () => new Float32Array(4));
    qQLearn = Array.from({ length: NUM_STATES }, () => new Float32Array(4));
    posSarsa = { r: START_R, c: START_C, dispR: START_R, dispC: START_C, falls: 0, steps: 0, path: [] };
    posQLearn = { r: START_R, c: START_C, dispR: START_R, dispC: START_C, falls: 0, steps: 0, path: [] };
    nextActionSarsa = null;
    episodeCount = 0;
    updateUI();
  };

  window.addEventListener('DOMContentLoaded', () => {
    window.resetCliff();
    requestAnimationFrame(renderLoop);
  });
})();
