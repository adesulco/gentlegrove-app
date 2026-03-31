import React, { useState, useEffect } from 'react';
import * as dataService from '../../services/dataService';

/**
 * ProfileSelector - Child profile selection screen
 * Loads existing children from database and displays them as selectable cards.
 * Allows adding a new child (triggers onboarding flow).
 *
 * @param {string} parentId - Firebase UID of the logged-in parent
 * @param {function} onSelectChild - Callback with (username, profile) when child selected
 * @param {function} onAddChild - Callback to start adding a new child (goes to onboarding)
 * @param {function} onSignOut - Callback when Sign Out button clicked
 * @param {object} theme - Theme object with colors (accent, bg)
 */
export default function ProfileSelector({
  parentId,
  onSelectChild,
  onAddChild,
  onSignOut,
  theme = {}
}) {
  const [childProfiles, setChildProfiles] = useState({});
  const [loading, setLoading] = useState(true);

  const themeDefaults = {
    accent: "#2B579A",
    bg: "#F0F7FF",
    ...theme
  };

  // Load children from database on mount or when parentId changes
  useEffect(() => {
    async function loadChildren() {
      if (!parentId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const profiles = await dataService.getChildrenProfiles(parentId);
        setChildProfiles(profiles || {});
      } catch (err) {
        console.error('Error loading children:', err);
        setChildProfiles({});
      } finally {
        setLoading(false);
      }
    }
    loadChildren();
  }, [parentId]);

  const children = Object.keys(childProfiles);

  const AGE_LABELS = {
    seedlings: 'Ages 3–5',
    explorers: 'Ages 6–8',
    navigators: 'Ages 9–12',
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: `linear-gradient(180deg, ${themeDefaults.bg} 0%, #E8F4FD 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: 22, color: "#888" }}>Loading profiles...</div>
      </div>
    );
  }

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
      <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍👩‍👧‍👦</div>
      <h2
        style={{
          fontSize: 30,
          color: themeDefaults.accent,
          fontWeight: 800,
          margin: "0 0 6px 0"
        }}
      >
        Who's Playing?
      </h2>
      <p
        style={{
          color: "#777",
          fontSize: 17,
          marginBottom: 28
        }}
      >
        {children.length > 0
          ? "Select a child to start playing"
          : "Add your first child to get started!"}
      </p>

      {/* Existing child cards */}
      {children.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 28,
            maxWidth: 600,
          }}
        >
          {children.map((username) => {
            const profile = childProfiles[username];
            const companionEmoji = profile?.companion?.emoji || "🐾";
            const ageLabel = AGE_LABELS[profile?.phase] || '';

            return (
              <button
                key={username}
                onClick={() => onSelectChild(username, profile)}
                style={{
                  padding: "22px 30px",
                  borderRadius: 22,
                  border: "3px solid #e0e0e0",
                  background: "white",
                  cursor: "pointer",
                  textAlign: "center",
                  minWidth: 140,
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = themeDefaults.accent;
                  e.currentTarget.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e0e0e0";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 6 }}>{companionEmoji}</div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 19,
                    color: "#444",
                    marginBottom: 2,
                  }}
                >
                  {profile?.playerName || username}
                </div>
                {ageLabel && (
                  <div style={{
                    fontSize: 14,
                    color: themeDefaults.accent,
                    fontWeight: 600,
                    marginBottom: 2,
                  }}>
                    {ageLabel}
                  </div>
                )}
                {profile?.totalXp > 0 && (
                  <div style={{ fontSize: 14, color: "#888", fontWeight: 600 }}>
                    Lv.{profile.level || 1} • {profile.totalXp} XP
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Add Child button */}
      <button
        onClick={onAddChild}
        style={{
          padding: "16px 40px",
          borderRadius: 22,
          border: `3px dashed ${themeDefaults.accent}`,
          background: "transparent",
          color: themeDefaults.accent,
          fontSize: 18,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          transition: "all 0.2s ease",
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: 24 }}>➕</span>
        {children.length > 0 ? "Add Another Child" : "Add Your First Child"}
      </button>

      {/* Sign Out */}
      <button
        onClick={onSignOut}
        style={{
          background: "none",
          border: "none",
          fontSize: 16,
          color: "#888",
          cursor: "pointer",
          textDecoration: "underline",
          marginTop: 8,
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
