import React, { useState } from "react";
import { useWordle } from "./hooks/useWordle";
import Selector from "./components/Selector";
import Grid from "./components/Grid";
import Keyboard from "./components/Keyboard";

export default function App() {
  const [wordLength, setWordLength] = useState(5);
  const {
    guesses,
    currentGuess,
    gameStatus,
    statuses,
    invalidGuessRow,
    secretWord,
    resetGame,
    handleInput,
    isLoading, //
  } = useWordle(wordLength);

  // Prevents rendering the grid layout until the state properties fully mirror the active target dimensions.
  if (isLoading || !secretWord || secretWord.length !== wordLength) {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] bg-neutral-900 text-neutral-400 font-sans">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold uppercase tracking-widest animate-pulse">
          Syncing Dictionary Category...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-neutral-900 text-neutral-100 font-sans select-none">
      {/* Header: Fixed height, never grows or shrinks */}
      <header className="border-b border-neutral-800 py-2 text-center shrink-0">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500 uppercase">
          Extreme Wordle
        </h1>
      </header>

      {/* Main Container: Crucial min-h-0 to let children contract */}
      <main className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full px-3 pb-3 min-h-0">
        {/* Selector Panel */}
        <div className="shrink-0 py-2">
          <Selector currentLength={wordLength} setLength={setWordLength} />
        </div>

        {/* Grid Wrapper: min-h-0 allows the wrapper to shrink on short screens */}
        <div className="flex-1 flex items-center justify-center min-h-0 w-full py-1">
          <Grid
            wordLength={wordLength}
            guesses={guesses}
            currentGuess={currentGuess}
            secretWord={secretWord}
            invalidGuessRow={invalidGuessRow}
          />
        </div>

        {/* Dynamic Game-Over Dialog */}
        {gameStatus !== "IN_PLAY" && (
          <div className="shrink-0 my-2 p-3 text-center bg-neutral-800 border border-neutral-700 rounded-xl shadow-2xl max-w-xs mx-auto w-full">
            <h2
              className={`text-base font-bold ${gameStatus === "WON" ? "text-green-500" : "text-red-500"}`}
            >
              {gameStatus === "WON" ? "🎉 Absolute Genius!" : "💀 Defeated!"}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Word:{" "}
              <span className="font-mono font-bold text-white tracking-wider uppercase">
                {secretWord}
              </span>
            </p>
            <button
              onClick={resetGame}
              className="mt-2 px-4 py-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded text-xs font-bold uppercase transition-all cursor-pointer"
            >
              Play Another
            </button>
          </div>
        )}

        {/* Keyboard Panel */}
        <div className="shrink-0 pt-2">
          <Keyboard statuses={statuses} onKeyClick={handleInput} />
        </div>
      </main>
    </div>
  );
}
