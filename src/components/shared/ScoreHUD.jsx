import React from 'react';

/**
 * ScoreHUD - Displays the score during quests
 * Uses brand colors: Forest Green for correct, Grove Blue for XP
 * Large touch-friendly layout for tablet devices
 *
 * Props:
 * - correct (number): Number of correct answers
 * - total (number): Total questions attempted
 * - xp (number): Experience points earned
 * - companionEmoji (string): Companion emoji
 * - companionName (string): Companion name
 */
export default function ScoreHUD({ correct, total, xp, companionEmoji, companionName }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 18px',
      background: 'rgba(255,255,255,0.95)',
      borderRadius: 18,
      marginBottom: 16,
      fontSize: 18,
      fontWeight: 600,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      fontFamily: "'Nunito', sans-serif"
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        <span style={{ fontSize: 22 }}>✅</span>
        <span style={{ color: '#4A7C59', fontSize: 18, fontWeight: 700 }}>{correct}/{total}</span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}>
        <span style={{ fontSize: 24 }}>{companionEmoji}</span>
        <span style={{ fontSize: 15, color: '#666', fontWeight: 600 }}>{companionName}</span>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}>
        <span style={{ fontSize: 22 }}>💫</span>
        <span style={{ color: '#2B579A', fontSize: 18, fontWeight: 700 }}>{xp} XP</span>
      </div>
    </div>
  );
}
