import React, { useRef, useEffect, useState, useCallback } from "react";

export default function Grid({
  wordLength,
  guesses,
  currentGuess,
  secretWord,
  invalidGuessRow,
  onMobileInput,
  isMobile,
}) {
  const totalRows = 6;
  const rows = Array.from({ length: totalRows });
  const containerRef = useRef(null);
  const hiddenInputRef = useRef(null);
  const [tileSize, setTileSize] = useState(0);

  // Compute square tile size that fits within the container
  const computeTileSize = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const availW = rect.width;
    const availH = rect.height;
    const gap = 4;

    // Max tile width = (availableWidth - gaps) / columns
    const maxByWidth = (availW - gap * (wordLength - 1)) / wordLength;
    // Max tile height = (availableHeight - gaps) / rows
    const maxByHeight = (availH - gap * (totalRows - 1)) / totalRows;

    // Use the smaller one to guarantee 1:1 squares that fit
    const size = Math.floor(Math.min(maxByWidth, maxByHeight));
    setTileSize(Math.max(size, 16)); // floor at 16px minimum
  }, [wordLength]);

  useEffect(() => {
    computeTileSize();
    window.addEventListener("resize", computeTileSize);
    return () => window.removeEventListener("resize", computeTileSize);
  }, [computeTileSize]);

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

  const tileFontSize = tileSize > 0 ? `${Math.max(tileSize * 0.45, 10)}px` : "1rem";

  const handleGridTap = () => {
    if (isMobile && hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  };

  const handleHiddenInput = (e) => {
    if (!onMobileInput) return;
    const val = e.target.value;
    if (val.length > 0) {
      const lastChar = val.slice(-1).toUpperCase();
      if (/^[A-Z]$/.test(lastChar)) {
        onMobileInput(lastChar);
      }
    }
    // Always reset value so next key fires
    e.target.value = "";
  };

  const handleHiddenKeyDown = (e) => {
    if (!onMobileInput) return;
    if (e.key === "Backspace") {
      e.preventDefault();
      onMobileInput("BACKSPACE");
    } else if (e.key === "Enter") {
      e.preventDefault();
      onMobileInput("ENTER");
    }
  };

  const gridWidth = tileSize > 0
    ? tileSize * wordLength + 4 * (wordLength - 1)
    : "100%";
  const gridHeight = tileSize > 0
    ? tileSize * totalRows + 4 * (totalRows - 1)
    : "100%";

  return (
    <div
      ref={containerRef}
      className="grid-container"
      onClick={handleGridTap}
      style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", cursor: isMobile ? "pointer" : "default" }}
    >
      {/* Hidden input for mobile keyboard */}
      {isMobile && (
        <input
          ref={hiddenInputRef}
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          inputMode="text"
          onInput={handleHiddenInput}
          onKeyDown={handleHiddenKeyDown}
          style={{
            position: "absolute",
            opacity: 0,
            width: "1px",
            height: "1px",
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          width: typeof gridWidth === "number" ? `${gridWidth}px` : gridWidth,
          height: typeof gridHeight === "number" ? `${gridHeight}px` : gridHeight,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
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
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${wordLength}, ${tileSize > 0 ? `${tileSize}px` : "1fr"})`,
                gap: "4px",
                height: tileSize > 0 ? `${tileSize}px` : undefined,
                flex: tileSize > 0 ? "none" : 1,
              }}
              className={shouldShake ? "animate-shake" : ""}
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
                    style={{
                      fontSize: tileFontSize,
                      width: tileSize > 0 ? `${tileSize}px` : undefined,
                      height: tileSize > 0 ? `${tileSize}px` : undefined,
                    }}
                    className={`flex items-center justify-center font-bold border-2 uppercase select-none transition-all duration-300 rounded ${tileClass}`}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
