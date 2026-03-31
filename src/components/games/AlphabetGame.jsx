import React, { useState, useMemo } from 'react';
import ScoreHUD from '../shared/ScoreHUD';
import CorrectAnswerReveal from '../shared/CorrectAnswerReveal';
import { ALPHA_SEEDLINGS, ALPHA_EXPLORERS, ALPHA_NAVIGATORS } from '../../data';
import { getRandomQuestions } from '../../utils/questionEngine';

/**
 * AlphabetGame - Alphabet Cove letters & words game
 * Seedlings: identify starting letter with emoji visual
 * Explorers/Navigators: word knowledge questions
 *
 * Props:
 * - phase: 'seedlings', 'explorers', or 'navigators'
 * - onComplete: callback({ correct, total, xp })
 * - settings: { theme, fontSize }
 * - companionEmoji: emoji string
 * - companionName: name string
 */

function AlphabetSeedlings({ onComplete, settings, companionEmoji, companionName }) {
  const items = useMemo(() => getRandomQuestions(ALPHA_SEEDLINGS, 6), []);
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);

  function advance() {
    if (current + 1 < items.length) setCurrent(c => c + 1);
    else onComplete({ correct: correctCount, total: items.length, xp });
  }

  function handleChoice(option) {
    if (feedback) return;
    const isCorrect = option === items[current].letter;
    if (isCorrect) {
      setCorrectCount(c => c + 1); setXp(x => x + 10);
      setFeedback("correct");
      setTimeout(() => { setFeedback(null); advance(); }, 1800);
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
      <div style={{ fontSize: 16, color: "#888", marginBottom: 14 }}>Letter {current + 1} of {items.length}</div>
      <div style={{ background: "#F0F7FF", borderRadius: 20, padding: 28, textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>{item.emoji}</div>
        <div style={{ fontSize: 22, color: "#333", fontWeight: 700, marginBottom: 8 }}>{item.word}</div>
        <div style={{ fontSize: 16, color: "#2B579A", fontWeight: 600 }}>Which letter does "{item.word}" start with?</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
        {item.options.map((opt, i) => {
          const isAnswer = opt === item.letter;
          return (
            <button key={i} onClick={() => handleChoice(opt)}
              style={{ width: 72, height: 72, borderRadius: 18, border: "3px solid",
                borderColor: feedback === "reveal" && isAnswer ? "#4CAF50" : "#e0e0e0",
                background: feedback === "reveal" && isAnswer ? "#E8F8E8" : "white",
                cursor: feedback ? "default" : "pointer", fontSize: 32, fontWeight: 800, color: "#2B579A",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: feedback === "reveal" && !isAnswer ? 0.4 : 1 }}>{opt}</button>
          );
        })}
      </div>
      {feedback === "correct" && (
        <div style={{ textAlign: "center", padding: 18, background: "#E8F8E8", borderRadius: 16, marginTop: 18, animation: "popIn 0.3s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#2E8B57", fontWeight: 700, fontSize: 18, marginTop: 4 }}>That is right! {item.sound}</div>
        </div>
      )}
      {feedback === "wrong" && (
        <div style={{ textAlign: "center", padding: 18, background: "#FFF8E8", borderRadius: 16, marginTop: 18, animation: "gentlePulse 0.4s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#B8860B", fontWeight: 600, fontSize: 18, marginTop: 4 }}>Good try! Let's learn this letter together.</div>
        </div>
      )}
      {feedback === "reveal" && (
        <div style={{ marginTop: 18 }}>
          <CorrectAnswerReveal text={item.letter + " is for " + item.word} emoji={item.emoji} onNext={handleNextAfterWrong} />
          <div style={{ textAlign: "center", color: "#2B579A", fontSize: 15, marginTop: 8, fontWeight: 600 }}>{item.sound}</div>
        </div>
      )}
    </div>
  );
}

function AlphabetExplorersNav({ items, onComplete, settings, companionEmoji, companionName }) {
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);

  function advance() {
    if (current + 1 < items.length) setCurrent(c => c + 1);
    else onComplete({ correct: correctCount, total: items.length, xp });
  }

  function handleChoice(option) {
    if (feedback) return;
    const isCorrect = option === items[current].answer;
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

  const q = items[current];
  return (
    <div style={{ padding: 20 }}>
      <ScoreHUD correct={correctCount} total={current + (feedback ? 1 : 0)} xp={xp} companionEmoji={companionEmoji} companionName={companionName} />
      <div style={{ fontSize: 16, color: "#888", marginBottom: 14 }}>Question {current + 1} of {items.length}</div>
      <div style={{ background: "#F0F7FF", borderRadius: 20, padding: 24, textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: settings.fontSize, color: "#333", fontWeight: 600, lineHeight: 1.5 }}>{q.question}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {q.options.map((opt, i) => {
          const isAnswer = opt === q.answer;
          return (
            <button key={i} onClick={() => handleChoice(opt)}
              style={{ padding: "16px 20px", borderRadius: 16, border: "3px solid",
                borderColor: feedback === "reveal" && isAnswer ? "#4CAF50" : "#e0e0e0",
                background: feedback === "reveal" && isAnswer ? "#E8F8E8" : "white",
                cursor: feedback ? "default" : "pointer", textAlign: "left",
                fontSize: settings.fontSize - 2, color: "#444", fontWeight: 500,
                opacity: feedback === "reveal" && !isAnswer ? 0.4 : 1,
                transition: "all 0.2s" }}>
              {opt}
            </button>
          );
        })}
      </div>
      {feedback === "correct" && (
        <div style={{ textAlign: "center", padding: 18, background: "#E8F8E8", borderRadius: 16, marginTop: 18, animation: "popIn 0.3s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#2E8B57", fontWeight: 700, fontSize: 18, marginTop: 4 }}>Great words! {companionName} loves reading!</div>
        </div>
      )}
      {feedback === "wrong" && (
        <div style={{ textAlign: "center", padding: 18, background: "#FFF8E8", borderRadius: 16, marginTop: 18, animation: "gentlePulse 0.4s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#B8860B", fontWeight: 600, fontSize: 18, marginTop: 4 }}>Good try! Let's see together.</div>
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

export default function AlphabetGame({ phase, onComplete, settings, companionEmoji, companionName }) {
  const explorerItems = useMemo(() => getRandomQuestions(ALPHA_EXPLORERS, 6), []);
  const navigatorItems = useMemo(() => getRandomQuestions(ALPHA_NAVIGATORS, 6), []);

  if (phase === "seedlings") return <AlphabetSeedlings onComplete={onComplete} settings={settings} companionEmoji={companionEmoji} companionName={companionName} />;
  if (phase === "explorers") return <AlphabetExplorersNav items={explorerItems} onComplete={onComplete} settings={settings} companionEmoji={companionEmoji} companionName={companionName} />;
  return <AlphabetExplorersNav items={navigatorItems} onComplete={onComplete} settings={settings} companionEmoji={companionEmoji} companionName={companionName} />;
}
