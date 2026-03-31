export const PATTERNS_SEEDLINGS = [
  { sequence: ["🔵", "🔴", "🔵", "🔴", "🔵"], answer: "🔴", options: ["🔴", "🔵", "🟢"], teach: "This is an AB pattern. Blue, red, blue, red -- it keeps going back and forth!" },
  { sequence: ["⭐", "🌙", "⭐", "🌙", "⭐"], answer: "🌙", options: ["⭐", "🌙", "☀️"], teach: "Star, moon, star, moon -- the pattern takes turns between two things." },
  { sequence: ["🐱", "🐱", "🐶", "🐱", "🐱"], answer: "🐶", options: ["🐱", "🐶", "🐰"], teach: "Two cats, then one dog -- the pattern repeats this group!" },
  { sequence: ["🍎", "🍎", "🍎", "🍌", "🍎", "🍎", "🍎"], answer: "🍌", options: ["🍎", "🍌", "🍇"], teach: "Three apples then one banana. Count the items to find the pattern!" },
];

export const PATTERNS_EXPLORERS = [
  { sequence: ["🔵", "🔴", "🟢", "🔵", "🔴"], answer: "🟢", options: ["🔴", "🟢", "🔵", "🟡"], teach: "This is an ABC pattern: blue, red, green -- then it repeats!" },
  { sequence: ["🌸", "🌸", "🌿", "🌸", "🌸"], answer: "🌿", options: ["🌸", "🌿", "🌻", "🍀"], teach: "Two flowers, one leaf, two flowers -- the leaf comes after every two flowers." },
  { sequence: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"], answer: "6️⃣", options: ["6️⃣", "7️⃣", "3️⃣", "8️⃣"], teach: "Counting up by one: 1, 2, 3, 4, 5 -- the next number is 6!" },
  { sequence: ["🌈", "⭐", "⭐", "🌈", "⭐", "⭐", "🌈"], answer: "⭐", options: ["🌈", "⭐", "🌙", "☀️"], teach: "One rainbow then two stars, over and over. After the rainbow comes two stars!" },
];

export const PATTERNS_NAVIGATORS = [
  { sequence: ["🔵", "🔴", "🔵", "🟢", "🔵", "🔴", "🔵"], answer: "🟢", options: ["🔴", "🟢", "🔵", "🟡"], teach: "Look for the part that repeats: blue-red-blue-GREEN makes one group." },
  { sequence: ["A", "B", "C", "A", "B", "C", "A"], answer: "B", options: ["A", "B", "C", "D"], teach: "The letters A, B, C repeat in order. After A always comes B." },
  { sequence: ["🌝", "🌛", "🌝", "🌛", "🌝", "🌛", "🌝"], answer: "🌛", options: ["🌝", "🌛", "⭐", "☀️"], teach: "Full moon, crescent moon, full moon -- they take turns!" },
  { sequence: ["2", "4", "6", "8"], answer: "10", options: ["10", "9", "7", "11"], teach: "Counting by twos: 2, 4, 6, 8 -- the next is 10!" },
];
