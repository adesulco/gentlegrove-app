import React, { useState } from 'react';

/**
 * SensoryMenu - Enhanced settings panel with neuroinclusive features
 * Slides in from the right with backdrop overlay.
 * Includes: Low-Stim Mode, Color Theme, Animation Speed, Sound, Text Size,
 * Reduce Motion, Screen Time Limit, and Visual Density.
 *
 * Low-Stim Mode: Mutes colors, disables animations, simplifies visuals.
 * Sets document attribute [data-low-stim] for CSS-level changes.
 *
 * Props:
 * - settings (object): Current settings
 * - onChange (function): Callback with updated settings
 * - onClose (function): Close callback
 */

const SECTION_STYLE = {
  marginBottom: 24,
  paddingBottom: 20,
  borderBottom: '1px solid #eee'
};

const LABEL_STYLE = {
  display: 'block',
  marginBottom: 10,
  fontWeight: 700,
  fontSize: 16,
  color: '#333',
  fontFamily: "'Nunito', sans-serif"
};

const CHIP_BASE = {
  padding: '10px 18px',
  marginRight: 8,
  marginBottom: 8,
  borderRadius: 20,
  cursor: 'pointer',
  fontSize: 15,
  fontWeight: 600,
  minHeight: 44,
  fontFamily: "'Nunito', sans-serif",
  transition: 'all 0.15s ease'
};

export default function SensoryMenu({ settings = {}, onChange = () => {}, onClose }) {
  const [activeSection, setActiveSection] = useState(null);

  const handleChange = (key, value) => {
    const updated = { ...settings, [key]: value };

    // When Low-Stim Mode is toggled, also set reduce motion and reduce animation speed
    if (key === 'lowStim') {
      if (value) {
        updated.reduceMotion = true;
        updated.animSpeed = 0.5;
        document.documentElement.setAttribute('data-low-stim', 'true');
      } else {
        document.documentElement.removeAttribute('data-low-stim');
      }
    }

    onChange(updated);
  };

  const isLowStim = settings.lowStim || false;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 99,
          animation: 'fadeIn 0.2s ease'
        }}
      />

      {/* Settings panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 320,
        maxWidth: '85vw',
        background: '#FAFAFA',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
        padding: '24px 22px',
        zIndex: 100,
        overflowY: 'auto',
        animation: 'slideInRight 0.25s ease',
        fontFamily: "'Inter', sans-serif"
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: '2px solid #E8F4FD'
        }}>
          <h3 style={{
            color: '#2B579A',
            fontSize: 22,
            margin: 0,
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800
          }}>Settings</h3>
          <button onClick={onClose} style={{
            background: '#F0F0F0',
            border: 'none',
            fontSize: 18,
            cursor: 'pointer',
            color: '#666',
            width: 44,
            height: 44,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700
          }} aria-label="Close settings">
            ✕
          </button>
        </div>

        {/* Low-Stim Mode (Priority Feature from Audit) */}
        <div style={{
          ...SECTION_STYLE,
          background: isLowStim ? '#E8F4FD' : '#FFF8E8',
          padding: 16,
          borderRadius: 16,
          border: isLowStim ? '2px solid #2B579A' : '2px solid #FDE68A',
          marginBottom: 24
        }}>
          <label style={{ ...LABEL_STYLE, color: '#2B579A', fontSize: 17 }}>
            Low-Stimulation Mode
          </label>
          <p style={{ fontSize: 13, color: '#666', marginBottom: 12, lineHeight: 1.5 }}>
            Mutes colors, disables animations, and simplifies visuals for a calmer experience.
          </p>
          <button
            onClick={() => handleChange('lowStim', !isLowStim)}
            style={{
              ...CHIP_BASE,
              border: isLowStim ? '2px solid #2B579A' : '2px solid #ddd',
              background: isLowStim ? '#2B579A' : 'white',
              color: isLowStim ? 'white' : '#666',
              padding: '12px 24px',
              fontSize: 16
            }}
            aria-pressed={isLowStim}
          >
            {isLowStim ? '🌙 Enabled — Calm Mode' : '☀️ Standard Mode'}
          </button>
        </div>

        {/* Color Theme */}
        <div style={SECTION_STYLE}>
          <label style={LABEL_STYLE}>Color Theme</label>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {[
              { key: 'cool', label: '🔵 Cool Blues', desc: 'Calm and focused' },
              { key: 'warm', label: '🟠 Warm Earth', desc: 'Cozy and grounded' },
              { key: 'neutral', label: '⚪ Soft Neutral', desc: 'Gentle and quiet' }
            ].map((t) => (
              <button key={t.key}
                onClick={() => handleChange('theme', t.key)}
                style={{
                  ...CHIP_BASE,
                  border: settings.theme === t.key ? '2px solid #2B579A' : '2px solid #e0e0e0',
                  background: settings.theme === t.key ? '#E8F4FD' : 'white',
                  color: settings.theme === t.key ? '#2B579A' : '#555'
                }}
                aria-pressed={settings.theme === t.key}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Size */}
        <div style={SECTION_STYLE}>
          <label style={LABEL_STYLE}>
            Text Size
            <span style={{ fontSize: 14, fontWeight: 400, color: '#888', marginLeft: 8 }}>
              {settings.fontSize || 22}px
            </span>
          </label>
          <input type="range" min="18" max="30" step="2"
            value={settings.fontSize || 22}
            onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
            style={{ width: '100%' }}
            aria-label="Text size slider"
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 13,
            color: '#888',
            marginTop: 4
          }}>
            <span>Smaller</span><span>Standard</span><span>Larger</span>
          </div>
        </div>

        {/* Animation Speed */}
        <div style={SECTION_STYLE}>
          <label style={LABEL_STYLE}>Animation Speed</label>
          <input type="range" min="0.5" max="2" step="0.25"
            value={settings.animSpeed || 1}
            onChange={(e) => handleChange('animSpeed', parseFloat(e.target.value))}
            style={{ width: '100%' }}
            disabled={isLowStim}
            aria-label="Animation speed slider"
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 13,
            color: isLowStim ? '#bbb' : '#888',
            marginTop: 4
          }}>
            <span>Slower</span><span>Normal</span><span>Faster</span>
          </div>
          {isLowStim && (
            <div style={{ fontSize: 12, color: '#999', marginTop: 6, fontStyle: 'italic' }}>
              Animations are paused in Low-Stim Mode
            </div>
          )}
        </div>

        {/* Sound Effects */}
        <div style={SECTION_STYLE}>
          <label style={LABEL_STYLE}>Sound Effects</label>
          <button
            onClick={() => handleChange('sound', !settings.sound)}
            style={{
              ...CHIP_BASE,
              border: '2px solid #e0e0e0',
              background: settings.sound ? '#E8F8E8' : '#FEE8E8',
              color: settings.sound ? '#2E8B57' : '#C62828',
              padding: '12px 24px'
            }}
            aria-pressed={settings.sound}
          >
            {settings.sound ? '🔊 Sound On' : '🔇 Sound Off'}
          </button>
        </div>

        {/* Reduce Motion */}
        <div style={SECTION_STYLE}>
          <label style={LABEL_STYLE}>Reduce Motion</label>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 10, lineHeight: 1.5 }}>
            Minimizes movement on screen for comfort.
          </p>
          <button
            onClick={() => handleChange('reduceMotion', !settings.reduceMotion)}
            style={{
              ...CHIP_BASE,
              border: settings.reduceMotion ? '2px solid #2B579A' : '2px solid #e0e0e0',
              background: settings.reduceMotion ? '#E8F4FD' : 'white',
              color: settings.reduceMotion ? '#2B579A' : '#666',
              padding: '12px 24px'
            }}
            aria-pressed={settings.reduceMotion}
          >
            {settings.reduceMotion ? '✓ Motion Reduced' : 'Standard Motion'}
          </button>
        </div>

        {/* Screen Time Limit */}
        <div style={{ marginBottom: 16 }}>
          <label style={LABEL_STYLE}>Screen Time Limit</label>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 10, lineHeight: 1.5 }}>
            A gentle reminder when time is up. No content is locked.
          </p>
          <div style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap'
          }}>
            {[15, 30, 45, 0].map((m) => (
              <button key={m}
                onClick={() => handleChange('screenTime', m)}
                style={{
                  ...CHIP_BASE,
                  border: settings.screenTime === m ? '2px solid #2B579A' : '2px solid #e0e0e0',
                  background: settings.screenTime === m ? '#E8F4FD' : 'white',
                  color: settings.screenTime === m ? '#2B579A' : '#666',
                  padding: '10px 18px'
                }}
                aria-pressed={settings.screenTime === m}
              >
                {m === 0 ? 'No Limit' : `${m} min`}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: '16px 0 8px',
          borderTop: '1px solid #eee',
          marginTop: 8
        }}>
          <div style={{ fontSize: 12, color: '#999' }}>
            GentleGrove v0.6 — Settings are saved automatically
          </div>
        </div>
      </div>
    </>
  );
}
