import React, { useState, useEffect } from 'react';
import { BRIDGE_PROMPTS } from './data';

/**
 * BridgePrompt - Offline adventure suggestion with fast typewriter effect
 * Shows a random bridge prompt for the biome with characters appearing quickly.
 * Can be embedded in quest complete screen (set embedded=true to hide button).
 *
 * Props:
 * - biomeId (string): ID of the biome to get prompt for
 * - onContinue (function): Callback when "Back to Treehouse" button is clicked
 * - embedded (boolean): If true, hides the "Back to Treehouse" button (parent handles nav)
 */
export default function BridgePrompt({ biomeId, onContinue, embedded = false }) {
  const prompts = BRIDGE_PROMPTS[biomeId] || BRIDGE_PROMPTS.harmony;
  const [prompt] = useState(() => prompts[Math.floor(Math.random() * prompts.length)]);
  const [visibleChars, setVisibleChars] = useState(0);
  const fullText = prompt.steps || '';
  const isTyping = visibleChars < fullText.length;

  // Faster typewriter: 8ms per char instead of 30ms
  useEffect(() => {
    if (visibleChars < fullText.length) {
      const timer = setTimeout(() => setVisibleChars((v) => v + 1), 8);
      return () => clearTimeout(timer);
    }
  }, [visibleChars, fullText.length]);

  return (
    <div style={{
      textAlign: 'center',
      padding: 24,
      background: '#FEFCE8',
      borderRadius: 20,
      margin: '16px 0',
      border: '2px solid #FDE68A',
      animation: 'slideUp 0.4s ease'
    }}>
      <div style={{
        fontSize: 15,
        color: '#92400E',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8
      }}>
        ⭐ Offline Adventure
      </div>
      {prompt.title && <div style={{
        fontSize: 20,
        color: '#78350F',
        fontWeight: 800,
        marginBottom: 10
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
        minHeight: 60
      }}>
        {fullText.substring(0, visibleChars)}
        {isTyping && <span style={{ animation: 'pulse 1s infinite' }}>▌</span>}
      </div>
      {/* Show "Back to Treehouse" only when not embedded and typing is done */}
      {!embedded && !isTyping && (
        <button onClick={onContinue}
          style={{
            padding: '14px 36px',
            borderRadius: 20,
            border: 'none',
            background: '#F59E0B',
            color: 'white',
            fontSize: 17,
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
