import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "public", "data");
const DICTIONARY_URL =
  "https://raw.githubusercontent.com/words/an-array-of-english-words/master/index.json";

// Ensure target directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Programmatic filter to identify mathematically "extreme" words
function isExtremeWord(word) {
  const rareLetters = ["Z", "X", "Q", "J", "K", "Y", "W", "V"];
  const chars = word.toUpperCase().split("");

  // Rule 1: Contains rare or low-frequency letters
  const hasRareLetter = chars.some((char) => rareLetters.includes(char));

  // Rule 2: Contains duplicate letters (harder to solve)
  const uniqueChars = new Set(chars);
  const hasDuplicates = uniqueChars.size < chars.length;

  // Rule 3: Vowel drought (fewer standard vowels)
  const vowels = ["A", "E", "I", "O", "U"];
  const vowelCount = chars.filter((char) => vowels.includes(char)).length;
  const lowVowels = vowelCount <= 1 && word.length >= 4;

  return hasRareLetter || hasDuplicates || lowVowels;
}

async function buildWordBanks() {
  console.log("Fetching raw English dictionary from open-source repository...");

  try {
    const response = await fetch(DICTIONARY_URL);
    const allWords = await response.json();

    console.log(`Processing ${allWords.length.toLocaleString()} words...`);

    // Group words cleanly by length (3 to 8)
    for (let length = 3; length <= 8; length++) {
      // Filter out words matching length, removing abbreviations or hyphenated variants
      const baseList = allWords
        .map((w) => w.toUpperCase().trim())
        .filter((w) => w.length === length && /^[A-Z]+$/.test(w));

      // Separate into valid legal choices vs diabolical target options
      const validGuesses = [...new Set(baseList)];
      let targets = validGuesses.filter(isExtremeWord);

      // Fallback: If list criteria is *too* strict, use the baseline array directly
      if (targets.length < 50) {
        targets = [...validGuesses];
      }

      // Shuffle target word arrays to ensure gameplay randomness
      targets.sort(() => 0.5 - Math.random());

      const payload = {
        targets: targets.slice(0, 400), // Cap target pool to top 400 most brutal words
        valid: validGuesses, // All legal words of this length can be typed
      };

      const filePath = path.join(DATA_DIR, `words-${length}.json`);
      fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));

      console.log(
        `Generated words-${length}.json: Targets: ${payload.targets.length} | Valid Dictionary Size: ${payload.valid.length.toLocaleString()}`,
      );
    }

    console.log(
      "\n🎉 Data layer initialization complete! All files generated smoothly inside public/data/",
    );
  } catch (error) {
    console.error("Extraction failed:", error);
  }
}

buildWordBanks();
