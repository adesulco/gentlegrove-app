import React from 'react';

/**
 * BadgeOverlay - Pop-up notification for newly earned badges
 * Displays badge emoji, name, and description with a pop-in animation
 * Automatically appears at the top of the screen when a badge is earned
 *
 * Props:
 * - badge (object): Badge object with emoji, name, desc properties
 */
export default function BadgeOverlay({ badge }) {
  return (
    <div style={{
      position: 'fixed',
      top: 80,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 300,
      background: 'white',
      padding: '16px 28px',
      borderRadius: 20,
      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
      animation: 'popIn 0.4s ease',
      textAlign: 'center',
      minWidth: 220
    }}>
      <div style={{
        fontSize: 14,
        color: '#888',
        fontWeight: 600
      }}>NEW BADGE!</div>
      <div style={{ fontSize: 44 }}>{badge.emoji}</div>
      <div style={{
        fontSize: 18,
        fontWeight: 700,
        color: '#2B579A'
      }}>{badge.name}</div>
      <div style={{
        fontSize: 14,
        color: '#888'
      }}>{badge.desc}</div>
    </div>
  );
}
