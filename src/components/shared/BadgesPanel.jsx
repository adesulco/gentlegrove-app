import React from 'react';
import { BADGES } from './data';

/**
 * BadgesPanel - Full-screen modal showing all badges
 * Displays earned badges in color and locked badges grayed out
 * 2-column grid layout
 *
 * Props:
 * - badges (array): Array of badge objects (optional - will import from data)
 * - earnedBadges (Set): Set of earned badge IDs
 * - playerName (string): Player name to display in title
 * - onClose (function): Callback when close button is clicked
 */
export default function BadgesPanel({ earnedBadges, playerName, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      zIndex: 250,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}
    onClick={onClose}>
      <div style={{
        background: 'white',
        borderRadius: 24,
        padding: 28,
        maxWidth: 400,
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        animation: 'slideUp 0.3s ease'
      }}
      onClick={(e) => e.stopPropagation()}>
        <h2 style={{
          color: '#2B579A',
          fontSize: 24,
          margin: '0 0 16px',
          textAlign: 'center'
        }}>{playerName}'s Badges</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12
        }}>
          {BADGES.map((b) => {
            const earned = earnedBadges.has(b.id);
            return (
              <div key={b.id} style={{
                padding: 14,
                borderRadius: 16,
                textAlign: 'center',
                background: earned ? '#F0FFF4' : '#f5f5f5',
                border: earned ? '2px solid #7EC8E3' : '2px solid #e0e0e0',
                opacity: earned ? 1 : 0.5
              }}>
                <div style={{ fontSize: 32 }}>
                  {earned ? b.emoji : '🔒'}
                </div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: earned ? '#333' : '#aaa'
                }}>{b.name}</div>
                <div style={{
                  fontSize: 12,
                  color: '#888'
                }}>{b.desc}</div>
              </div>
            );
          })}
        </div>
        <button onClick={onClose}
          style={{
            marginTop: 18,
            width: '100%',
            padding: 12,
            borderRadius: 16,
            border: 'none',
            background: '#2B579A',
            color: 'white',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer'
          }}>
          Close
        </button>
      </div>
    </div>
  );
}
