import React, { useState, useEffect } from 'react';
import { BRIDGE_PROMPTS } from './data';

/**
 * BridgePrompt - Offline adventure suggestion with fast typewriter effect
 * Shows a random bridge prompt for the biome.
 * Can be embedded in quest complete screen (set embedded=true to hide button).
 * Brand colors: Warm Amber accents, Soft Brown text.
 *
 * Props:
 * - biomeId (string): ID of the biome to get prompt for
 * - onContinue (function): Callback when "Back to Treehouse" button is clicked
 * - embedded (boolean): If true, hides the "Back to Treehouse" button
 */
export default function BridgePrompt({ biomeId, onContinue, embedded = false }) {
  const prompts = BRIDGE_PROMPTS[biomeId] || BRIDGE_PROMPTS.harmony;
  const [prompt] = useState(() => prompts[Math.floor(Math.random() * prompts.length)]);
  const [visibleChars, setVisibleChars] = useState(0);
  const fullText = prompt.steps || '';
  const isTyping = visibleChars < fullText.length;

  useEffect(() => {
    if (visibleChars < fullText.length) {
      const timer = setTimeout(() => setVisibleChars((v) => v + 1), 8);
      return () => clearTimeout(timer);
    }
  }, [visibleChars, fullText.length]);

  return (
    <div style={{
      textAlign: 'center',
      padding: 22,
      background: '#FEFCE8',
      borderRadius: 20,
      margin: '16px 0',
      border: '2px solid #FDE68A',
      animation: 'slideUp 0.4s ease'
    }}>
      <div style={{
        fontSize: 14,
        color: '#D4943A',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
        fontFamily: "'Nunito', sans-serif"
      }}>
        Try This at Home
      </div>
      {prompt.title && <div style={{
        fontSize: 20,
        color: '#8B5E3C',
        fontWeight: 800,
        marginBottom: 10,
        fontFamily: "'Nunito', sans-serif"
      }}>{prompt.title}</div>}
      <div style={{
        fontSize: 16,
        color: '#5D4037',
        fontWeight: 500,
        lineHeight: 1.7,
        marginBottom: 16,
        maxWidth: 380,
        margin: '0 auto 16px',
        textAlign: 'left',
        minHeight: 60,
        fontFamily: "'Inter', sans-serif"
      }}>
        {fullText.substring(0, visibleChars)}
        {isTyping && <span style={{ animation: 'pulse 1s infinite', color: '#D4943A' }}>▌</span>}
      </div>
      {!embedded && !isTyping && (
        <button onClick={onContinue}
          style={{
            padding: '14px 36px',
            borderRadius: 22,
            border: 'none',
            background: '#D4943A',
            color: 'white',
            fontSize: 17,
            fontWeight: 700,
            cursor: 'pointer',
            animation: 'fadeIn 0.5s ease',
            fontFamily: "'Nunito', sans-serif",
            minHeight: 48
          }}>
          Back to Treehouse
        </button>
      )}
      {isTyping && (
        <button onClick={() => setVisibleChars(fullText.length)}
          style={{
            padding: '10px 24px',
            borderRadius: 16,
            border: '1px solid #FDE68A',
            background: 'transparent',
            color: '#D4943A',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            minHeight: 44
          }}>
          Show all
        </button>
      )}
    </div>
  );
}
