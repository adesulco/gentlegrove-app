import React from 'react';

/**
 * SensoryMenu - Settings panel that slides in from the right
 * Provides accessibility and sensory preference settings:
 * Color Theme, Animation Speed, Sound, Text Size, Reduce Motion, Screen Time Limit
 *
 * Props:
 * - settings (object): Current settings object with theme, animSpeed, sound, fontSize, reduceMotion, screenTime
 * - onChange (function): Callback when any setting changes, receives updated settings object
 * - onClose (function): Callback when close button is clicked
 */
export default function SensoryMenu({ settings, onChange, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: 300,
      background: 'rgba(255,255,255,0.98)',
      boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
      padding: 28,
      zIndex: 100,
      overflowY: 'auto',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <h3 style={{
          color: '#2B579A',
          fontSize: 20,
          margin: 0
        }}>Settings</h3>
        <button onClick={onClose} style={{
          background: 'none',
          border: 'none',
          fontSize: 24,
          cursor: 'pointer',
          color: '#888'
        }}>✕</button>
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={{
          display: 'block',
          marginBottom: 8,
          fontWeight: 600,
          fontSize: 16,
          color: '#555'
        }}>Color Theme</label>
        {['cool', 'warm', 'neutral'].map((t) => (
          <button key={t} onClick={() => onChange({ ...settings, theme: t })}
            style={{
              padding: '10px 18px',
              marginRight: 8,
              marginBottom: 6,
              borderRadius: 20,
              border: settings.theme === t ? '2px solid #2B579A' : '2px solid #ddd',
              background: settings.theme === t ? '#E8F4FD' : 'white',
              cursor: 'pointer',
              fontSize: 15
            }}>
            {t === 'cool' ? '🔵 Cool Blues' : t === 'warm' ? '🟠 Warm Earth' : '⚪ Soft Neutral'}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={{
          display: 'block',
          marginBottom: 8,
          fontWeight: 600,
          fontSize: 16,
          color: '#555'
        }}>Animation Speed</label>
        <input type="range" min="0.5" max="2" step="0.25" value={settings.animSpeed}
          onChange={(e) => onChange({ ...settings, animSpeed: parseFloat(e.target.value) })}
          style={{ width: '100%' }} />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 14,
          color: '#888'
        }}>
          <span>Slow</span><span>Medium</span><span>Fast</span>
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={{
          display: 'block',
          marginBottom: 8,
          fontWeight: 600,
          fontSize: 16,
          color: '#555'
        }}>Sound Effects</label>
        <button onClick={() => onChange({ ...settings, sound: !settings.sound })}
          style={{
            padding: '10px 22px',
            borderRadius: 20,
            cursor: 'pointer',
            border: '2px solid #ddd',
            background: settings.sound ? '#E8F8E8' : '#FEE8E8',
            fontSize: 15
          }}>
          {settings.sound ? '🔊 On' : '🔇 Off'}
        </button>
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={{
          display: 'block',
          marginBottom: 8,
          fontWeight: 600,
          fontSize: 16,
          color: '#555'
        }}>Text Size</label>
        <input type="range" min="18" max="30" step="2" value={settings.fontSize}
          onChange={(e) => onChange({ ...settings, fontSize: parseInt(e.target.value) })}
          style={{ width: '100%' }} />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 14,
          color: '#888'
        }}>
          <span>Standard</span><span>Larger</span>
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <label style={{
          display: 'block',
          marginBottom: 8,
          fontWeight: 600,
          fontSize: 16,
          color: '#555'
        }}>Reduce Motion</label>
        <button onClick={() => onChange({ ...settings, reduceMotion: !settings.reduceMotion })}
          style={{
            padding: '10px 22px',
            borderRadius: 20,
            cursor: 'pointer',
            border: '2px solid #ddd',
            background: settings.reduceMotion ? '#E8F8E8' : 'white',
            fontSize: 15
          }}>
          {settings.reduceMotion ? '✓ Enabled' : 'Disabled'}
        </button>
      </div>

      <div>
        <label style={{
          display: 'block',
          marginBottom: 8,
          fontWeight: 600,
          fontSize: 16,
          color: '#555'
        }}>Screen Time Limit</label>
        <div style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap'
        }}>
          {[15, 30, 45, 0].map((m) => (
            <button key={m} onClick={() => onChange({ ...settings, screenTime: m })}
              style={{
                padding: '10px 16px',
                borderRadius: 20,
                cursor: 'pointer',
                border: settings.screenTime === m ? '2px solid #2B579A' : '2px solid #ddd',
                background: settings.screenTime === m ? '#E8F4FD' : 'white',
                fontSize: 14
              }}>
              {m === 0 ? 'Off' : `${m} min`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
