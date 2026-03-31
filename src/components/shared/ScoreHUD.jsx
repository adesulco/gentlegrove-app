import React from 'react';

/**
 * ScoreHUD - Displays the score information during quests
 * Optimized for kids ages 3-12 on tablet devices (768px+)
 * Large readable text, clear spacing
 *
 * Props:
 * - correct (number): Number of correct answers
 * - total (number): Total number of questions
 * - xp (number): Experience points earned
 * - companionEmoji (string): Emoji of the companion
 * - companionName (string): Name of the companion
 */
export default function ScoreHUD({ correct, total, xp, companionEmoji, companionName }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 18px',
      background: 'rgba(255,255,255,0.9)',
      borderRadius: 16,
      marginBottom: 14,
      fontSize: 18,
      fontWeight: 600,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <span style={{ fontSize: 22 }}>✅</span>
        <span style={{ color: '#2E8B57', fontSize: 18, fontWeight: 700 }}>{correct}/{total}</span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}>
        <span style={{ fontSize: 22 }}>{companionEmoji}</span>
        <span style={{ fontSize: 16, color: '#666', fontWeight: 600 }}>{companionName}</span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}>
        <span style={{ fontSize: 22 }}>💫</span>
        <span style={{ color: '#6A1B9A', fontSize: 18, fontWeight: 700 }}>{xp} XP</span>
      </div>
    </div>
  );
}
