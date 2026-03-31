import React, { useState } from 'react';

/**
 * NameStep - Onboarding Step 0: Name entry
 * Asks the child for their name with a large input field
 * Displays GentleGrove logo and title
 *
 * @param {function} onSubmit - Callback with (name) when name is submitted
 * @param {object} theme - Theme object with colors (accent, bg)
 */
export default function NameStep({ onSubmit, theme = {} }) {
  const [name, setName] = useState("");

  const themeDefaults = {
    accent: "#2B579A",
    bg: "#F0F7FF",
    ...theme
  };

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim());
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
      <div style={{ animation: "float 3s ease-in-out infinite", marginBottom: 20 }}>
        <span style={{ fontSize: 80 }}>🏡</span>
      </div>

      <h1
        style={{
          fontSize: 44,
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
          fontSize: 18,
          margin: "0 0 32px 0",
          textAlign: "center",
          maxWidth: 320
        }}
      >
        A treehouse of learning adventures awaits!
      </p>

      <div style={{ width: "100%", maxWidth: 360, textAlign: "center" }}>
        <label
          style={{
            display: "block",
            fontSize: 20,
            fontWeight: 600,
            color: "#555",
            marginBottom: 10
          }}
        >
          What's your child's name?
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) {
              handleSubmit();
            }
          }}
          placeholder="Type your child's name here..."
          style={{
            width: "100%",
            padding: "16px 20px",
            fontSize: 22,
            borderRadius: 16,
            border: "3px solid #ddd",
            outline: "none",
            textAlign: "center",
            boxSizing: "border-box",
            transition: "border-color 0.2s ease"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = themeDefaults.accent;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#ddd";
          }}
          autoFocus
        />

        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          style={{
            marginTop: 20,
            padding: "14px 48px",
            borderRadius: 24,
            border: "none",
            background: name.trim() ? themeDefaults.accent : "#ccc",
            color: "white",
            fontSize: 20,
            fontWeight: 700,
            cursor: name.trim() ? "pointer" : "default",
            transition: "background 0.2s ease"
          }}
        >
          Next
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
