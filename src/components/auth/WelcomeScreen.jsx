import React from 'react';

/**
 * WelcomeScreen - Landing page for GentleGrove
 * Displays the app logo, title, and three action buttons:
 * - Sign In (existing parent account)
 * - Create Account (new parent account)
 * - Play as Guest (no progress saving)
 *
 * @param {function} onSignIn - Callback when Sign In button clicked
 * @param {function} onRegister - Callback when Create Account button clicked
 * @param {function} onGuest - Callback when Play as Guest button clicked
 * @param {object} theme - Theme object with colors (accent, bg)
 */
export default function WelcomeScreen({ onSignIn, onRegister, onGuest, theme = {} }) {
  const themeDefaults = {
    accent: "#2B579A",
    bg: "#F0F7FF",
    ...theme
  };

  const btnPrimary = {
    padding: "14px 48px",
    borderRadius: 24,
    border: "none",
    background: themeDefaults.accent,
    color: "white",
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%"
  };

  const btnSecondary = {
    background: "none",
    border: "none",
    fontSize: 15,
    color: "#888",
    cursor: "pointer",
    textDecoration: "underline",
    marginTop: 12,
    width: "100%"
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
      <div style={{ animation: "float 3s ease-in-out infinite", marginBottom: 20 }}>
        <span style={{ fontSize: 80 }}>🏡</span>
      </div>
      <h1
        style={{
          fontSize: 40,
          color: themeDefaults.accent,
          fontWeight: 800,
          margin: "0 0 8px 0",
          textAlign: "center"
        }}
      >
        GentleGrove
      </h1>
      <p
        style={{
          color: "#777",
          fontSize: 16,
          margin: "0 0 36px 0",
          textAlign: "center",
          maxWidth: 320
        }}
      >
        A treehouse of learning adventures for children on the autism spectrum
      </p>
      <div style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 14 }}>
        <button onClick={onSignIn} style={btnPrimary}>
          Sign In
        </button>
        <button
          onClick={onRegister}
          style={{
            ...btnPrimary,
            background: "white",
            color: themeDefaults.accent,
            border: `2px solid ${themeDefaults.accent}`
          }}
        >
          Create Account
        </button>
        <button onClick={onGuest} style={btnSecondary}>
          Play as Guest (progress will not be saved)
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
