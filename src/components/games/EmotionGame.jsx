import React, { useState, useEffect, useRef } from 'react';
import ScoreHUD from '../shared/ScoreHUD';
import CorrectAnswerReveal from '../shared/CorrectAnswerReveal';
import { EMOTIONS, SCENARIOS_SEEDLINGS, SCENARIOS_EXPLORERS, SCENARIOS_NAVIGATORS } from '../../data';

/**
 * EmotionGame - Harmony Meadow emotion matching game
 * Players match scenarios to the correct emotions
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

export default function EmotionGame({ phase, onComplete, settings, companionEmoji, companionName }) {
  const scenarioSets = { seedlings: SCENARIOS_SEEDLINGS, explorers: SCENARIOS_EXPLORERS, navigators: SCENARIOS_NAVIGATORS };
  const scenarios = scenarioSets[phase] || SCENARIOS_SEEDLINGS;
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);
  const [hintTier, setHintTier] = useState(0);
  const [options, setOptions] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const hintTimerRef = useRef(null);
  const hint2TimerRef = useRef(null);
  const isFirst = current === 0;

  useEffect(() => {
    const correct = scenarios[current].answer;
    const others = EMOTIONS.filter(e => e.name !== correct);
    const picked = shuffle(others).slice(0, 3);
    const correctEmotion = EMOTIONS.find(e => e.name === correct);
    setOptions(shuffle([correctEmotion, ...picked]));
    setHintTier(0);
    setAttempts(0);
    hintTimerRef.current = setTimeout(() => setHintTier(1), 8000);
    hint2TimerRef.current = setTimeout(() => setHintTier(2), 15000);
    return () => { clearTimeout(hintTimerRef.current); clearTimeout(hint2TimerRef.current); };
  }, [current, scenarios]);

  useEffect(() => {
    if (consecutiveWrong >= 3) setHintTier(3);
  }, [consecutiveWrong]);

  function advance() {
    if (current + 1 < scenarios.length) setCurrent(c => c + 1);
    else onComplete({ correct: correctCount, total: scenarios.length, xp });
  }

  function handleChoice(emotionName) {
    if (feedback) return;
    const isCorrect = emotionName === scenarios[current].answer;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    clearTimeout(hintTimerRef.current);
    clearTimeout(hint2TimerRef.current);

    if (isCorrect) {
      const pointsEarned = newAttempts === 1 ? 10 : 5;
      setCorrectCount(c => c + 1);
      setConsecutiveWrong(0);
      setXp(x => x + pointsEarned);
      setFeedback("correct");
      setTimeout(() => { setFeedback(null); advance(); }, 1500);
    } else {
      setConsecutiveWrong(c => c + 1);
      setXp(x => x + 2);
      setFeedback("wrong");
      setTimeout(() => { setFeedback("reveal"); }, 1200);
    }
  }

  function handleNextAfterWrong() { setFeedback(null); advance(); }

  const scenario = scenarios[current];
  const bgColor = settings.theme === "warm" ? "#FFF8F0" : settings.theme === "neutral" ? "#F8F8F6" : "#F0F7FF";

  return (
    <div style={{ padding: 20 }}>
      <ScoreHUD correct={correctCount} total={current} xp={xp} companionEmoji={companionEmoji} companionName={companionName} />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, alignItems: "center" }}>
        <span style={{ fontSize: 16, color: "#888" }}>{current + 1} of {scenarios.length}</span>
        <div style={{ display: "flex", gap: 5 }}>
          {scenarios.map((_, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: "50%",
              background: i < current ? "#7EC8E3" : i === current ? "#2B579A" : "#ddd" }} />
          ))}
        </div>
      </div>
      <div style={{ background: bgColor, borderRadius: 20, padding: 28, marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 14 }}>{scenario.visual}</div>
        <div style={{ fontSize: settings.fontSize, lineHeight: 1.6, color: "#333", fontWeight: 500 }}>{scenario.text}</div>
        {isFirst && <div style={{ fontSize: 15, color: "#2B579A", marginTop: 10, fontWeight: 600, background: "#E8F4FD", padding: "8px 14px", borderRadius: 12, display: "inline-block" }}>
          👉 Tap the emotion that matches!
        </div>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        {options.map((emotion) => {
          const isAnswer = emotion.name === scenario.answer;
          const showHintBorder = (hintTier >= 1 && isAnswer);
          const showStrongHint = (hintTier >= 2 && isAnswer);
          const showDirectHint = (hintTier >= 3 && isAnswer);
          return (
            <button key={emotion.name} onClick={() => handleChoice(emotion.name)}
              style={{
                padding: "18px 14px", borderRadius: 18, border: "3px solid",
                borderColor: showHintBorder ? "#7EC8E3" : "#e0e0e0",
                background: feedback === "reveal" && isAnswer ? "#E8F8E8" : showDirectHint ? "#E8F4FD" : "white",
                cursor: feedback ? "default" : "pointer", transition: "all 0.2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                opacity: feedback === "reveal" && !isAnswer ? 0.4 : 1,
                transform: showStrongHint ? "scale(1.05)" : "none",
                animation: showStrongHint ? "glow 1.5s ease-in-out infinite" : "none",
              }}>
              <span style={{ fontSize: 42 }}>{emotion.emoji}</span>
              <span style={{ fontSize: settings.fontSize - 2, fontWeight: 600, color: "#444" }}>{emotion.name}</span>
              {showDirectHint && <span style={{ fontSize: 12, color: "#2B579A" }}>👉 Try this one!</span>}
            </button>
          );
        })}
      </div>
      {feedback === "correct" && (
        <div style={{ textAlign: "center", padding: 18, background: "#E8F8E8", borderRadius: 16, animation: "popIn 0.3s ease" }}>
          <span style={{ fontSize: 36 }}>{companionEmoji}</span>
          <div style={{ color: "#2E8B57", fontWeight: 700, fontSize: 18, marginTop: 4 }}>
            Wonderful! {companionName} is so proud!
          </div>
          {attempts === 1 && <div style={{ color: "#4CAF50", fontSize: 14, marginTop: 4 }}>+10 XP (first try!)</div>}
          {scenario.teach && <div style={{ color: "#666", fontSize: 14, marginTop: 8, fontStyle: "italic", maxWidth: 320, margin: "8px auto 0" }}>{scenario.teach}</div>}
        </div>
      )}
      {feedback === "wrong" && (
        <div style={{ textAlign: "center", padding: 18, background: "#FFF8E8", borderRadius: 16, animation: "shake 0.4s ease" }}>
          <span style={{ fontSize: 36 }}>{companionEmoji}</span>
          <div style={{ color: "#B8860B", fontWeight: 600, fontSize: 18, marginTop: 4 }}>Not quite -- let us see the answer!</div>
          <div style={{ color: "#888", fontSize: 14, marginTop: 4 }}>+2 XP for trying!</div>
        </div>
      )}
      {feedback === "reveal" && (
        <div>
          <CorrectAnswerReveal text={scenario.answer} emoji={EMOTIONS.find(e => e.name === scenario.answer)?.emoji} onNext={handleNextAfterWrong} />
          {scenario.teach && <div style={{ textAlign: "center", color: "#666", fontSize: 14, marginTop: 8, fontStyle: "italic", padding: "0 20px" }}>{scenario.teach}</div>}
        </div>
      )}
    </div>
  );
}
