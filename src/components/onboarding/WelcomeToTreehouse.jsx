import React from 'react';

/**
 * WelcomeToTreehouse - Onboarding Step 3: Welcome and intro
 * Shows the companion with growth stage preview
 * Displays treehouse intro and options to enter or adjust settings
 * Displays the companion emoji bouncing, growth stages preview, and treehouse intro text
 *
 * @param {object} companion - Companion object with emoji and stages
 * @param {string} companionName - Name given to the companion
 * @param {function} onEnter - Callback to enter the treehouse
 * @param {function} onSettings - Callback to adjust settings
 * @param {object} theme - Theme object with colors (accent, bg)
 */
export default function WelcomeToTreehouse({
  companion,
  companionName,
  onEnter,
  onSettings,
  theme = {}
}) {
  const themeDefaults = {
    accent: "#2B579A",
    bg: "#F0F7FF",
    ...theme
  };

  const companionEmoji = companion?.emoji || "🐾";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${themeDefaults.bg} 0%, #E8F4FD 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
        textAlign: "center"
      }}
    >
      <div style={{ fontSize: 72, marginBottom: 12, animation: "bounce 1s ease infinite" }}>
        {companionEmoji}
      </div>

      <h2
        style={{
          fontSize: 28,
          color: themeDefaults.accent,
          margin: "0 0 8px 0"
        }}
      >
        Meet {companionName}!
      </h2>

      <p
        style={{
          color: "#777",
          fontSize: 17,
          marginBottom: 8,
          maxWidth: 320
        }}
      >
        {companionName} is still very little, but will grow as you learn together!
      </p>

      <div style={{ fontSize: 36, marginBottom: 20 }}>
        {companionEmoji}🐾 → {companionEmoji}💕 → {companionEmoji}✨
      </div>

      <div
        style={{
          background: "#F0F7FF",
          borderRadius: 16,
          padding: 18,
          maxWidth: 340,
          marginBottom: 24
        }}
      >
        <div style={{ fontSize: 16, color: "#555", fontWeight: 600 }}>
          🏡 The Treehouse is your home base!
        </div>
        <div style={{ fontSize: 15, color: "#888", marginTop: 6 }}>
          Tap any path to start a learning quest. {companionName} will be with you every step!
        </div>
      </div>

      <button
        onClick={onEnter}
        style={{
          padding: "16px 56px",
          borderRadius: 24,
          border: "none",
          background: themeDefaults.accent,
          color: "white",
          fontSize: 20,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: `0 4px 15px rgba(43, 87, 154, 0.3)`,
          transition: "transform 0.2s ease, box-shadow 0.2s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = `0 6px 20px rgba(43, 87, 154, 0.4)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = `0 4px 15px rgba(43, 87, 154, 0.3)`;
        }}
      >
        Enter the Treehouse!
      </button>

      <button
        onClick={onSettings}
        style={{
          background: "none",
          border: "none",
          fontSize: 15,
          color: "#888",
          cursor: "pointer",
          marginTop: 14,
          textDecoration: "underline",
          transition: "color 0.2s ease"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = themeDefaults.accent)}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
      >
        Adjust Settings First
      </button>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
