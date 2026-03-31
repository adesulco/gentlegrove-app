import React from 'react';
import { BIOMES, companionStage } from '../data/constants';

/**
 * TreehouseHub - Main treehouse hub screen
 * Shows:
 * - Treehouse title and welcome message
 * - Companion display with growth progress bar and stage label
 * - 7 biome buttons in a grid (each shows emoji, name, skill, star count, explored checkmark)
 * - Level/XP progress bar
 * - Badges and Change Player buttons
 *
 * @param {string} playerName - Child's name
 * @param {string} phase - Age phase (seedlings, explorers, navigators)
 * @param {object} companion - Companion object
 * @param {string} companionName - Name given to companion
 * @param {number} totalXp - Total experience points
 * @param {number} level - Current level
 * @param {number} stars - Total stars earned
 * @param {Set} biomesPlayed - Set of biome IDs that have been played
 * @param {object} biomeStars - Object with biome IDs as keys and star counts as values
 * @param {Set} earnedBadges - Set of earned badge IDs
 * @param {function} onStartQuest - Callback with (biome) when biome is selected
 * @param {function} onShowBadges - Callback to show badges panel
 * @param {function} onChangePlayer - Callback to change player
 * @param {object} theme - Theme object with colors (accent, bg)
 */
export default function TreehouseHub({
  playerName = "Player",
  phase = "seedlings",
  companion,
  companionName = "Companion",
  totalXp = 0,
  level = 1,
  stars = 0,
  biomesPlayed = new Set(),
  biomeStars = {},
  earnedBadges = new Set(),
  onStartQuest = () => {},
  onShowBadges = () => {},
  onChangePlayer = () => {},
  theme = {}
}) {
  const themeDefaults = {
    accent: "#2B579A",
    bg: "#F0F7FF",
    secondary: "#7EC8E3",
    ...theme
  };

  const companionEmoji = companion?.emoji || "🐾";
  const cStage = companionStage(totalXp, companion);
  const xpToNextLevel = Math.min(totalXp % 50, 49);
  const xpProgress = (xpToNextLevel / 50) * 100;
  const levelProgress = ((level - 1) * 50 + totalXp - Math.floor(totalXp / 50) * 50) / 50;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: themeDefaults.bg,
        position: "relative",
        padding: 20
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#555",
            marginBottom: 4
          }}
        >
          {companionEmoji}
        </div>
        <h2 style={{ margin: "0 0 4px 0", color: themeDefaults.accent, fontSize: 24 }}>
          The Treehouse
        </h2>
        <p style={{ color: "#777", fontSize: 16, margin: "0" }}>
          Where to, {playerName}? ({phase})
        </p>
      </div>

      {/* Companion Progress */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 600, color: "#555", marginBottom: 8 }}>
          {companionName} {cStage.suffix}
        </div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
          {cStage.label} • {totalXp} XP to next stage
        </div>
        <div
          style={{
            height: 12,
            background: "#e8e8e8",
            borderRadius: 6,
            overflow: "hidden",
            marginBottom: 4
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #7EC8E3, #2B579A)",
              borderRadius: 4,
              width: `${xpProgress}%`,
              transition: "width 0.3s ease"
            }}
          />
        </div>
        <div style={{ fontSize: 12, color: "#999" }}>
          {totalXp >= 50 ? totalXp - Math.floor(totalXp / 50) * 50 : totalXp}/50 XP
        </div>
      </div>

      {/* Biomes Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 20
        }}
      >
        {BIOMES.map((biome) => {
          const isPlayed = biomesPlayed.has(biome.id);
          const stars_count = biomeStars[biome.id] || 0;

          return (
            <button
              key={biome.id}
              onClick={() => onStartQuest(biome)}
              style={{
                padding: 16,
                borderRadius: 14,
                border: "2px solid #e0e0e0",
                background: "white",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                position: "relative"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = themeDefaults.accent;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e0e0e0";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>{biome.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 4 }}>
                {biome.name}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>
                {biome.skill}
              </div>
              <div style={{ fontSize: 12, color: "#FFD54F", fontWeight: 600 }}>
                {"⭐".repeat(Math.min(stars_count, 3))}
              </div>
              {isPlayed && (
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    fontSize: 16,
                    opacity: 0.6
                  }}
                >
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Level Progress */}
      <div
        style={{
          background: "white",
          borderRadius: 14,
          padding: 14,
          marginBottom: 20,
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: "#555", marginBottom: 6 }}>
          Level {level}
        </div>
        <div
          style={{
            height: 8,
            background: "#e8e8e8",
            borderRadius: 4,
            overflow: "hidden"
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #7EC8E3, #2B579A)",
              borderRadius: 4,
              width: `${levelProgress * 100}%`,
              transition: "width 0.3s ease"
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onShowBadges}
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: 14,
            border: `2px solid ${themeDefaults.accent}`,
            background: "white",
            color: themeDefaults.accent,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = themeDefaults.accent;
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.color = themeDefaults.accent;
          }}
        >
          Badges ({earnedBadges.size})
        </button>
        <button
          onClick={onChangePlayer}
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: 14,
            border: `2px solid ${themeDefaults.accent}`,
            background: "white",
            color: themeDefaults.accent,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = themeDefaults.accent;
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.color = themeDefaults.accent;
          }}
        >
          Change Player
        </button>
      </div>
    </div>
  );
}
