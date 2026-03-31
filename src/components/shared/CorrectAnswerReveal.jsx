import React from 'react';

/**
 * CorrectAnswerReveal - Shows the correct answer after a wrong answer
 * Uses encouraging, non-punitive language per neuroinclusive guidelines.
 * Brand colors: Warm Amber accent, Deep Charcoal text.
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
      padding: 20,
      background: '#FFF8E8',
      borderRadius: 18,
      animation: 'slideUp 0.3s ease',
      border: '2px solid #FDE68A'
    }}>
      <div style={{
        fontSize: 14,
        color: '#888',
        marginBottom: 6,
        fontFamily: "'Inter', sans-serif"
      }}>Here is the answer:</div>
      {emoji && <div style={{ fontSize: 32, marginBottom: 4 }}>{emoji}</div>}
      <div style={{
        fontSize: 19,
        fontWeight: 700,
        color: '#D4943A',
        marginBottom: 14,
        fontFamily: "'Nunito', sans-serif"
      }}>{text}</div>
      {teach && <div style={{
        fontSize: 14,
        color: '#666',
        marginBottom: 14,
        lineHeight: 1.6,
        fontFamily: "'Inter', sans-serif",
        maxWidth: 340,
        margin: '0 auto 14px'
      }}>{teach}</div>}
      {onNext && <button onClick={onNext}
        style={{
          padding: '14px 40px',
          borderRadius: 22,
          border: 'none',
          background: '#2B579A',
          color: 'white',
          fontSize: 17,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(43,87,154,0.25)',
          fontFamily: "'Nunito', sans-serif",
          minHeight: 48
        }}>
        Keep Going {'\u2192'}
      </button>}
    </div>
  );
}
