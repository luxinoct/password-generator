// -------------------- Character sets --------------------

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  number: "0123456789",
  symbol: "@#",
};

const SIMILAR_CHAR_SET = new Set("iIl1oO0S5B8");

// -------------------- Main function --------------------

export function generatePassword(options, length) {
  const charPools = getEnabledCharPools(options);
  const combinedPool = charPools.join("");

  if (!combinedPool) return "";

  // Ensure enough unique characters if duplicates are not allowed
  if (options.excludeDuplicate && new Set(combinedPool).size < length) {
    return "Not enough unique characters";
  }

  const usedChars = new Set();
  const password = [];

  // Step 1: Ensure at least one char from each selected pool
  for (const pool of charPools) {
    const char = getRandomChar(pool, options.excludeDuplicate, usedChars);
    if (!char) return "";
    password.push(char);
    usedChars.add(char);
  }

  // Step 2: Fill remaining length
  while (password.length < length) {
    const char = getRandomChar(
      combinedPool,
      options.excludeDuplicate,
      usedChars,
    );
    if (!char) return "";
    password.push(char);
    usedChars.add(char);
  }

  // Step 3: Shuffle
  shuffle(password);

  // Step 4: Ensure starts with letter if required
  if (options.beginWithLetter) {
    enforceLeadingLetter(password, options, usedChars);
  }

  return password.join("");
}

// -------------------- Helpers --------------------

// Get enabled character pools based on options
function getEnabledCharPools(options) {
  return Object.entries(CHAR_SETS)
    .filter(([key]) => options[key])
    .map(([, chars]) => maybeExcludeSimilar(chars, options.excludeSimilar));
}

// Remove similar-looking characters if needed
function maybeExcludeSimilar(chars, excludeSimilar) {
  if (!excludeSimilar) return chars;

  return [...chars].filter((ch) => !SIMILAR_CHAR_SET.has(ch)).join("");
}

// Get random character (optionally avoiding duplicates)
function getRandomChar(chars, avoidDuplicate, usedChars) {
  const pool = avoidDuplicate
    ? [...chars].filter((ch) => !usedChars.has(ch))
    : [...chars];

  if (!pool.length) return null;

  return pool[Math.floor(Math.random() * pool.length)];
}

// Fisher–Yates shuffle (in-place)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Ensure password starts with a letter
function enforceLeadingLetter(password, options, usedChars) {
  const letterPool = [
    ...(options.uppercase
      ? maybeExcludeSimilar(CHAR_SETS.uppercase, options.excludeSimilar)
      : ""),
    ...(options.lowercase
      ? maybeExcludeSimilar(CHAR_SETS.lowercase, options.excludeSimilar)
      : ""),
  ];

  if (!letterPool.length) return;

  const letterSet = new Set(letterPool);

  const firstLetterIndex = password.findIndex((ch) => letterSet.has(ch));

  // No letter found → force replace first char
  if (firstLetterIndex === -1) {
    const newLetter = getRandomChar(letterPool.join(""), false);
    if (!newLetter) return;

    if (options.excludeDuplicate) {
      usedChars.delete(password[0]);
    }

    password[0] = newLetter;
    usedChars.add(newLetter);
    return;
  }

  // Swap to front if needed
  if (firstLetterIndex !== 0) {
    [password[0], password[firstLetterIndex]] = [
      password[firstLetterIndex],
      password[0],
    ];
  }
}
