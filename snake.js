(function () {
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');

  const CELL = 24;
  const COLS = canvas.width / CELL;
  const ROWS = canvas.height / CELL;

  const scoreEl = document.getElementById('score');
  const highScoreEl = document.getElementById('highScore');
  const timeEl = document.getElementById('time');
  const overlay = document.getElementById('overlay');
  const finalScoreText = document.getElementById('finalScoreText');
  const restartBtn = document.getElementById('restartBtn');

  const startOverlay = document.getElementById('startOverlay');
  const startHighScoreEl = document.getElementById('startHighScore');
  const playBtn = document.getElementById('playBtn');

  const dpad = document.getElementById('dpad');
  const pauseBtn = document.getElementById('pauseBtn');

  const HIGH_SCORE_KEY = 'snakeHighScore';

  let snake, dir, nextDir, food, score, highScore, elapsed;
  let running = false;
  let paused = false;
  let loopId = null;
  let timerId = null;

  const SPEED_MS = 110;

  // Load saved high score (defaults to 0 if nothing stored yet)
  highScore = Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
  highScoreEl.textContent = highScore;
  startHighScoreEl.textContent = highScore;

  function saveHighScore() {
    localStorage.setItem(HIGH_SCORE_KEY, String(highScore));
  }

  function resetState() {
    snake = [
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 }
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    elapsed = 0;
    placeFood();
    updateHud();
  }

  function pause() {
    if (!running) return; // no effect before a game has started
    paused = !paused;
    pauseBtn.textContent = paused ? 'Resume' : 'Pause';
    updateHud();
  }

  pauseBtn.addEventListener('click', pause);

  function placeFood() {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS)
      };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    food = pos;
  }

  function updateHud() {
    scoreEl.textContent = score;
    highScoreEl.textContent = highScore;

    if (paused) {
      timeEl.textContent = 'Paused';
      return;
    }

    const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const secs = Math.floor(elapsed % 60).toString().padStart(2, '0');
    timeEl.textContent = `${mins}-${secs}`;
  }

  function drawCell(x, y, color, inset = 2) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL + inset, y * CELL + inset, CELL - inset * 2, CELL - inset * 2);
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(canvas.width, y * CELL);
      ctx.stroke();
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111114';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid();

    drawCell(food.x, food.y, '#f28b8b');

    snake.forEach((seg, i) => {
      drawCell(seg.x, seg.y, i === 0 ? '#ffffff' : '#d9d9d9');
    });
  }

  function step() {
    if (paused) return;

    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // wrap around edges instead of dying
    if (head.x < 0) head.x = COLS - 1;
    else if (head.x >= COLS) head.x = 0;
    if (head.y < 0) head.y = ROWS - 1;
    else if (head.y >= ROWS) head.y = 0;

    // self collision
    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      return gameOver();
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      if (score > highScore) {
        highScore = score;
        saveHighScore();
      }
      placeFood();
    } else {
      snake.pop();
    }

    updateHud();
    render();
  }

  function gameOver() {
    running = false;
    paused = false;
    pauseBtn.textContent = 'Pause';
    clearInterval(loopId);
    clearInterval(timerId);
    finalScoreText.textContent = `Score: ${score}  ·  High Score: ${highScore}`;
    overlay.classList.add('show');
  }

  function startGame() {
    startOverlay.classList.remove('show');
    overlay.classList.remove('show');

    clearInterval(loopId);
    clearInterval(timerId);

    resetState();
    render();

    running = true;
    paused = false;
    pauseBtn.textContent = 'Pause';

    loopId = setInterval(step, SPEED_MS);
    timerId = setInterval(() => {
      if (!paused) {
        elapsed++;
        updateHud();
      }
    }, 1000);
  }

  function setDirection(x, y) {
    // prevent reversing directly into itself
    if (snake.length > 1 && dir.x === -x && dir.y === -y) return;
    nextDir = { x, y };
  }

  // ---- Keyboard controls ----
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W': setDirection(0, -1); break;
      case 'ArrowDown': case 's': case 'S': setDirection(0, 1); break;
      case 'ArrowLeft': case 'a': case 'A': setDirection(-1, 0); break;
      case 'ArrowRight': case 'd': case 'D': setDirection(1, 0); break;
      case ' ':
        e.preventDefault();
        pause();
        break;
    }
  });

  // ---- On-screen D-pad controls (mobile) ----
  dpad.addEventListener('click', (e) => {
    const btn = e.target.closest('.dpad-btn');
    if (!btn) return;
    switch (btn.dataset.dir) {
      case 'up': setDirection(0, -1); break;
      case 'down': setDirection(0, 1); break;
      case 'left': setDirection(-1, 0); break;
      case 'right': setDirection(1, 0); break;
    }
  });

  // ---- Swipe controls on the board itself (mobile) ----
  let touchStartX = 0;
  let touchStartY = 0;
  const SWIPE_THRESHOLD = 24; // px

  canvas.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }, { passive: true });

  canvas.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;

    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      setDirection(dx > 0 ? 1 : -1, 0);
    } else {
      setDirection(0, dy > 0 ? 1 : -1);
    }
  }, { passive: true });

  // Stop the page from scrolling/bouncing while swiping on the board
  canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

  playBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);

  // Game does NOT auto-start — waits on the start screen until Play is tapped.
})();