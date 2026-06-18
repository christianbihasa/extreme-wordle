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

```

---

## Core Engineering Details

### Storage & Boundary Validation Guard

To prevent a classic asynchronous race condition where switching tabs might write stale properties to the wrong difficulty slot, the engine implements strict state tracking checks before committing properties to disk:

```javascript
// Excerpt from useWordle.js
useEffect(() => {
  if (isLoading || !secretWord || secretWord.length !== wordLength) return;

  localStorage.setItem(`extreme_guesses_${wordLength}`, JSON.stringify(guesses));
  localStorage.setItem(`extreme_secret_${wordLength}`, secretWord);
}, [guesses, gameStatus, statuses, secretWord, wordLength, isLoading]);

```

---

## Installation & Setup

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the Repository

```bash
git clone [https://github.com/YOUR_USERNAME/extreme-wordle.git]
cd extreme-wordle

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Run the Development Server

```bash
npm run dev

```

Open [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173) in your browser to inspect the application.

### 4. Build for Production

```bash
npm run build

```

The optimized output assets will be generated inside the `/dist` directory, ready to deploy to GitHub Pages, Vercel, or Netlify.

---

## How To Play

1. Choose a word tier from the top selector panel (**3L** through **8L**).
2. Type your guess using your physical keyboard or the on-screen display and press **Enter**.
3. The color of the tiles will change to indicate how close your guess was to the secret word:
* 🟩 **Green:** Letter is in the word and in the correct spot.
* 🟨 **Yellow:** Letter is in the word but in a different spot.
* ⬛ **Gray:** Letter is not in the word at all.


4. Complete the word within **6 tries** to win! You can hit **Play Another** to clear that specific range category's memory and draw a new word.
