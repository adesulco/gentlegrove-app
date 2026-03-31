import React, { useState } from 'react';

/**
 * RegisterScreen - Parent account creation form
 * Allows new parents to register with email/mobile and PIN
 *
 * @param {function} onRegister - Callback with (contact, pin) when account is created
 * @param {function} onBack - Callback to return to welcome screen
 * @param {string} error - Error message to display
 * @param {object} theme - Theme object with colors (accent, bg)
 */
export default function RegisterScreen({ onRegister, onBack, error = "", theme = {} }) {
  const [contact, setContact] = useState("");
  const [pin, setPin] = useState("");

  const themeDefaults = {
    accent: "#2B579A",
    bg: "#F0F7FF",
    ...theme
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 18px",
    fontSize: 18,
    borderRadius: 14,
    border: "3px solid #ddd",
    outline: "none",
    textAlign: "center",
    marginBottom: 12
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
    marginTop: 12
  };

  const handleSubmit = () => {
    if (contact.trim() && pin.length >= 4) {
      onRegister(contact.trim(), pin);
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
        Create Parent Account
      </h2>
      <p
        style={{
          color: "#777",
          fontSize: 15,
          marginBottom: 24,
          textAlign: "center",
          maxWidth: 300
        }}
      >
        Parents create the account. Kids play with their own profile!
      </p>

      <div style={{ width: "100%", maxWidth: 340 }}>
        <label
          style={{
            display: "block",
            fontSize: 15,
            fontWeight: 600,
            color: "#555",
            marginBottom: 6
          }}
        >
          Email or Mobile Number
        </label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="parent@email.com or +1234567890"
          style={inputStyle}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <label
          style={{
            display: "block",
            fontSize: 15,
            fontWeight: 600,
            color: "#555",
            marginBottom: 6
          }}
        >
          Create a PIN (4+ digits)
        </label>
        <input
          type="text"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="e.g. 1234"
          style={inputStyle}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        {error && (
          <div
            style={{
              color: "#C62828",
              fontSize: 14,
              marginBottom: 10,
              textAlign: "center"
            }}
          >
            {error}
          </div>
        )}

        <button onClick={handleSubmit} style={btnPrimary}>
          Create Account
        </button>

        <div style={{ textAlign: "center" }}>
          <button onClick={onBack} style={btnSecondary}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
