import { useState, useEffect } from "react";

export function useWordle(wordLength) {
  const [secretWord, setSecretWord] = useState("");
  const [wordLists, setWordLists] = useState({ targets: [], valid: [] });
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState("IN_PLAY"); // 'IN_PLAY' | 'WON' | 'LOST'
  const [invalidGuessRow, setInvalidGuessRow] = useState(null);
  const [statuses, setStatuses] = useState({});

  // 1. Load word banks AND check for saved games isolated by wordLength
  useEffect(() => {
    fetch(`/data/words-${wordLength}.json`)
      .then((res) => res.json())
      .then((data) => {
        setWordLists(data);

        // Check if there's an ongoing session for this specific length category
        const savedGuesses = localStorage.getItem(
          `extreme_guesses_${wordLength}`,
        );
        const savedStatus = localStorage.getItem(
          `extreme_status_${wordLength}`,
        );
        const savedSecret = localStorage.getItem(
          `extreme_secret_${wordLength}`,
        );
        const savedStatuses = localStorage.getItem(
          `extreme_keys_${wordLength}`,
        );

        if (savedGuesses && savedStatus && savedSecret && savedStatuses) {
          setGuesses(JSON.parse(savedGuesses));
          setGameStatus(savedStatus);
          setSecretWord(savedSecret);
          setStatuses(JSON.parse(savedStatuses));
          console.log("Restored Saved Target:", savedSecret);
        } else {
          // Fresh game initialization
          const randomTarget =
            data.targets[
              Math.floor(Math.random() * data.targets.length)
            ].toUpperCase();
          setSecretWord(randomTarget);
          setGuesses([]);
          setGameStatus("IN_PLAY");
          setStatuses({});
          console.log("New Target Word:", randomTarget);
        }
        setCurrentGuess("");
      })
      .catch((err) => console.error("Error loading word file:", err));
  }, [wordLength]);

  // 2. Automatically sync state to LocalStorage whenever changes happen
  useEffect(() => {
    if (!secretWord) return; // Prevent saving before data finishes fetching

    localStorage.setItem(
      `extreme_guesses_${wordLength}`,
      JSON.stringify(guesses),
    );
    localStorage.setItem(`extreme_status_${wordLength}`, gameStatus);
    localStorage.setItem(`extreme_secret_${wordLength}`, secretWord);
    localStorage.setItem(
      `extreme_keys_${wordLength}`,
      JSON.stringify(statuses),
    );
  }, [guesses, gameStatus, statuses, secretWord, wordLength]);

  const evaluateGuessRow = (guess) => {
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

  const handleInput = (key) => {
    if (gameStatus !== "IN_PLAY") return;
    const upperKey = key.toUpperCase();

    if (upperKey === "ENTER") {
      if (currentGuess.length !== wordLength) return;
      if (!wordLists.valid.includes(currentGuess)) {
        setInvalidGuessRow(guesses.length);
        setTimeout(() => setInvalidGuessRow(null), 250);
        return;
      }

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);

      const rowEvaluation = evaluateGuessRow(currentGuess);
      const updatedStatuses = { ...statuses };
      currentGuess.split("").forEach((char, index) => {
        const currentType = updatedStatuses[char];
        const newType = rowEvaluation[index];
        if (currentType === "correct") return;
        if (currentType === "present" && newType === "absent") return;
        updatedStatuses[char] = newType;
      });
      setStatuses(updatedStatuses);

      if (currentGuess === secretWord) {
        setGameStatus("WON");
      } else if (newGuesses.length >= 6) {
        setGameStatus("LOST");
      }
      setCurrentGuess("");
    }

    if (upperKey === "BACKSPACE") {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }

    if (/^[A-Z]$/.test(upperKey) && currentGuess.length < wordLength) {
      setCurrentGuess((prev) => prev + upperKey);
    }
  };

  // 3. Instant replay function: wipes local storage for this length and rolls a new word
  const resetGame = () => {
    if (wordLists.targets.length === 0) return;

    localStorage.removeItem(`extreme_guesses_${wordLength}`);
    localStorage.removeItem(`extreme_status_${wordLength}`);
    localStorage.removeItem(`extreme_secret_${wordLength}`);
    localStorage.removeItem(`extreme_keys_${wordLength}`);

    const randomTarget =
      wordLists.targets[
        Math.floor(Math.random() * wordLists.targets.length)
      ].toUpperCase();
    setSecretWord(randomTarget);
    setGuesses([]);
    setCurrentGuess("");
    setGameStatus("IN_PLAY");
    setStatuses({});
    console.log("New Reset Target Word:", randomTarget);
  };

  // 4. Fixed Dependency Array to prevent stale closures over guesses/statuses
  useEffect(() => {
    const handleKeyDown = (e) => handleInput(e.key);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, gameStatus, secretWord, wordLists, guesses, statuses]);

  return {
    guesses,
    currentGuess,
    gameStatus,
    statuses,
    invalidGuessRow,
    handleInput,
    secretWord,
    resetGame, // Passed out cleanly to your components
  };
}
