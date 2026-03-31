import React, { useState } from 'react';
import { COMPANIONS } from '../../data/constants';

/**
 * CompanionStep - Onboarding Step 2: Companion selection and naming
 * Child chooses a companion (Fox, Owl, Bunny, or Cat) and gives it a name
 *
 * @param {function} onComplete - Callback with (companion, companionName) when complete
 * @param {object} theme - Theme object with colors (accent, bg)
 */
export default function CompanionStep({ onComplete, theme = {} }) {
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [companionName, setCompanionName] = useState("");

  const themeDefaults = {
    accent: "#2B579A",
    bg: "#F0F7FF",
    ...theme
  };

  const handleComplete = () => {
    if (selectedCompanion && companionName.trim()) {
      onComplete(selectedCompanion, companionName.trim());
    }
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
        Choose a Companion!
      </h2>

      <p
        style={{
          color: "#777",
          fontSize: 16,
          marginBottom: 24,
          textAlign: "center",
          maxWidth: 300
        }}
      >
        This friend will join you on every quest and grow as you learn!
      </p>

      <div
        style={{
          display: "flex",
          gap: 16,
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: 24
        }}
      >
        {COMPANIONS.map((companion) => (
          <button
            key={companion.id}
            onClick={() => {
              setSelectedCompanion(companion);
              setCompanionName("");
            }}
            style={{
              padding: "20px 24px",
              borderRadius: 20,
              border:
                selectedCompanion?.id === companion.id
                  ? `3px solid ${themeDefaults.accent}`
                  : "3px solid #e0e0e0",
              background:
                selectedCompanion?.id === companion.id ? "#E8F4FD" : "white",
              cursor: "pointer",
              minWidth: 90,
              textAlign: "center",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (selectedCompanion?.id !== companion.id) {
                e.currentTarget.style.borderColor = "#ccc";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCompanion?.id !== companion.id) {
                e.currentTarget.style.borderColor = "#e0e0e0";
              }
            }}
          >
            <div style={{ fontSize: 48 }}>{companion.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#444", marginTop: 4 }}>
              {companion.name}
            </div>
          </button>
        ))}
      </div>

      {selectedCompanion && (
        <div
          style={{
            width: "100%",
            maxWidth: 320,
            textAlign: "center",
            marginBottom: 20
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: 18,
              fontWeight: 600,
              color: "#555",
              marginBottom: 8
            }}
          >
            Name your {selectedCompanion.name}:
          </label>
          <input
            type="text"
            value={companionName}
            onChange={(e) => setCompanionName(e.target.value)}
            placeholder={`Give your ${selectedCompanion.name} a name...`}
            style={{
              width: "100%",
              padding: "14px 18px",
              fontSize: 20,
              borderRadius: 14,
              border: "3px solid #ddd",
              outline: "none",
              textAlign: "center",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease"
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && companionName.trim()) {
                handleComplete();
              }
            }}
            onFocus={(e) => {
              e.target.style.borderColor = themeDefaults.accent;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#ddd";
            }}
            autoFocus
          />
        </div>
      )}

      <button
        onClick={handleComplete}
        disabled={!selectedCompanion || !companionName.trim()}
        style={{
          padding: "14px 48px",
          borderRadius: 24,
          border: "none",
          background:
            selectedCompanion && companionName.trim()
              ? themeDefaults.accent
              : "#ccc",
          color: "white",
          fontSize: 20,
          fontWeight: 700,
          cursor:
            selectedCompanion && companionName.trim() ? "pointer" : "default",
          transition: "background 0.2s ease"
        }}
      >
        Next
      </button>
    </div>
  );
}
