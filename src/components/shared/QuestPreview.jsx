import React from 'react';

/**
 * QuestPreview - Pre-quest screen with social story element
 * Explains what will happen during the quest so the child knows what to expect.
 * Uses predictable structure: what you will do, how many questions, what happens.
 * Per audit: "Digital Social Stories" — visual scripts before new tasks.
 *
 * Props:
 * - biome (object): Biome with id, emoji, name, skill, color
 * - phase (string): 'seedlings', 'explorers', or 'navigators'
 * - onStart (function): Callback for Start Quest button
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

  // Social story: what to expect (predictability reduces anxiety)
  const expectations = {
    communication: 'You will see words and pick the best match. Take your time!',
    harmony: 'You will look at feelings and choose what fits. There are no wrong tries, just learning!',
    rhythm: 'You will explore how your body feels with different emotions. Go at your own pace!',
    puzzle: 'You will see a pattern and pick what comes next. Look carefully!',
    home: 'You will put steps in the right order. Think about what you do each day!',
    numbers: 'You will work with numbers and pick answers. You can do this!',
    alphabet: 'You will explore letters and words. Every try helps you learn!'
  };

  const desc = descriptions[biome.id]?.[phase] || 'A fun learning quest awaits!';
  const expectation = expectations[biome.id] || 'Take your time and have fun!';

  return (
    <div style={{
      textAlign: 'center',
      padding: 28,
      animation: 'fadeIn 0.4s ease'
    }}>
      <div style={{ fontSize: 64, marginBottom: 14 }}>{biome.emoji}</div>
      <h2 style={{
        color: '#2B579A',
        fontSize: 26,
        margin: '0 0 6px',
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 800
      }}>{biome.name}</h2>
      <div style={{
        fontSize: 15,
        color: '#666',
        marginBottom: 16,
        fontFamily: "'Inter', sans-serif"
      }}>{biome.skill}</div>

      {/* Quest description card */}
      <div style={{
        background: '#F0F7FF',
        borderRadius: 18,
        padding: 22,
        marginBottom: 16,
        maxWidth: 400,
        margin: '0 auto 16px',
        border: '1px solid #E8F4FD'
      }}>
        <div style={{
          fontSize: 15,
          color: '#666',
          fontWeight: 600,
          marginBottom: 8,
          fontFamily: "'Inter', sans-serif"
        }}>In this quest, you will...</div>
        <div style={{
          fontSize: 19,
          color: '#2B579A',
          fontWeight: 700,
          fontFamily: "'Nunito', sans-serif",
          lineHeight: 1.4
        }}>{desc}</div>
      </div>

      {/* Social story: What to expect */}
      <div style={{
        background: '#FEFCE8',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        maxWidth: 400,
        margin: '0 auto 24px',
        border: '1px solid #FDE68A'
      }}>
        <div style={{
          fontSize: 13,
          color: '#92400E',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 6
        }}>What to expect</div>
        <div style={{
          fontSize: 15,
          color: '#5D4037',
          lineHeight: 1.5,
          fontFamily: "'Inter', sans-serif"
        }}>{expectation}</div>
      </div>

      <button onClick={onStart}
        style={{
          padding: '18px 52px',
          borderRadius: 24,
          border: 'none',
          background: biome.color,
          color: 'white',
          fontSize: 21,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.12)',
          fontFamily: "'Nunito', sans-serif",
          minHeight: 56,
          transition: 'all 0.2s ease'
        }}>
        Start Quest!
      </button>
    </div>
  );
}
