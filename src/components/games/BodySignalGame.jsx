import React, { useState, useMemo } from 'react';
import ScoreHUD from '../shared/ScoreHUD';
import CorrectAnswerReveal from '../shared/CorrectAnswerReveal';
import { BODY_SIGNALS_SEEDLINGS, BODY_SIGNALS_EXPLORERS, BODY_SIGNALS_NAVIGATORS } from '../../data';
import { getRandomQuestions } from '../../utils/questionEngine';

/**
 * BodySignalGame - Rhythm Ridge body signal matching game
 * Three variants for different learning phases:
 * - Seedlings: Match body signal to emotion
 * - Explorers: Match emotion to body signal
 * - Navigators: Find helpful coping strategy
 *
 * Props:
 * - phase: 'seedlings', 'explorers', or 'navigators'
 * - onComplete: callback({ correct, total, xp })
 * - settings: { theme, fontSize }
 * - companionEmoji: emoji string
 * - companionName: name string
 */

function BodySignalSeedlings({ onComplete, settings, companionEmoji, companionName }) {
  const items = useMemo(() => getRandomQuestions(BODY_SIGNALS_SEEDLINGS, 5), []);
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);

  function advance() {
    if (current + 1 < items.length) setCurrent(c => c + 1);
    else onComplete({ correct: correctCount, total: items.length, xp });
  }

  function handleChoice(opt) {
    if (feedback) return;
    const isCorrect = opt === items[current].answer;
    if (isCorrect) {
      setCorrectCount(c => c + 1); setXp(x => x + 10);
      setFeedback("correct");
      setTimeout(() => { setFeedback(null); advance(); }, 1500);
    } else {
      setXp(x => x + 2); setFeedback("wrong");
      setTimeout(() => { setFeedback("reveal"); }, 1200);
    }
  }

  function handleNextAfterWrong() { setFeedback(null); advance(); }

  const item = items[current];
  return (
    <div style={{ padding: 20 }}>
      <ScoreHUD correct={correctCount} total={current + (feedback ? 1 : 0)} xp={xp} companionEmoji={companionEmoji} companionName={companionName} />
      <div style={{ fontSize: 16, color: "#888", marginBottom: 14 }}>{current + 1} of {items.length}</div>
      <div style={{ background: "#FFF0F0", borderRadius: 20, padding: 28, textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 56, marginBottom: 10 }}>{item.signalEmoji}</div>
        <div style={{ fontSize: settings.fontSize, color: "#333", fontWeight: 600 }}>{item.signal}</div>
        <div style={{ fontSize: 16, color: "#888", marginTop: 8 }}>How does this person feel?</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
        {item.options.map((opt, i) => {
          const isAnswer = opt === item.answer;
          return (
            <button key={i} onClick={() => handleChoice(opt)}
              style={{ padding: "16px 24px", borderRadius: 18, border: "3px solid",
                borderColor: feedback === "reveal" && isAnswer ? "#4CAF50" : "#e0e0e0",
                background: feedback === "reveal" && isAnswer ? "#E8F8E8" : "white",
                cursor: feedback ? "default" : "pointer", fontSize: settings.fontSize - 2,
                fontWeight: 600, color: "#444", transition: "all 0.2s",
                opacity: feedback === "reveal" && !isAnswer ? 0.4 : 1 }}>{opt}</button>
          );
        })}
      </div>
      {feedback === "correct" && (
        <div style={{ textAlign: "center", padding: 18, background: "#E8F8E8", borderRadius: 16, marginTop: 18, animation: "popIn 0.3s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#4A7C59", fontWeight: 700, fontSize: 18 }}>You know your body signals! {companionName} is impressed!</div>
        </div>
      )}
      {feedback === "wrong" && (
        <div style={{ textAlign: "center", padding: 18, background: "#FFF8E8", borderRadius: 16, marginTop: 18, animation: "gentlePulse 0.4s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#B8860B", fontWeight: 600, fontSize: 18 }}>Good try! Let's learn together.</div>
        </div>
      )}
      {feedback === "reveal" && (
        <div style={{ marginTop: 18 }}>
          <CorrectAnswerReveal text={item.answer} onNext={handleNextAfterWrong} />
          {item.teach && <div style={{ textAlign: "center", color: "#666", fontSize: 14, marginTop: 8, fontStyle: "italic", padding: "0 20px" }}>{item.teach}</div>}
        </div>
      )}
    </div>
  );
}

function BodySignalExplorers({ onComplete, settings, companionEmoji, companionName }) {
  const items = useMemo(() => getRandomQuestions(BODY_SIGNALS_EXPLORERS, 5), []);
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);

  function advance() {
    if (current + 1 < items.length) setCurrent(c => c + 1);
    else onComplete({ correct: correctCount, total: items.length, xp });
  }

  function handleChoice(opt) {
    if (feedback) return;
    const isCorrect = opt === items[current].signal;
    if (isCorrect) {
      setCorrectCount(c => c + 1); setXp(x => x + 10);
      setFeedback("correct");
      setTimeout(() => { setFeedback(null); advance(); }, 1500);
    } else {
      setXp(x => x + 2); setFeedback("wrong");
      setTimeout(() => { setFeedback("reveal"); }, 1200);
    }
  }

  function handleNextAfterWrong() { setFeedback(null); advance(); }

  const item = items[current];
  return (
    <div style={{ padding: 20 }}>
      <ScoreHUD correct={correctCount} total={current + (feedback ? 1 : 0)} xp={xp} companionEmoji={companionEmoji} companionName={companionName} />
      <div style={{ fontSize: 16, color: "#888", marginBottom: 14 }}>{current + 1} of {items.length}</div>
      <div style={{ background: "#FFF0F0", borderRadius: 20, padding: 28, textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 56, marginBottom: 10 }}>{item.signalEmoji}</div>
        <div style={{ fontSize: settings.fontSize, color: "#333", fontWeight: 600 }}>When I feel {item.emotion}, my body might...</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {item.options.map((opt, i) => {
          const isAnswer = opt === item.signal;
          return (
            <button key={i} onClick={() => handleChoice(opt)}
              style={{ padding: "16px 20px", borderRadius: 16, border: "3px solid",
                borderColor: feedback === "reveal" && isAnswer ? "#4CAF50" : "#e0e0e0",
                background: feedback === "reveal" && isAnswer ? "#E8F8E8" : "white",
                cursor: feedback ? "default" : "pointer", textAlign: "left",
                fontSize: settings.fontSize - 2, color: "#444", fontWeight: 500,
                opacity: feedback === "reveal" && !isAnswer ? 0.4 : 1 }}>{opt}</button>
          );
        })}
      </div>
      {feedback === "correct" && (
        <div style={{ textAlign: "center", padding: 18, background: "#E8F8E8", borderRadius: 16, marginTop: 18, animation: "popIn 0.3s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#4A7C59", fontWeight: 700, fontSize: 18 }}>Body signal expert! {companionName} is learning too!</div>
        </div>
      )}
      {feedback === "wrong" && (
        <div style={{ textAlign: "center", padding: 18, background: "#FFF8E8", borderRadius: 16, marginTop: 18, animation: "gentlePulse 0.4s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#B8860B", fontWeight: 600, fontSize: 18 }}>That's okay! Let's see together.</div>
        </div>
      )}
      {feedback === "reveal" && (
        <div style={{ marginTop: 18 }}>
          <CorrectAnswerReveal text={item.signal} onNext={handleNextAfterWrong} />
          {item.teach && <div style={{ textAlign: "center", color: "#666", fontSize: 14, marginTop: 8, fontStyle: "italic", padding: "0 20px" }}>{item.teach}</div>}
        </div>
      )}
    </div>
  );
}

function BodySignalNavigators({ onComplete, settings, companionEmoji, companionName }) {
  const items = useMemo(() => getRandomQuestions(BODY_SIGNALS_NAVIGATORS, 5), []);
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);

  function advance() {
    if (current + 1 < items.length) setCurrent(c => c + 1);
    else onComplete({ correct: correctCount, total: items.length, xp });
  }

  function handleChoice(opt) {
    if (feedback) return;
    const isCorrect = opt === items[current].helpful;
    if (isCorrect) {
      setCorrectCount(c => c + 1); setXp(x => x + 10);
      setFeedback("correct");
      setTimeout(() => { setFeedback(null); advance(); }, 1500);
    } else {
      setXp(x => x + 2); setFeedback("wrong");
      setTimeout(() => { setFeedback("reveal"); }, 1200);
    }
  }

  function handleNextAfterWrong() { setFeedback(null); advance(); }

  const item = items[current];
  return (
    <div style={{ padding: 20 }}>
      <ScoreHUD correct={correctCount} total={current + (feedback ? 1 : 0)} xp={xp} companionEmoji={companionEmoji} companionName={companionName} />
      <div style={{ fontSize: 16, color: "#888", marginBottom: 14 }}>Situation {current + 1} of {items.length}</div>
      <div style={{ background: "#FFF0F0", borderRadius: 20, padding: 24, textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 15, color: "#888", fontWeight: 600, marginBottom: 8 }}>What could help in this situation?</div>
        <div style={{ fontSize: settings.fontSize, color: "#333", fontWeight: 600, lineHeight: 1.5 }}>{item.situation}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {item.options.map((opt, i) => {
          const isAnswer = opt === item.helpful;
          return (
            <button key={i} onClick={() => handleChoice(opt)}
              style={{ padding: "16px 20px", borderRadius: 16, border: "3px solid",
                borderColor: feedback === "reveal" && isAnswer ? "#4CAF50" : "#e0e0e0",
                background: feedback === "reveal" && isAnswer ? "#E8F8E8" : "white",
                cursor: feedback ? "default" : "pointer", textAlign: "left",
                fontSize: settings.fontSize - 2, color: "#444", fontWeight: 500,
                opacity: feedback === "reveal" && !isAnswer ? 0.4 : 1 }}>{opt}</button>
          );
        })}
      </div>
      {feedback === "correct" && (
        <div style={{ textAlign: "center", padding: 18, background: "#E8F8E8", borderRadius: 16, marginTop: 18, animation: "popIn 0.3s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#4A7C59", fontWeight: 700, fontSize: 18 }}>Great strategy! {companionName} feels calmer already!</div>
        </div>
      )}
      {feedback === "wrong" && (
        <div style={{ textAlign: "center", padding: 18, background: "#FFF8E8", borderRadius: 16, marginTop: 18, animation: "gentlePulse 0.4s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#B8860B", fontWeight: 600, fontSize: 18 }}>Nice thinking! Here's another way.</div>
        </div>
      )}
      {feedback === "reveal" && (
        <div style={{ marginTop: 18 }}>
          <CorrectAnswerReveal text={item.helpful} onNext={handleNextAfterWrong} />
          {item.teach && <div style={{ textAlign: "center", color: "#666", fontSize: 14, marginTop: 8, fontStyle: "italic", padding: "0 20px" }}>{item.teach}</div>}
        </div>
      )}
    </div>
  );
}

export default function BodySignalGame({ phase, onComplete, settings, companionEmoji, companionName }) {
  if (phase === "seedlings") return <BodySignalSeedlings onComplete={onComplete} settings={settings} companionEmoji={companionEmoji} companionName={companionName} />;
  if (phase === "explorers") return <BodySignalExplorers onComplete={onComplete} settings={settings} companionEmoji={companionEmoji} companionName={companionName} />;
  if (phase === "navigators") return <BodySignalNavigators onComplete={onComplete} settings={settings} companionEmoji={companionEmoji} companionName={companionName} />;
}
