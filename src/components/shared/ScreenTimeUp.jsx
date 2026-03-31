import React from 'react';

/**
 * ScreenTimeUp - Full-screen "time for a break" message
 * Displays when the screen time limit is reached
 * Shows companion and offline activity suggestion
 *
 * Props:
 * - companionEmoji (string): Emoji of the companion
 * - companionName (string): Name of the companion
 * - onDismiss (function): Callback when "See you next time!" button is clicked
 */
export default function ScreenTimeUp({ companionEmoji, companionName, onDismiss }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(240,247,255,0.98)',
      zIndex: 300,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      padding: 28
    }}>
      <div style={{ fontSize: 80 }}>{companionEmoji}</div>
      <h2 style={{
        color: '#2B579A',
        fontSize: 28,
        textAlign: 'center'
      }}>Time for a break!</h2>
      <p style={{
        color: '#666',
        fontSize: 18,
        textAlign: 'center',
        maxWidth: 320
      }}>
        {companionName} is getting sleepy. Great job playing today!
      </p>
      <div style={{
        background: '#F0F7FF',
        borderRadius: 16,
        padding: 20,
        maxWidth: 340,
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: 15,
          color: '#888',
          fontWeight: 600,
          marginBottom: 6
        }}>Try this instead:</div>
        <div style={{
          fontSize: 17,
          color: '#2B579A',
          fontWeight: 600
        }}>Go outside and look for shapes in the clouds!</div>
      </div>
      <button onClick={onDismiss}
        style={{
          padding: '14px 40px',
          borderRadius: 24,
          border: 'none',
          marginTop: 12,
          background: '#2B579A',
          color: 'white',
          fontSize: 18,
          fontWeight: 700,
          cursor: 'pointer'
        }}>
        See you next time!
      </button>
    </div>
  );
}
