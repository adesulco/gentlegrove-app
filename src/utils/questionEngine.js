/**
 * Question Engine for GentleGrove
 *
 * Provides randomization, shuffling, and dynamic question generation
 * for all biome game types. Ensures kids get a fresh experience each play.
 */

/**
 * Fisher-Yates shuffle - returns a new shuffled copy
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Pick N random items from a pool (shuffled)
 */
export function pickRandom(pool, count) {
  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Randomize the order of options within a question.
 * Handles different question formats used across biomes:
 * - emoji-match (communication vocab): answer is emoji string in options
 * - index-answer (scenarios): answer is a number index
 * - string-answer (maths, alphabet): answer is a string in options
 * - pattern: answer is a string/emoji in options
 */
export function randomizeOptions(question) {
  if (!question.options) return question;

  // For vocab/communication style where answer is an emoji that matches
  if (question.emoji && question.options) {
    return {
      ...question,
      options: shuffleArray(question.options)
    };
  }

  // For scenario style where answer is a number index
  if (typeof question.answer === 'number' && question.options) {
    const correctOption = question.options[question.answer];
    const shuffledOptions = shuffleArray(question.options);
    const newAnswer = shuffledOptions.indexOf(correctOption);
    return {
      ...question,
      options: shuffledOptions,
      answer: newAnswer
    };
  }

  // For string-answer style (maths, alphabet, body signals, patterns)
  if (typeof question.answer === 'string' && question.options) {
    return {
      ...question,
      options: shuffleArray(question.options)
    };
  }

  return question;
}

/**
 * Get a randomized set of questions for a game.
 * Picks `count` random questions from the pool and randomizes option order.
 *
 * @param {Array} pool - Full question pool for the biome/phase
 * @param {number} count - Number of questions to pick (default 6)
 * @returns {Array} Randomized subset of questions
 */
export function getRandomQuestions(pool, count = 6) {
  const selected = pickRandom(pool, count);
  return selected.map(q => randomizeOptions(q));
}

/**
 * Generate vocab questions dynamically from a word pool.
 * Creates option sets by mixing correct answer with random distractors.
 *
 * @param {Array} wordPool - Array of { word, emoji, teach, hint? } objects
 * @param {number} count - Number of questions to generate
 * @param {number} optionCount - Number of options per question (default 4)
 * @returns {Array} Generated questions with randomized options
 */
export function generateVocabQuestions(wordPool, count = 6, optionCount = 4) {
  const selected = pickRandom(wordPool, count);
  const allEmojis = wordPool.map(w => w.emoji);

  return selected.map(item => {
    const distractors = shuffleArray(
      allEmojis.filter(e => e !== item.emoji)
    ).slice(0, optionCount - 1);
    const options = shuffleArray([item.emoji, ...distractors]);
    return { ...item, options };
  });
}

/**
 * Generate emotion scenario questions with randomized emotion options.
 */
export function generateEmotionQuestions(scenarios, emotions, count = 6) {
  const selected = pickRandom(scenarios, count);
  const emotionNames = emotions.map(e => e.name);
  return selected.map(scenario => {
    const wrongOptions = shuffleArray(
      emotionNames.filter(n => n !== scenario.answer)
    ).slice(0, 3);
    const options = shuffleArray([scenario.answer, ...wrongOptions]);
    return { ...scenario, options };
  });
}

export function generateMathQuestions(pool, count = 6) {
  return getRandomQuestions(pool, count);
}

export function generatePatternQuestions(pool, count = 5) {
  return getRandomQuestions(pool, count);
}
