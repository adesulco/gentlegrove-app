import React, { useState, useEffect, useMemo } from 'react';
import ScoreHUD from '../shared/ScoreHUD';
import { ROUTINES } from '../../data';
import { shuffleArray } from '../../utils/questionEngine';

/**
 * RoutineGame - Home Harbor routine sequencing game
 * Players tap steps in the correct order to complete a routine
 * Uses inline feedback (tryAgain) that clears after 1.5s
 *
 * Props:
 * - phase: 'seedlings', 'explorers', or 'navigators'
 * - onComplete: callback({ correct, total, xp })
 * - settings: { theme, fontSize }
 * - companionEmoji: emoji string
 * - companionName: name string
 */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RoutineGame({ phase, onComplete, settings, companionEmoji, companionName }) {
  const routine = ROUTINES[phase] || ROUTINES.seedlings;
  const shuffledSteps = useMemo(() => shuffleArray(routine.steps), [routine.steps]);
  const [shuffled, setShuffled] = useState([]);
  const [placed, setPlaced] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  useEffect(() => { setShuffled(shuffledSteps); setPlaced([]); }, [phase, routine, shuffledSteps]);

  function handleTap(step) {
    if (feedback === "complete") return;
    const nextIndex = placed.length;
    const expected = routine.steps[nextIndex];
    if (step.id === expected.id) {
      const newPlaced = [...placed, step];
      setPlaced(newPlaced);
      setShuffled(s => s.filter(ss => ss.id !== step.id));
      setCorrectCount(c => c + 1);
      setXp(x => x + 10);
      if (newPlaced.length === routine.steps.length) {
        setFeedback("complete");
        setTimeout(() => onComplete({ correct: correctCount + 1, total: routine.steps.length, xp: xp + 10 }), 2500);
      }
    } else {
      setWrongCount(w => w + 1);
      setXp(x => x + 1);
      setFeedback("tryAgain");
      setTimeout(() => setFeedback(null), 1500);
    }
  }

  const bgColor = settings.theme === "warm" ? "#FDF5FF" : settings.theme === "neutral" ? "#F8F8F6" : "#F5F0FF";

  return (
    <div style={{ padding: 20 }}>
      <ScoreHUD correct={correctCount} total={correctCount + wrongCount} xp={xp} companionEmoji={companionEmoji} companionName={companionName} />
      <div style={{ background: bgColor, borderRadius: 20, padding: 22, marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#555", marginBottom: 8 }}>{routine.title}</div>
        <div style={{ fontSize: settings.fontSize - 2, color: "#888", marginBottom: 16 }}>Tap the steps in the right order!</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {routine.steps.map((step, i) => {
            const done = placed.find(p => p.id === step.id);
            return (
              <div key={step.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                borderRadius: 14, background: done ? "#E8F8E8" : "#f0f0f0",
                border: done ? "2px solid #7EC8E3" : "2px dashed #ccc", transition: "all 0.3s" }}>
                <span style={{ width: 32, height: 32, borderRadius: "50%", background: done ? "#7EC8E3" : "#ddd",
                  color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 26 }}>{done ? step.emoji : "❓"}</span>
                <span style={{ fontSize: settings.fontSize - 2, color: done ? "#333" : "#bbb" }}>{done ? step.text : "..."}</span>
              </div>
            );
          })}
        </div>
      </div>
      {shuffled.length > 0 && (
        <div>
          <div style={{ fontSize: 16, color: "#888", marginBottom: 10, textAlign: "center" }}>What comes next? (Step {placed.length + 1})</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {shuffled.map((step) => (
              <button key={step.id} onClick={() => handleTap(step)}
                style={{ padding: "14px 18px", borderRadius: 16, border: "2px solid #e0e0e0",
                  background: "white", cursor: "pointer", display: "flex", alignItems: "center",
                  gap: 10, fontSize: settings.fontSize - 2, transition: "all 0.2s" }}>
                <span style={{ fontSize: 26 }}>{step.emoji}</span>{step.text}
              </button>
            ))}
          </div>
        </div>
      )}
      {feedback === "tryAgain" && (
        <div style={{ textAlign: "center", padding: 14, background: "#FFF8E8", borderRadius: 16, marginTop: 18, animation: "gentlePulse 0.4s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#B8860B", fontWeight: 600, fontSize: 18 }}>Good thinking! Try another step — you are getting closer!</div>
        </div>
      )}
      {feedback === "complete" && (
        <div style={{ textAlign: "center", padding: 18, background: "#E8F8E8", borderRadius: 16, marginTop: 18, animation: "popIn 0.4s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#4A7C59", fontWeight: 700, fontSize: 18 }}>Perfect routine! {companionName} is so happy!</div>
        </div>
      )}
    </div>
  );
}
