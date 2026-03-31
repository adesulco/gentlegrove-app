import React from 'react';
import { BIOMES, companionStage } from '../data/constants';

/**
 * TreehouseHub - Main treehouse hub screen
 * Optimized for kids ages 3-12 on tablet devices (768px+)
 * Large touch targets, readable text, simple layout
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
        padding: "16px 20px 24px"
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 48, marginBottom: 4 }}>
          {companionEmoji}
        </div>
        <h2 style={{ margin: "0 0 4px 0", color: themeDefaults.accent, fontSize: 28, fontWeight: 800, fontFamily: "'Nunito', sans-serif" }}>
          The Treehouse
        </h2>
        <p style={{ color: "#666", fontSize: 17, margin: "0", fontFamily: "'Inter', sans-serif" }}>
          Where to, {playerName}?
        </p>
      </div>

      {/* Companion Progress */}
      <div
        style={{
          background: "white",
          borderRadius: 18,
          padding: "14px 18px",
          marginBottom: 16,
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, color: "#555", marginBottom: 6 }}>
          {companionName} {cStage.suffix}
        </div>
        <div style={{ fontSize: 15, color: "#888", marginBottom: 8 }}>
          {cStage.label} • {totalXp} XP to next stage
        </div>
        <div
          style={{
            height: 14,
            background: "#e8e8e8",
            borderRadius: 7,
            overflow: "hidden",
            marginBottom: 4
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #7EC8E3, #2B579A)",
              borderRadius: 7,
              width: `${xpProgress}%`,
              transition: "width 0.3s ease"
            }}
          />
        </div>
        <div style={{ fontSize: 14, color: "#999" }}>
          {totalXp >= 50 ? totalXp - Math.floor(totalXp / 50) * 50 : totalXp}/50 XP
        </div>
      </div>

      {/* Biomes Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 16
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
                padding: "18px 14px",
                borderRadius: 18,
                border: "2px solid #e0e0e0",
                background: "white",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                position: "relative",
                minHeight: 110
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
              <div style={{ fontSize: 36, marginBottom: 6 }}>{biome.emoji}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#333", marginBottom: 4, fontFamily: "'Nunito', sans-serif" }}>
                {biome.name}
              </div>
              <div style={{ fontSize: 14, color: "#666", marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>
                {biome.skill}
              </div>
              <div style={{ fontSize: 14, color: "#FFD54F", fontWeight: 600 }}>
                {"⭐".repeat(Math.min(stars_count, 3))}
              </div>
              {isPlayed && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    fontSize: 18,
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
          borderRadius: 16,
          padding: "14px 18px",
          marginBottom: 16,
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 700, color: "#555", marginBottom: 6 }}>
          Level {level}
        </div>
        <div
          style={{
            height: 10,
            background: "#e8e8e8",
            borderRadius: 5,
            overflow: "hidden"
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #7EC8E3, #2B579A)",
              borderRadius: 5,
              width: `${levelProgress * 100}%`,
              transition: "width 0.3s ease"
            }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={onShowBadges}
          style={{
            flex: 1,
            padding: "14px 16px",
            borderRadius: 16,
            border: `2px solid ${themeDefaults.accent}`,
            background: "white",
            color: themeDefaults.accent,
            fontSize: 17,
            fontWeight: 700,
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
            padding: "14px 16px",
            borderRadius: 16,
            border: `2px solid ${themeDefaults.accent}`,
            background: "white",
            color: themeDefaults.accent,
            fontSize: 17,
            fontWeight: 700,
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
