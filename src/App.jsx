import React, { useState } from "react";
import { useWordle } from "./hooks/useWordle";
import Selector from "./components/Selector";
import Grid from "./components/Grid";
import Keyboard from "./components/Keyboard";

export default function App() {
  const [wordLength, setWordLength] = useState(5);
  // 1. Destructure resetGame right alongside your other variables:
  const {
    guesses,
    currentGuess,
    gameStatus,
    statuses,
    invalidGuessRow,
    handleInput,
    secretWord,
    resetGame,
  } = useWordle(wordLength);

  // 2. Update your "Play Another" action trigger inside the game status banner:
  <button
    onClick={resetGame} // Just switch window.location.reload() to this!
    className="mt-3 px-4 py-1.5 bg-neutral-700 text-white rounded text-xs font-bold tracking-wider hover:bg-neutral-600 uppercase transition-all cursor-pointer"
  >
    Play Another
  </button>;

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 text-neutral-100 font-sans">
      <header className="border-b border-neutral-800 py-4 text-center px-4">
        <h1 className="text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500 uppercase">
          Extreme Wordle
        </h1>
        <p className="text-xs text-neutral-400 mt-1 font-medium tracking-wide">
          Obscure Word Pool Selection Variant • 3 to 8 Characters
        </p>
      </header>

      <main className="flex-grow flex flex-col justify-between max-w-2xl mx-auto w-full px-2">
        <Selector currentLength={wordLength} setLength={setWordLength} />

        <Grid
          wordLength={wordLength}
          guesses={guesses}
          currentGuess={currentGuess}
          secretWord={secretWord}
          invalidGuessRow={invalidGuessRow}
        />

        {gameStatus !== "IN_PLAY" && (
          <div className="my-4 p-4 text-center bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl max-w-sm mx-auto w-full animate-pop">
            {gameStatus === "WON" ? (
              <h2 className="text-xl font-bold text-[#6aaa64] mb-1">
                🎉 Absolute Genius!
              </h2>
            ) : (
              <h2 className="text-xl font-bold text-red-500 mb-1">
                💀 Defedated!
              </h2>
            )}
            <p className="text-sm text-neutral-300">
              The secret answer was:{" "}
              <span className="font-mono tracking-widest uppercase font-bold text-white block text-lg mt-1">
                {secretWord}
              </span>
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-1.5 bg-neutral-700 text-white rounded text-xs font-bold tracking-wider hover:bg-neutral-600 uppercase transition-all cursor-pointer"
            >
              Play Another
            </button>
          </div>
        )}

        <Keyboard statuses={statuses} onKeyClick={handleInput} />
      </main>
    </div>
  );
}
