import React from "react";

export default function Grid({
  wordLength,
  guesses,
  currentGuess,
  secretWord,
  invalidGuessRow,
}) {
  const totalRows = 6;
  const rows = Array.from({ length: totalRows });

  const getRowStatuses = (guess) => {
    const result = new Array(wordLength).fill("absent");
    const letterPool = {};
    for (let char of secretWord) letterPool[char] = (letterPool[char] || 0) + 1;

    for (let i = 0; i < wordLength; i++) {
      if (guess[i] === secretWord[i]) {
        result[i] = "correct";
        letterPool[guess[i]]--;
      }
    }
    for (let i = 0; i < wordLength; i++) {
      if (result[i] === "correct") continue;
      if (letterPool[guess[i]] && letterPool[guess[i]] > 0) {
        result[i] = "present";
        letterPool[guess[i]]--;
      }
    }
    return result;
  };

  return (
    <div className="flex flex-col gap-1.5 justify-center items-center my-4 px-4 w-full max-w-md mx-auto">
      {rows.map((_, rowIndex) => {
        const isSubmitted = rowIndex < guesses.length;
        const isCurrent = rowIndex === guesses.length;
        const rowValue = isSubmitted
          ? guesses[rowIndex]
          : isCurrent
            ? currentGuess
            : "";
        const shouldShake = invalidGuessRow === rowIndex;

        const rowCells = Array.from({ length: wordLength }).map(
          (_, cIndex) => rowValue[cIndex] || "",
        );
        const evaluatedStatuses = isSubmitted
          ? getRowStatuses(guesses[rowIndex])
          : [];

        return (
          <div
            key={rowIndex}
            className={`grid gap-1.5 w-full ${shouldShake ? "animate-shake" : ""}`}
            style={{
              gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))`,
            }}
          >
            {rowCells.map((char, cellIndex) => {
              let tileClass = "bg-transparent border-neutral-700 text-white";

              if (char && !isSubmitted) {
                tileClass =
                  "bg-transparent border-neutral-500 text-white animate-pop";
              } else if (isSubmitted) {
                const status = evaluatedStatuses[cellIndex];
                if (status === "correct")
                  tileClass = "bg-[#6aaa64] border-[#6aaa64] text-white";
                if (status === "present")
                  tileClass = "bg-[#c9b458] border-[#c9b458] text-white";
                if (status === "absent")
                  tileClass = "bg-[#787c7e] border-[#787c7e] text-neutral-400";
              }

              return (
                <div
                  key={cellIndex}
                  className={`aspect-square w-full flex items-center justify-center font-bold text-2xl border-2 uppercase select-none transition-all duration-300 rounded ${tileClass}`}
                >
                  {char}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
