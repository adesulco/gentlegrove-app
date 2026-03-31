import React, { useState, useEffect, useRef } from 'react';
import ScoreHUD from '../shared/ScoreHUD';
import CorrectAnswerReveal from '../shared/CorrectAnswerReveal';
import { MATHS_SEEDLINGS, MATHS_EXPLORERS, MATHS_NAVIGATORS } from '../../data';

/**
 * MathsGame - Numbers Garden maths game
 * Players solve maths questions with visual aids
 * Includes hint system (tier 0-3): 8s tier 1, 15s tier 2, 3 consecutive wrong = tier 3
 *
 * Props:
 * - phase: 'seedlings', 'explorers', or 'navigators'
 * - onComplete: callback({ correct, total, xp })
 * - settings: { theme, fontSize }
 * - companionEmoji: emoji string
 * - companionName: name string
 */

export default function MathsGame({ phase, onComplete, settings, companionEmoji, companionName }) {
  const mathSets = { seedlings: MATHS_SEEDLINGS, explorers: MATHS_EXPLORERS, navigators: MATHS_NAVIGATORS };
  const questions = mathSets[phase] || MATHS_SEEDLINGS;
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);
  const [hintTier, setHintTier] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const hintRef = useRef(null);
  const hint2Ref = useRef(null);

  useEffect(() => {
    setHintTier(0);
    hintRef.current = setTimeout(() => setHintTier(1), 8000);
    hint2Ref.current = setTimeout(() => setHintTier(2), 15000);
    return () => { clearTimeout(hintRef.current); clearTimeout(hint2Ref.current); };
  }, [current]);

  useEffect(() => { if (consecutiveWrong >= 3) setHintTier(3); }, [consecutiveWrong]);

  function advance() {
    if (current + 1 < questions.length) setCurrent(c => c + 1);
    else onComplete({ correct: correctCount, total: questions.length, xp });
  }

  function handleChoice(option) {
    if (feedback) return;
    clearTimeout(hintRef.current); clearTimeout(hint2Ref.current);
    const isCorrect = option === questions[current].answer;
    if (isCorrect) {
      setCorrectCount(c => c + 1); setConsecutiveWrong(0);
      setXp(x => x + (hintTier > 0 ? 5 : 10));
      setFeedback("correct");
      setTimeout(() => { setFeedback(null); advance(); }, 1500);
    } else {
      setConsecutiveWrong(c => c + 1);
      setXp(x => x + 2); setFeedback("wrong");
      setTimeout(() => { setFeedback("reveal"); }, 1200);
    }
  }

  function handleNextAfterWrong() { setFeedback(null); advance(); }

  const q = questions[current];
  const bgColor = settings.theme === "warm" ? "#FFFDE7" : settings.theme === "neutral" ? "#F8F8F6" : "#FFFFF0";

  return (
    <div style={{ padding: 20 }}>
      <ScoreHUD correct={correctCount} total={current} xp={xp} companionEmoji={companionEmoji} companionName={companionName} />
      <div style={{ fontSize: 16, color: "#888", marginBottom: 14 }}>Question {current + 1} of {questions.length}</div>
      <div style={{ background: bgColor, borderRadius: 20, padding: 28, textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 18, color: "#666", marginBottom: 10, fontWeight: 600 }}>{q.question}</div>
        <div style={{ fontSize: 32, marginBottom: 14, letterSpacing: 4, fontWeight: 700, color: "#333" }}>{q.visual}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
        {q.options.map((option, i) => {
          const isAnswer = option === q.answer;
          return (
            <button key={i} onClick={() => handleChoice(option)}
              style={{ padding: "16px 28px", borderRadius: 18, border: "3px solid",
                borderColor: (hintTier >= 1 && isAnswer) ? "#FFD54F" : feedback === "reveal" && isAnswer ? "#4CAF50" : "#e0e0e0",
                background: feedback === "reveal" && isAnswer ? "#E8F8E8" : (hintTier >= 2 && isAnswer) ? "#FFFDE7" : "white",
                cursor: feedback ? "default" : "pointer", fontSize: settings.fontSize,
                fontWeight: 700, color: "#444", transition: "all 0.2s", minWidth: 64,
                opacity: feedback === "reveal" && !isAnswer ? 0.4 : 1,
                animation: (hintTier >= 2 && isAnswer) ? "glow 1.5s ease-in-out infinite" : "none" }}>
              {option}
              {hintTier >= 3 && isAnswer && <div style={{ fontSize: 12, color: "#F9A825" }}>👉 Try this!</div>}
            </button>
          );
        })}
      </div>
      {feedback === "correct" && (
        <div style={{ textAlign: "center", padding: 18, background: "#E8F8E8", borderRadius: 16, marginTop: 18, animation: "popIn 0.3s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#2E8B57", fontWeight: 700, fontSize: 18, marginTop: 4 }}>Excellent maths! {companionName} loves numbers!</div>
          {q.teach && <div style={{ color: "#666", fontSize: 14, marginTop: 6, fontStyle: "italic" }}>{q.teach}</div>}
        </div>
      )}
      {feedback === "wrong" && (
        <div style={{ textAlign: "center", padding: 18, background: "#FFF8E8", borderRadius: 16, marginTop: 18, animation: "shake 0.4s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#B8860B", fontWeight: 600, fontSize: 18, marginTop: 4 }}>Not quite -- let us see the answer!</div>
        </div>
      )}
      {feedback === "reveal" && (
        <div style={{ marginTop: 18 }}>
          <CorrectAnswerReveal text={q.answer} onNext={handleNextAfterWrong} />
          {q.teach && <div style={{ textAlign: "center", color: "#666", fontSize: 14, marginTop: 8, fontStyle: "italic", padding: "0 20px" }}>{q.teach}</div>}
        </div>
      )}
    </div>
  );
}
