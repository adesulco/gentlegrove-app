import React from 'react';
import { AGE_GROUPS } from '../../data/constants';

/**
 * AgeGroupStep - Onboarding Step 1: Age group selection
 * Child selects their age group from three options:
 * - Seedlings 🌱 (Ages 3-5)
 * - Explorers 🌿 (Ages 6-8)
 * - Navigators 🌸 (Ages 9-12)
 *
 * @param {string} playerName - Child's name for greeting
 * @param {string} phase - Currently selected phase (seedlings, explorers, navigators)
 * @param {function} onSelect - Callback with (phase) when age group is selected
 * @param {function} onNext - Callback to proceed to next step
 * @param {object} theme - Theme object with colors (accent, bg)
 */
export default function AgeGroupStep({
  playerName,
  phase,
  onSelect,
  onNext,
  theme = {}
}) {
  const themeDefaults = {
    accent: "#2B579A",
    bg: "#F0F7FF",
    ...theme
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${themeDefaults.bg} 0%, #E8F4FD 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 28
      }}
    >
      <h2
        style={{
          fontSize: 28,
          color: themeDefaults.accent,
          margin: "0 0 8px 0"
        }}
      >
        Hi, {playerName}!
      </h2>

      <p
        style={{
          color: "#777",
          fontSize: 18,
          marginBottom: 24
        }}
      >
        Pick your age group:
      </p>

      <div
        style={{
          display: "flex",
          gap: 14,
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: 28
        }}
      >
        {AGE_GROUPS.map((group) => (
          <button
            key={group.id}
            onClick={() => onSelect(group.id)}
            style={{
              padding: "18px 26px",
              borderRadius: 18,
              border:
                phase === group.id
                  ? `3px solid ${themeDefaults.accent}`
                  : "3px solid #e0e0e0",
              background: phase === group.id ? themeDefaults.bg : "white",
              cursor: "pointer",
              minWidth: 100,
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (phase !== group.id) {
                e.currentTarget.style.borderColor = "#ccc";
              }
            }}
            onMouseLeave={(e) => {
              if (phase !== group.id) {
                e.currentTarget.style.borderColor = "#e0e0e0";
              }
            }}
          >
            <div style={{ fontSize: 36 }}>{group.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#444" }}>
              {group.label}
            </div>
            <div style={{ fontSize: 13, color: "#999" }}>{group.ages}</div>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        style={{
          padding: "14px 48px",
          borderRadius: 24,
          border: "none",
          background: themeDefaults.accent,
          color: "white",
          fontSize: 20,
          fontWeight: 700,
          cursor: "pointer",
          transition: "opacity 0.2s ease"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Next
      </button>
    </div>
  );
}
