import { useState, useEffect } from "react";

export function useWordle(wordLength) {
  const [secretWord, setSecretWord] = useState("");
  const [wordLists, setWordLists] = useState({ targets: [], valid: [] });
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState("IN_PLAY"); // 'IN_PLAY' | 'WON' | 'LOST'
  const [invalidGuessRow, setInvalidGuessRow] = useState(null);
  const [statuses, setStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Tracks dictionary network transitions

  // 1. Load word banks AND check for saved games isolated by wordLength
  useEffect(() => {
    setIsLoading(true); // Freeze game inputs and layouts immediately

    fetch(`${import.meta.env.BASE_URL}data/words-${wordLength}.json`)
      .then((res) => res.json())
      .then((data) => {
        setWordLists(data);

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

        // 🛡️ LOADING VALIDATION GUARD:
        // Only restore a save session if it explicitly matches the active category length!
        if (
          savedGuesses &&
          savedStatus &&
          savedSecret &&
          savedStatuses &&
          savedSecret.length === wordLength
        ) {
          setGuesses(JSON.parse(savedGuesses));
          setGameStatus(savedStatus);
          setSecretWord(savedSecret);
          setStatuses(JSON.parse(savedStatuses));
          console.log("Restored Valid Saved Target:", savedSecret);
        } else {
          // Fallback to initializing a pristine fresh game
          if (data.targets && data.targets.length > 0) {
            const randomTarget =
              data.targets[
                Math.floor(Math.random() * data.targets.length)
              ].toUpperCase();
            setSecretWord(randomTarget);
          }
          setGuesses([]);
          setGameStatus("IN_PLAY");
          setStatuses({});
        }
        setCurrentGuess("");
        setIsLoading(false); // Reveal the newly prepared layout cleanly
      })
      .catch((err) => {
        console.error("Error loading word file:", err);
        setIsLoading(false);
      });
  }, [wordLength]);

  // 2. Automatically sync state to LocalStorage whenever changes happen
  useEffect(() => {
    // 🛑 SAVING VALIDATION GUARD:
    // If the secretWord length does not match the active wordLength category,
    // it means the state is stale (from the previous category) and we must ABORT
    // to prevent corrupting the newly selected range's storage keys.
    if (isLoading || !secretWord || secretWord.length !== wordLength) return;

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
  }, [guesses, gameStatus, statuses, secretWord, wordLength, isLoading]);

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
    if (isLoading || gameStatus !== "IN_PLAY") return;
    const upperKey = key.toUpperCase();

    if (upperKey === "ENTER") {
      if (currentGuess.length !== wordLength) return;

      const normalizedGuess = currentGuess.toLowerCase();
      if (
        !wordLists.valid.includes(normalizedGuess) &&
        !wordLists.valid.includes(currentGuess)
      ) {
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

  const resetGame = () => {
    if (!wordLists.targets || wordLists.targets.length === 0) return;

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
  };

  useEffect(() => {
    const handleKeyDown = (e) => handleInput(e.key);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentGuess,
    gameStatus,
    secretWord,
    wordLists,
    guesses,
    statuses,
    isLoading,
  ]);

  return {
    guesses,
    currentGuess,
    gameStatus,
    statuses,
    invalidGuessRow,
    handleInput,
    secretWord,
    resetGame,
    isLoading,
  };
}
