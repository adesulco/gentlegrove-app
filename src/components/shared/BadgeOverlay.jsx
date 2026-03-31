import React, { useEffect } from 'react';

/**
 * BadgeOverlay - Pop-up notification for newly earned badges
 * Displays badge emoji, name, and description with a pop-in animation
 * Includes a dismiss button and auto-dismisses after 5 seconds
 *
 * Props:
 * - badge (object): Badge object with emoji, name, desc properties
 * - onContinue (function): Callback to dismiss the overlay
 */
export default function BadgeOverlay({ badge, onContinue }) {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (onContinue) {
      const timer = setTimeout(() => onContinue(), 5000);
      return () => clearTimeout(timer);
    }
  }, [onContinue]);

  return (
    <div
      onClick={onContinue}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 299,
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          padding: '28px 36px',
          borderRadius: 24,
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          animation: 'popIn 0.4s ease',
          textAlign: 'center',
          minWidth: 260,
          maxWidth: 340,
          position: 'relative'
        }}
      >
        <div style={{
          fontSize: 16,
          color: '#888',
          fontWeight: 600,
          marginBottom: 8,
          letterSpacing: 1
        }}>NEW BADGE!</div>
        <div style={{ fontSize: 56, marginBottom: 8 }}>{badge.emoji}</div>
        <div style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#2B579A',
          marginBottom: 6
        }}>{badge.name}</div>
        <div style={{
          fontSize: 16,
          color: '#888',
          marginBottom: 20
        }}>{badge.desc}</div>
        <button
          onClick={onContinue}
          style={{
            padding: '12px 40px',
            borderRadius: 20,
            border: 'none',
            background: '#2B579A',
            color: 'white',
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            width: '100%'
          }}
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
