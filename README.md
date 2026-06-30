# Extreme Wordle

A high-performance, responsive, and ultra-flexible Wordle clone engineered with **React 19**, **Vite**, and the utility-first container architectures of **Tailwind CSS v4**. Unlike the standard single-tier constraint application, **Extreme Wordle** allows users to dynamically scale difficulties by morphing matrix configurations on the fly, backed by rigid state isolation boundaries and asynchronous network safety guards.

**Live Production Build:** [christianbihasa.github.io/extreme-wordle](https://christianbihasa.github.io/extreme-wordle)

---

## Key Engineering Features

### 1. Dynamic Matrix Scaling (3L - 8L)
Instantly switches structural viewport parameters between 3-letter and 8-letter grids. The DOM elements grid system calculates constraints fluidly on the fly to perfectly re-render layouts without layout shifting.

### 2. Isolated Storage & Session Memory State
Game loops are strictly partitioned by word-length keys. Shifting between categories maintains active loops without data corruption; guess histories, virtual keyboard character states, and secret words are saved independently inside the browser's `LocalStorage` layer for every individual tier.

### 3. Asynchronous Safety Guard
Implemented explicit lifecycle locking thresholds to handle dictionary processing. Built-in network loading wrappers prevent layout flashing, flickering UI states, or the cross-pollination of storage arrays while asynchronous fetch promises resolve.

### 4. Fluid Mobile Real-Estate Optimization
Crafted utilizing strict CSS-first hardware-accelerated constraints (`min-h-0`, `shrink-0`, and dynamic viewport units `h-[100dvh]`). This prevents layout fracturing or browser navigation bars overflowing actionable touch spaces on short mobile screen margins.

### 5. Automated CI/CD Ecosystem
* **Production Ship-Loop:** Triggers automatically on git branch push cycles, initializing a clean dependency chain installation, executing production builds, and pushing compressed distribution bundles directly to the GitHub Pages CDN.
* **Automated Viewport Capture:** Post-deployment triggers spawn a headless browser session utilizing **Playwright** to capture live pixel-perfect snapshots of active game matrices. These are committed automatically back to the repository asset tree to feed downstream portfolio marquee visual components.

---

## System Architecture & Tech Stack

| Technology / Layer | Engineering Purpose |
| :--- | :--- |
| **React 19** | Declarative functional hook management, modular rendering, and reactive state hooks |
| **Vite** | Lightning-fast Hot Module Replacement (HMR) and optimized Rollup code-splitting |
| **Tailwind CSS v4** | CSS-first styling architecture utilizing native `@theme` design tokens and fluid grids |
| **Playwright** | Asynchronous headless browser runner mapping responsive viewport snapshots |
| **GitHub Actions** | Native cloud workflow orchestration decoupled for delivery and automated tracking |
| **LocalStorage API** | Synchronous key-value client storage retaining isolated game matrix state arrays |

---

## Directory Blueprint

```text
├── .github/
│   └── workflows/
│       ├── capture-preview.yml # Headless Playwright automated screenshot runner
│       └── deploy.yml          # Production cloud asset compilation pipeline
├── public/
│   └── data/                   # Isolated dictionary JSON lists (words-3.json to words-8.json)
├── src/
│   ├── assets/                 # Vector shapes and structural media targets
│   ├── components/             # Isolated presentation and modular layout segments
│   │   ├── Grid.jsx            # Dynamic Flexbox/Grid tile row matrix generator
│   │   ├── Keyboard.jsx        # Virtual character controller with active state shading
│   │   └── Selector.jsx        # Matrix range difficulty category control grid
│   ├── hooks/
│   │   └── useWordle.js        # Central state loop engine: scoring, dictionary validation, and IO boundaries
│   ├── App.jsx                 # Core shell layout and cross-functional view wrappers
│   ├── index.css               # Global baseline overrides, reset properties, and Tailwind v4 configurations
│   └── main.jsx                # DOM tree root entry mount point
├── package.json                # Dependency metrics and runtime automation routing configurations
└── vite.config.js              # Base asset deployment paths and build bundling optimizations

```

---

## Core Engineering Details

### Storage Verification Boundary Guard

To completely eliminate asynchronous race conditions where switching tabs or changing sizes prematurely writes stale metrics to the wrong difficulty segment, the engine validates state parameters before committing mutations to disk:

```javascript
// Excerpt from useWordle.js
useEffect(() => {
  // Prevent mutations if assets are missing or if current string lengths mismatch selected boundaries
  if (isLoading || !secretWord || secretWord.length !== wordLength) return;

  localStorage.setItem(`extreme_guesses_${wordLength}`, JSON.stringify(guesses));
  localStorage.setItem(`extreme_secret_${wordLength}`, secretWord);
}, [guesses, gameStatus, statuses, secretWord, wordLength, isLoading]);

```

---

## Local Development & Setup

### Prerequisites

Ensure you have a modern instance of [Node.js](https://nodejs.org/) installed inside your terminal runtime environment.

### 1. Repository Setup

```bash
git clone [https://github.com/christianbihasa/extreme-wordle.git]
cd extreme-wordle

```

### 2. Dependency Resolution

```bash
npm install

```

### 3. Initialize HMR Development Server

```bash
npm run dev

```

Open the output loop local link (defaults to [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)) inside your browser to inspect or test code revisions.

### 4. Compiling Production Builds Locally

```bash
npm run build

```

Optimized, production-ready assets will compile cleanly inside the local `/dist` directory.

---

## How To Play

1. **Select Difficulty Range:** Pick a letter constraint tier from the top selector matrix header (**3L** up through **8L**).
2. **Submit Attempts:** Type valid dictionary expressions using your physical typing layout or the on-screen inputs, and hit **Enter**.
3. **Analyze Shading Vectors:** Grid cells transform following validation passes to signify layout precision constraints:
* 🟩 **Green:** Character exists inside the string array and sits in the precise index coordinate.
* 🟨 **Yellow:** Character exists inside the string array but resides at an alternate index coordinate.
* ⬛ **Gray:** Character is entirely absent from the active matching target pool.


4. **Win Conditions:** Decipher the hidden word boundary parameters within **6 total attempts**. Click **Play Another** to safely scrub that specific categorization slot's runtime cache and draw a clean puzzle word.
