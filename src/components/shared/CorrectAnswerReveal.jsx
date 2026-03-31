import React from 'react';

/**
 * CorrectAnswerReveal - Shows the correct answer after a wrong answer
 * Displays the answer with emoji and a "Next Question" button
 *
 * Props:
 * - text (string): The correct answer text
 * - emoji (string): Emoji associated with the answer
 * - onNext (function): Callback when Next Question button is clicked
 * - teach (string, optional): Teaching text shown below the answer
 */
export default function CorrectAnswerReveal({ text, emoji, onNext, teach }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: 18,
      background: '#FFF8E8',
      borderRadius: 16,
      animation: 'slideUp 0.3s ease',
      border: '2px solid #FFD54F'
    }}>
      <div style={{
        fontSize: 14,
        color: '#888',
        marginBottom: 4
      }}>The answer was:</div>
      {emoji && <div style={{ fontSize: 28 }}>{emoji}</div>}
      <div style={{
        fontSize: 18,
        fontWeight: 700,
        color: '#E65100',
        marginBottom: 14
      }}>{text}</div>
      {teach && <div style={{
        fontSize: 14,
        color: '#666',
        marginBottom: 14,
        lineHeight: 1.6
      }}>{teach}</div>}
      {onNext && <button onClick={onNext}
        style={{
          padding: '12px 36px',
          borderRadius: 20,
          border: 'none',
          background: '#2B579A',
          color: 'white',
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(43,87,154,0.25)'
        }}>
        Next Question {'\u2192'}
      </button>}
    </div>
  );
}
