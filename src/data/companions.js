export const COMPANIONS = [
  { id: "fox", emoji: "🦊", name: "Fox",
    stages: [
      { label: "Kit", suffix: "🐾", desc: "A tiny fox kit, just learning to explore!" },
      { label: "Young Fox", suffix: "💕", desc: "Growing braver and more curious every day!" },
      { label: "Wise Fox", suffix: "✨", desc: "A wise and loyal fox, full of knowledge!" }
    ]},
  { id: "owl", emoji: "🦉", name: "Owl",
    stages: [
      { label: "Owlet", suffix: "🐾", desc: "A fluffy little owlet with big, curious eyes!" },
      { label: "Fledgling", suffix: "💕", desc: "Learning to spread those wings wide!" },
      { label: "Wise Owl", suffix: "✨", desc: "A wise owl who sees and knows so much!" }
    ]},
  { id: "bunny", emoji: "🐰", name: "Bunny",
    stages: [
      { label: "Baby Bunny", suffix: "🐾", desc: "A soft, tiny bunny with twitchy little nose!" },
      { label: "Young Bunny", suffix: "💕", desc: "Hopping higher and learning new tricks!" },
      { label: "Wise Bunny", suffix: "✨", desc: "A calm and clever bunny, a true friend!" }
    ]},
  { id: "cat", emoji: "🐱", name: "Cat",
    stages: [
      { label: "Kitten", suffix: "🐾", desc: "A playful little kitten, full of wonder!" },
      { label: "Young Cat", suffix: "💕", desc: "Getting braver and more independent!" },
      { label: "Wise Cat", suffix: "✨", desc: "A graceful and wise cat, always by your side!" }
    ]},
];

export function companionStage(xp, companionObj) {
  const stages = companionObj?.stages || [
    { label: "Little One", suffix: "🐾", desc: "" },
    { label: "Growing Up", suffix: "💕", desc: "" },
    { label: "Fully Grown", suffix: "✨", desc: "" },
  ];
  if (xp >= 200) return { ...stages[2] };
  if (xp >= 50) return { ...stages[1] };
  return { ...stages[0] };
}
