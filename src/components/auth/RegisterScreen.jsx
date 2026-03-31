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
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const themeDefaults = {
    accent: "#2B579A",
    bg: "#F0F7FF",
    ...theme
  };

  const inputStyle = {
    width: "100%",
    padding: "16px 20px",
    fontSize: 20,
    borderRadius: 16,
    border: "3px solid #ddd",
    outline: "none",
    textAlign: "center",
    marginBottom: 14,
    boxSizing: "border-box"
  };

  const btnPrimary = {
    padding: "16px 48px",
    borderRadius: 28,
    border: "none",
    background: loading ? "#999" : themeDefaults.accent,
    color: "white",
    fontSize: 20,
    fontWeight: 700,
    cursor: loading ? "not-allowed" : "pointer",
    width: "100%",
    marginTop: 8,
    transition: "all 0.2s ease"
  };

  const btnSecondary = {
    background: "none",
    border: "none",
    fontSize: 17,
    color: "#888",
    cursor: "pointer",
    textDecoration: "underline",
    marginTop: 14,
    padding: "8px 16px"
  };

  const handleSubmit = async () => {
    setLocalError("");
    if (!contact.trim()) {
      setLocalError("Please enter your email or mobile number");
      return;
    }
    if (pin.length < 4) {
      setLocalError("PIN must be at least 4 digits");
      return;
    }
    setLoading(true);
    try {
      await onRegister(contact.trim(), pin);
    } catch (err) {
      // Error will be shown via the error prop from AuthContext
      setLocalError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || error;

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
          fontSize: 30,
          color: themeDefaults.accent,
          margin: "0 0 8px 0"
        }}
      >
        Create Parent Account
      </h2>
      <p
        style={{
          color: "#777",
          fontSize: 17,
          marginBottom: 28,
          textAlign: "center",
          maxWidth: 340
        }}
      >
        Parents create the account. Kids play with their own profile!
      </p>

      <div style={{ width: "100%", maxWidth: 380 }}>
        <label
          style={{
            display: "block",
            fontSize: 17,
            fontWeight: 600,
            color: "#555",
            marginBottom: 8
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
          disabled={loading}
        />

        <label
          style={{
            display: "block",
            fontSize: 17,
            fontWeight: 600,
            color: "#555",
            marginBottom: 8
          }}
        >
          Create a PIN (4+ digits)
        </label>
        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          placeholder="e.g. 1234"
          style={inputStyle}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          maxLength={8}
          disabled={loading}
        />

        {displayError && (
          <div
            style={{
              color: "#C62828",
              fontSize: 16,
              marginBottom: 12,
              textAlign: "center",
              background: "#FFEBEE",
              padding: "10px 14px",
              borderRadius: 12,
              fontWeight: 500
            }}
          >
            {displayError}
          </div>
        )}

        <button onClick={handleSubmit} style={btnPrimary} disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <div style={{ textAlign: "center" }}>
          <button onClick={onBack} style={btnSecondary} disabled={loading}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
