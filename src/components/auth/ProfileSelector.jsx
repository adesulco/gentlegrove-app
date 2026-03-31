import React, { useState } from 'react';

/**
 * ProfileSelector - Child profile selection screen
 * Displays existing child profiles and allows creating a new one
 *
 * @param {object} childProfiles - Object with child usernames as keys and profile data as values
 * @param {function} onSelectChild - Callback with (username) when child profile selected
 * @param {function} onAddChild - Callback with (username) when new child created
 * @param {function} onSignOut - Callback when Sign Out button clicked
 * @param {object} theme - Theme object with colors (accent, bg)
 */
export default function ProfileSelector({
  childProfiles = {},
  onSelectChild,
  onAddChild,
  onSignOut,
  theme = {}
}) {
  const [newUsername, setNewUsername] = useState("");

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

  const btnSecondary = {
    background: "none",
    border: "none",
    fontSize: 15,
    color: "#888",
    cursor: "pointer",
    textDecoration: "underline",
    marginTop: 20
  };

  const children = Object.keys(childProfiles);

  const handleAddChild = () => {
    if (newUsername.trim()) {
      onAddChild(newUsername.trim());
      setNewUsername("");
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
          margin: "0 0 4px 0"
        }}
      >
        Who's Playing?
      </h2>
      <p
        style={{
          color: "#777",
          fontSize: 15,
          marginBottom: 24
        }}
      >
        Select a child profile or create one
      </p>

      {children.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 24
          }}
        >
          {children.map((username) => {
            const profile = childProfiles[username];
            const companionEmoji = profile?.companion?.emoji || "🐾";

            return (
              <button
                key={username}
                onClick={() => onSelectChild(username)}
                style={{
                  padding: "20px 28px",
                  borderRadius: 20,
                  border: "3px solid #e0e0e0",
                  background: "white",
                  cursor: "pointer",
                  textAlign: "center",
                  minWidth: 120,
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = themeDefaults.accent)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e0e0e0")}
              >
                <div style={{ fontSize: 40 }}>{companionEmoji}</div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 17,
                    color: "#444",
                    marginTop: 4
                  }}
                >
                  {profile?.playerName || username}
                </div>
                {profile?.totalXp > 0 && (
                  <div style={{ fontSize: 13, color: "#888" }}>
                    Lv.{profile.level || 1} • {profile.totalXp} XP
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div style={{ width: "100%", maxWidth: 340, textAlign: "center" }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#555",
            marginBottom: 8
          }}
        >
          {children.length > 0 ? "Or add another child:" : "Create a child profile:"}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Child's username"
            onKeyDown={(e) => e.key === "Enter" && handleAddChild()}
            style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
          />
          <button
            onClick={handleAddChild}
            style={{
              padding: "14px 20px",
              borderRadius: 14,
              border: "none",
              background: themeDefaults.accent,
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Add
          </button>
        </div>
        <button onClick={onSignOut} style={btnSecondary}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
