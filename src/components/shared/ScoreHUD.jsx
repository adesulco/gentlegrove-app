import React from 'react';

/**
 * ScoreHUD - Displays the score information during quests
 * Shows correct/total answers, companion name and emoji, and current XP
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
      padding: '8px 14px',
      background: 'rgba(255,255,255,0.8)',
      borderRadius: 14,
      marginBottom: 14,
      fontSize: 15,
      fontWeight: 600
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}>
        <span>✅</span>
        <span style={{ color: '#2E8B57' }}>{correct}/{total}</span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }}>
        <span>{companionEmoji}</span>
        <span style={{ fontSize: 13, color: '#888' }}>{companionName}</span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }}>
        <span>💫</span>
        <span style={{ color: '#6A1B9A' }}>{xp} XP</span>
      </div>
    </div>
  );
}
