import React, { useState, useEffect } from 'react';

/**
 * BreathingPause - Full-screen breathing exercise overlay
 * Shows an animated circle with breathing phases: Breathe In, Hold, Breathe Out
 * Each phase lasts 4 seconds with visual feedback
 *
 * Props:
 * - onResume (function): Callback when "I'm Ready!" button is clicked
 */
export default function BreathingPause({ onResume }) {
  const [phase, setPhase] = useState('in');
  const [count, setCount] = useState(4);

  useEffect(() => {
    const t = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          setPhase((p) => (p === 'in' ? 'hold' : p === 'hold' ? 'out' : 'in'));
          return 4;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(240,247,255,0.97)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24
    }}>
      <div style={{
        fontSize: 24,
        color: '#2B579A',
        fontWeight: 700
      }}>Let's take a breath</div>

      <div style={{
        width: 130,
        height: 130,
        borderRadius: '50%',
        background: '#E8F4FD',
        border: '4px solid #7EC8E3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 600,
        color: '#2B579A',
        transform:
          phase === 'in' ? 'scale(1.2)' : phase === 'out' ? 'scale(0.8)' : 'scale(1)',
        transition: 'transform 4s ease-in-out'
      }}>
        {phase === 'in' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out'}
      </div>

      <div style={{
        fontSize: 40,
        fontWeight: 700,
        color: '#7EC8E3'
      }}>{count}</div>

      <button onClick={onResume} style={{
        padding: '14px 36px',
        borderRadius: 24,
        border: 'none',
        background: '#2B579A',
        color: 'white',
        fontSize: 18,
        fontWeight: 600,
        cursor: 'pointer',
        marginTop: 20
      }}>
        I'm Ready!
      </button>
    </div>
  );
}
