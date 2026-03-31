import React from 'react';

/**
 * QuestPreview - Preview screen shown before starting a quest
 * Displays biome information and quest description based on difficulty phase
 *
 * Props:
 * - biome (object): Biome object with id, emoji, name, skill, color
 * - phase (string): Difficulty phase - 'seedlings', 'explorers', or 'navigators'
 * - onStart (function): Callback when "Start Quest!" button is clicked
 */
export default function QuestPreview({ biome, phase, onStart }) {
  const descriptions = {
    communication: {
      seedlings: 'Match words to their pictures!',
      explorers: 'Learn feeling words and what they mean!',
      navigators: 'Choose the kindest thing to say!'
    },
    harmony: {
      seedlings: 'How does this person feel? Match the emotion!',
      explorers: 'Figure out how characters in stories feel!',
      navigators: 'Understand tricky social situations!'
    },
    rhythm: {
      seedlings: 'Match body feelings to emotions!',
      explorers: 'Connect emotions to what your body does!',
      navigators: 'Find helpful ways to handle big feelings!'
    },
    puzzle: {
      seedlings: 'Find what comes next in the pattern!',
      explorers: 'Spot trickier patterns!',
      navigators: 'Solve challenging pattern puzzles!'
    },
    home: {
      seedlings: 'Put the morning steps in order!',
      explorers: 'Sequence the school routine!',
      navigators: 'Organize the after-school routine!'
    },
    numbers: {
      seedlings: 'Count and learn your numbers!',
      explorers: 'Add, subtract, and compare numbers!',
      navigators: 'Solve maths problems step by step!'
    },
    alphabet: {
      seedlings: 'Learn your letters and their sounds!',
      explorers: 'Practice words, rhymes, and spelling!',
      navigators: 'Grammar, vocabulary, and word skills!'
    }
  };

  const desc = descriptions[biome.id]?.[phase] || 'A fun learning quest awaits!';

  return (
    <div style={{
      textAlign: 'center',
      padding: 32,
      animation: 'fadeIn 0.4s ease'
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>{biome.emoji}</div>
      <h2 style={{
        color: '#2B579A',
        fontSize: 24,
        margin: '0 0 8px'
      }}>{biome.name}</h2>
      <div style={{
        fontSize: 16,
        color: '#888',
        marginBottom: 8
      }}>{biome.skill}</div>
      <div style={{
        background: '#F0F7FF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        maxWidth: 400,
        margin: '0 auto 24px'
      }}>
        <div style={{
          fontSize: 15,
          color: '#555',
          fontWeight: 600,
          marginBottom: 8
        }}>In this quest, you will...</div>
        <div style={{
          fontSize: 18,
          color: '#2B579A',
          fontWeight: 700
        }}>{desc}</div>
      </div>
      <button onClick={onStart}
        style={{
          padding: '16px 48px',
          borderRadius: 24,
          border: 'none',
          background: biome.color,
          color: 'white',
          fontSize: 20,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
        }}>
        Start Quest!
      </button>
    </div>
  );
}
