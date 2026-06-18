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

  // Tile font size shrinks as column count grows to prevent overflow
  const tileFontSize = `clamp(0.6rem, ${3.5 / wordLength}vw + 0.4rem, ${1.6 - wordLength * 0.06}rem)`;

  return (
    <div
      className="flex flex-col gap-1 w-full h-full max-h-full justify-center items-center mx-auto p-1"
      style={{ aspectRatio: `${wordLength} / ${totalRows}` }}
    >
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
            style={{ display: "grid", gridTemplateColumns: `repeat(${wordLength}, 1fr)`, gap: "4px" }}
            className={`w-full flex-1 min-h-0 ${shouldShake ? "animate-shake" : ""}`}
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
                  style={{ fontSize: tileFontSize }}
                  className={`h-full flex items-center justify-center font-bold border-2 uppercase select-none transition-all duration-300 rounded ${tileClass}`}
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
