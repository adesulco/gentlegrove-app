/**
 * GentleGrove Educational Game - Data Constants
 * Contains companion data, biome definitions, and stage progression
 */

export const COMPANIONS = [
  {
    id: "fox",
    emoji: "🦊",
    name: "Fox",
    stages: [
      { label: "Kit", suffix: "🐾", desc: "A tiny fox kit, just learning to explore!" },
      { label: "Young Fox", suffix: "💕", desc: "Growing braver and more curious every day!" },
      { label: "Wise Fox", suffix: "✨", desc: "A wise and loyal fox, full of knowledge!" }
    ]
  },
  {
    id: "owl",
    emoji: "🦉",
    name: "Owl",
    stages: [
      { label: "Owlet", suffix: "🐾", desc: "A fluffy little owlet with big, curious eyes!" },
      { label: "Fledgling", suffix: "💕", desc: "Learning to spread those wings wide!" },
      { label: "Wise Owl", suffix: "✨", desc: "A wise owl who sees and knows so much!" }
    ]
  },
  {
    id: "bunny",
    emoji: "🐰",
    name: "Bunny",
    stages: [
      { label: "Baby Bunny", suffix: "🐾", desc: "A soft, tiny bunny with twitchy little nose!" },
      { label: "Young Bunny", suffix: "💕", desc: "Hopping higher and learning new tricks!" },
      { label: "Wise Bunny", suffix: "✨", desc: "A calm and clever bunny, a true friend!" }
    ]
  },
  {
    id: "cat",
    emoji: "🐱",
    name: "Cat",
    stages: [
      { label: "Kitten", suffix: "🐾", desc: "A playful little kitten, full of wonder!" },
      { label: "Young Cat", suffix: "💕", desc: "Getting braver and more independent!" },
      { label: "Wise Cat", suffix: "✨", desc: "A graceful and wise cat, always by your side!" }
    ]
  }
];

export const BIOMES = [
  {
    id: "communication",
    name: "Communication Cove",
    emoji: "🐙",
    color: "#7EC8E3",
    skill: "Communication",
    mascot: "Coral"
  },
  {
    id: "harmony",
    name: "Harmony Meadow",
    emoji: "🦋",
    color: "#A8D5A0",
    skill: "Social & Emotional",
    mascot: "Flutter"
  },
  {
    id: "rhythm",
    name: "Rhythm Ridge",
    emoji: "🦎",
    color: "#F4A9A8",
    skill: "Sensory & Self-Regulation",
    mascot: "Zen"
  },
  {
    id: "puzzle",
    name: "Puzzle Forest",
    emoji: "🦉",
    color: "#F4C49C",
    skill: "Cognitive Patterns",
    mascot: "Oakley"
  },
  {
    id: "home",
    name: "Home Harbor",
    emoji: "🦖",
    color: "#C3B1E1",
    skill: "Daily Living",
    mascot: "River"
  },
  {
    id: "numbers",
    name: "Numbers Garden",
    emoji: "🏵️",
    color: "#FFD54F",
    skill: "Maths & Numbers",
    mascot: "Sunny"
  },
  {
    id: "alphabet",
    name: "Alphabet Cove",
    emoji: "📚",
    color: "#90CAF9",
    skill: "Letters & Words",
    mascot: "Scribbly"
  }
];

/**
 * Determine companion stage based on XP
 * @param {number} xp - Total experience points
 * @param {object} companionObj - Companion object with stages array
 * @returns {object} Stage object with label, suffix, and desc
 */
export function companionStage(xp, companionObj) {
  const stages = companionObj?.stages || [
    { label: "Little One", suffix: "🐾", desc: "" },
    { label: "Growing Up", suffix: "💕", desc: "" },
    { label: "Fully Grown", suffix: "✨", desc: "" }
  ];
  if (xp >= 200) return { ...stages[2] };
  if (xp >= 50) return { ...stages[1] };
  return { ...stages[0] };
}

export const THEME_COLORS = {
  cool: { bg: "#F0F7FF", accent: "#2B579A", secondary: "#7EC8E3" },
  warm: { bg: "#FFF8F0", accent: "#8B5E3C", secondary: "#F4C49C" },
  neutral: { bg: "#F5F5F3", accent: "#555555", secondary: "#B8B8B8" }
};

export const AGE_GROUPS = [
  { id: "seedlings", label: "Seedlings", emoji: "🌱", ages: "Ages 3–5" },
  { id: "explorers", label: "Explorers", emoji: "🌿", ages: "Ages 6–8" },
  { id: "navigators", label: "Navigators", emoji: "🌸", ages: "Ages 9–12" }
];
