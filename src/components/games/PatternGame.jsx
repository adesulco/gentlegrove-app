import React, { useState } from 'react';
import ScoreHUD from '../shared/ScoreHUD';
import CorrectAnswerReveal from '../shared/CorrectAnswerReveal';
import { PATTERNS_SEEDLINGS, PATTERNS_EXPLORERS, PATTERNS_NAVIGATORS } from '../../data';

/**
 * PatternGame - Puzzle Forest pattern completion game
 * Players complete sequences by selecting the next item
 *
 * Props:
 * - phase: 'seedlings', 'explorers', or 'navigators'
 * - onComplete: callback({ correct, total, xp })
 * - settings: { theme, fontSize }
 * - companionEmoji: emoji string
 * - companionName: name string
 */

export default function PatternGame({ phase, onComplete, settings, companionEmoji, companionName }) {
  const patternSets = { seedlings: PATTERNS_SEEDLINGS, explorers: PATTERNS_EXPLORERS, navigators: PATTERNS_NAVIGATORS };
  const patterns = patternSets[phase] || PATTERNS_SEEDLINGS;
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);

  function advance() {
    if (current + 1 < patterns.length) setCurrent(c => c + 1);
    else onComplete({ correct: correctCount, total: patterns.length, xp });
  }

  function handleChoice(option) {
    if (feedback) return;
    const isCorrect = option === patterns[current].answer;
    if (isCorrect) {
      setCorrectCount(c => c + 1);
      setXp(x => x + 10);
      setFeedback("correct");
      setTimeout(() => { setFeedback(null); advance(); }, 1500);
    } else {
      setXp(x => x + 2);
      setFeedback("wrong");
      setTimeout(() => { setFeedback("reveal"); }, 1200);
    }
  }

  function handleNextAfterWrong() { setFeedback(null); advance(); }

  const pattern = patterns[current];
  const bgColor = settings.theme === "warm" ? "#FFF5EE" : settings.theme === "neutral" ? "#F8F8F6" : "#FFF8F0";

  return (
    <div style={{ padding: 20 }}>
      <ScoreHUD correct={correctCount} total={current + (feedback ? 1 : 0)} xp={xp} companionEmoji={companionEmoji} companionName={companionName} />
      <div style={{ fontSize: 16, color: "#888", marginBottom: 14 }}>Pattern {current + 1} of {patterns.length}</div>
      <div style={{ background: bgColor, borderRadius: 20, padding: 28, textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 18, color: "#666", marginBottom: 14, fontWeight: 600 }}>What comes next in the pattern?</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
          {pattern.sequence.map((item, i) => (
            <div key={i} style={{ width: 56, height: 56, borderRadius: 14, background: "white",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, border: "2px solid #e0e0e0" }}>{item}</div>
          ))}
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#E8F4FD",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
            border: "2px dashed #2B579A", color: "#2B579A", fontWeight: 700 }}>?</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
        {pattern.options.map((option, i) => (
          <button key={i} onClick={() => handleChoice(option)}
            style={{ width: 70, height: 70, borderRadius: 18, border: "3px solid",
              borderColor: feedback === "reveal" && option === pattern.answer ? "#4CAF50" : "#e0e0e0",
              background: feedback === "reveal" && option === pattern.answer ? "#E8F8E8" : "white",
              cursor: feedback ? "default" : "pointer", fontSize: 34,
              display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
              opacity: feedback === "reveal" && option !== pattern.answer ? 0.4 : 1 }}>{option}</button>
        ))}
      </div>
      {feedback === "correct" && (
        <div style={{ textAlign: "center", padding: 18, background: "#E8F8E8", borderRadius: 16, marginTop: 18, animation: "popIn 0.3s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#2E8B57", fontWeight: 700, fontSize: 18, marginTop: 4 }}>Great pattern spotting! {companionName} is amazed!</div>
        </div>
      )}
      {feedback === "wrong" && (
        <div style={{ textAlign: "center", padding: 18, background: "#FFF8E8", borderRadius: 16, marginTop: 18, animation: "shake 0.4s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#B8860B", fontWeight: 600, fontSize: 18, marginTop: 4 }}>Not that one -- let us see!</div>
        </div>
      )}
      {feedback === "reveal" && (
        <div style={{ marginTop: 18 }}>
          <CorrectAnswerReveal text="This one!" emoji={pattern.answer} onNext={handleNextAfterWrong} />
          {pattern.teach && <div style={{ textAlign: "center", color: "#666", fontSize: 14, marginTop: 8, fontStyle: "italic", padding: "0 20px" }}>{pattern.teach}</div>}
        </div>
      )}
    </div>
  );
}
