import React, { useState, useEffect } from 'react';
import { BRIDGE_PROMPTS } from './data';

/**
 * BridgePrompt - Offline adventure suggestion with typewriter effect
 * Shows one of the bridge prompts with characters appearing one at a time
 * Includes "Show all" button while typing and "Back to Treehouse" when done
 *
 * Props:
 * - biomeId (string): ID of the biome to get prompt for
 * - onContinue (function): Callback when "Back to Treehouse" button is clicked
 */
export default function BridgePrompt({ biomeId, onContinue }) {
  const prompts = BRIDGE_PROMPTS[biomeId] || BRIDGE_PROMPTS.harmony;
  const [prompt] = useState(() => prompts[Math.floor(Math.random() * prompts.length)]);
  const [visibleChars, setVisibleChars] = useState(0);
  const fullText = prompt.steps || '';
  const isTyping = visibleChars < fullText.length;

  useEffect(() => {
    if (visibleChars < fullText.length) {
      const timer = setTimeout(() => setVisibleChars((v) => v + 1), 30);
      return () => clearTimeout(timer);
    }
  }, [visibleChars, fullText.length]);

  return (
    <div style={{
      textAlign: 'center',
      padding: 28,
      background: '#FEFCE8',
      borderRadius: 20,
      margin: '20px 0',
      border: '2px solid #FDE68A',
      animation: 'slideUp 0.4s ease'
    }}>
      <div style={{
        fontSize: 14,
        color: '#92400E',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8
      }}>
        ⭐ Offline Adventure
      </div>
      {prompt.title && <div style={{
        fontSize: 22,
        color: '#78350F',
        fontWeight: 800,
        marginBottom: 12
      }}>{prompt.title}</div>}
      <div style={{
        fontSize: 17,
        color: '#5D4037',
        fontWeight: 500,
        lineHeight: 1.8,
        marginBottom: 20,
        maxWidth: 380,
        margin: '0 auto 20px',
        textAlign: 'left',
        minHeight: 80
      }}>
        {fullText.substring(0, visibleChars)}
        {isTyping && <span style={{ animation: 'pulse 1s infinite' }}>▌</span>}
      </div>
      {!isTyping && (
        <button onClick={onContinue}
          style={{
            padding: '14px 36px',
            borderRadius: 20,
            border: 'none',
            background: '#F59E0B',
            color: 'white',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            animation: 'fadeIn 0.5s ease'
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
            color: '#92400E',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer'
          }}>
          Show all
        </button>
      )}
    </div>
  );
}
