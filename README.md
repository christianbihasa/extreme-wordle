# Extreme Wordle

A high-performance, responsive, and ultra-flexible Wordle clone built with **React**, **Vite**, and **Tailwind CSS**. Unlike the standard game, **Extreme Wordle** allows players to dynamically scale the difficulty by switching word lengths on the fly, featuring bulletproof state isolation and asynchronous network safety guards.

---

## Features

* **Dynamic Word Lengths (3L - 8L):** Instantly switch between 3 to 8-letter grids. The layout morphs on the fly to perfectly accommodate your chosen challenge level.
* **Smart Session Persistence:** Game states are fully isolated by word length. Switching categories won't wipe your progress; your guesses, key colors, and secret words are saved independently in `LocalStorage` for every single tier.
* **Asynchronous Safety Guard:** Built-in network loading state prevents UI crashing, layout blinking, or cross-pollination of storage keys during live dictionary fetching.
* **Flawless Mobile Optimization:** Crafted using structural constraints (`min-h-0`, `shrink-0`, and `h-[100dvh]`) ensuring the grid and keyboard scale fluidly on short mobile devices without layout overflow.
* **Dual Input Support:** Play seamlessly using your physical keyboard or the responsive on-screen keyboard.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React (v18+)** | Component-driven UI rendering and state management |
| **Vite** | Lightning-fast development server and optimized production builds |
| **Tailwind CSS** | Utility-first, fully responsive mobile styling |
| **LocalStorage API** | Seamless cross-session persistent game loops |

---

## Project Structure

```text
src/
├── assets/
├── components/
│   ├── Grid.jsx         # Flexbox/Grid responsive tile row system
│   ├── Keyboard.jsx     # Virtual keyboard with dynamic key state shading
│   └── Selector.jsx     # Tier/Range category toggle control panel
├── hooks/
│   └── useWordle.js     # Core engine: fetching, validation, validation guards, and hooks
├── App.jsx              # Application root, mounting safety guards, and UI wrapper
└── main.jsx             # Entry point
public/
└── data/                # Independent dictionary JSON files (words-3.json to words-8.json)
