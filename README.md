# 🐍 Snake Game

A classic Snake game built with vanilla **HTML, CSS, and JavaScript** — no frameworks, no dependencies. Playable on desktop and mobile.

**🎮 Live Demo:** [https://snake-game-iota-smoky.vercel.app/](https://snake-game-iota-smoky.vercel.app/)

---

## Features

- 🕹️ Classic Snake gameplay on a grid-based board
- 🏆 High score saved with `localStorage` — persists across refreshes and browser sessions
- ⏱️ Live game timer (mm-ss format)
- ⏸️ Pause / Resume, via on-screen button or the spacebar
- 🔁 Edge wrap-around — the snake reappears on the opposite side instead of dying when it hits a wall
- 📱 Fully responsive — canvas scales to fit any screen size
- 👉 Mobile-friendly controls:
  - Swipe gestures directly on the game board
  - On-screen D-pad (shown automatically on touch devices)
- ⌨️ Desktop controls: Arrow keys or WASD
- 🖼️ Clean dark UI with bordered score/timer HUD

---

## Controls

| Action     | Desktop            | Mobile                  |
|------------|---------------------|--------------------------|
| Move       | Arrow keys / WASD   | Swipe on board / D-pad  |
| Pause      | Spacebar            | Tap Pause button        |
| Start / Restart | Click Play / Play Again | Tap Play / Play Again |

---

## Project Structure

```
snake-game/
├── index.html      # Game markup (rename of snake.html for Vercel root routing)
├── snake.css       # Styling — layout, HUD, board, D-pad, responsive rules
├── snake.js        # Game logic — movement, collisions, scoring, storage, controls
└── vercel.json     # (optional) rewrite config if keeping the file named snake.html
```

---

## How It Works

- The game runs on an HTML `<canvas>` grid (`720×480`, 24px cells).
- Game state (snake position, direction, food, score, timer) is tracked in JavaScript and redrawn every tick via `setInterval`.
- The high score is stored in the browser's `localStorage` under the key `snakeHighScore`, so it survives page reloads and returning later.
- Touch input is handled two ways: swipe detection on the canvas (`touchstart`/`touchend`) and a fixed on-screen D-pad, shown only on touch/coarse-pointer devices via a CSS media query.

---

## Running Locally

1. Clone or download this repository.
2. Open `index.html` directly in a browser, **or** serve it with a local server for full `localStorage` support:
   ```bash
   npx serve .
   ```
3. Open the printed local URL in your browser and click **Play**.

---

## Deployment

This project is deployed on [Vercel](https://vercel.com) as a static site.

To deploy your own copy:
1. Push this folder to a GitHub repository.
2. Import the repo into Vercel.
3. Make sure the entry file is named `index.html` (Vercel serves this at the root `/` by default). If you'd rather keep it named `snake.html`, include the provided `vercel.json` rewrite instead.
4. Deploy — no build step required, this is a static HTML/CSS/JS project.

---

## Tech Stack

- HTML5 (`<canvas>` for rendering)
- CSS3 (Flexbox, Grid, media queries, `aspect-ratio`)
- Vanilla JavaScript (no libraries or frameworks)
- Browser `localStorage` for persistence

---

## License

Free to use and modify for personal or educational purposes.
