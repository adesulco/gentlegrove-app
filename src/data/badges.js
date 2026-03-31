export const BADGES = [
  { id: "first_star", name: "First Star", emoji: "🌟", desc: "Earn your first star", check: s => s.totalStars >= 1 },
  { id: "five_stars", name: "Star Collector", emoji: "🌠", desc: "Earn 5 stars", check: s => s.totalStars >= 5 },
  { id: "ten_stars", name: "Superstar", emoji: "⭐", desc: "Earn 10 stars", check: s => s.totalStars >= 10 },
  { id: "all_biomes", name: "Explorer", emoji: "🧭", desc: "Play all 7 biomes", check: s => s.biomesPlayed && s.biomesPlayed.size >= 7 },
  { id: "perfect", name: "Perfect Round", emoji: "💎", desc: "Get every answer right", check: s => s.hadPerfect },
  { id: "companion_bond", name: "Companion Bond", emoji: "💞", desc: "Grow companion to Grown stage", check: s => s.totalXp >= 200 },
  { id: "mastery", name: "Master Explorer", emoji: "🏆", desc: "Reach Level 5", check: s => s.level >= 5 },
  { id: "kind_heart", name: "Kind Heart", emoji: "❤️", desc: "Complete 3 Harmony Meadow quests", check: s => (s.harmonyCount || 0) >= 3 },
];
