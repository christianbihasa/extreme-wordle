export default function App() {
  const [wordLength, setWordLength] = useState(5);
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

  return (
    // h-[100dvh] locks screen height perfectly; overflow-hidden kills scrolling entirely
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-neutral-900 text-neutral-100 font-sans select-none">
      {/* Tightened Header for mobile space saving */}
      <header className="border-b border-neutral-800 py-2 text-center px-4 shrink-0">
        <h1 className="text-2xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500 uppercase">
          Extreme Wordle
        </h1>
      </header>

      {/* Main Container scales contents automatically */}
      <main className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full px-2 pb-2 min-h-0">
        <div className="shrink-0">
          <Selector currentLength={wordLength} setLength={setWordLength} />
        </div>

        {/* This wrapper ensures the Grid shrinks to fit short mobile screens */}
        <div className="flex-1 flex items-center justify-center min-h-0 py-2">
          <Grid
            wordLength={wordLength}
            guesses={guesses}
            currentGuess={currentGuess}
            secretWord={secretWord}
            invalidGuessRow={invalidGuessRow}
          />
        </div>

        {/* Dynamic Status Display Banner */}
        {gameStatus !== "IN_PLAY" && (
          <div className="my-2 p-3 text-center bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl w-full max-w-xs mx-auto animate-pop shrink-0">
            {gameStatus === "WON" ? (
              <h2 className="text-lg font-bold text-[#6aaa64]">
                🎉 Absolute Genius!
              </h2>
            ) : (
              <h2 className="text-lg font-bold text-red-500">💀 Defeated!</h2>
            )}
            <p className="text-xs text-neutral-300 mt-0.5">
              Secret answer:{" "}
              <span className="font-mono font-bold text-white uppercase tracking-wider">
                {secretWord}
              </span>
            </p>
            <button
              onClick={resetGame}
              className="mt-2 px-3 py-1 bg-neutral-700 text-white rounded text-xs font-bold tracking-wider hover:bg-neutral-600 uppercase cursor-pointer"
            >
              Play Another
            </button>
          </div>
        )}

        <div className="shrink-0">
          <Keyboard statuses={statuses} onKeyClick={handleInput} />
        </div>
      </main>
    </div>
  );
}
