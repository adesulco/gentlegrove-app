import React, { useState, useEffect, useRef } from 'react';
import ScoreHUD from '../shared/ScoreHUD';
import CorrectAnswerReveal from '../shared/CorrectAnswerReveal';
import { VOCAB_SEEDLINGS, VOCAB_EXPLORERS, VOCAB_NAVIGATORS } from '../../data';

/**
 * CommunicationGame - Communication Cove word matching and sentence game
 * Seedlings/Explorers: picture-to-word matching
 * Navigators: sentence completion (kindest response)
 *
 * Props:
 * - phase: 'seedlings', 'explorers', or 'navigators'
 * - onComplete: callback({ correct, total, xp })
 * - settings: { theme, fontSize }
 * - companionEmoji: emoji string
 * - companionName: name string
 */

function CommunicationWordGame({ vocabSet, onComplete, settings, companionEmoji, companionName, phase }) {
  const vocab = vocabSet;
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);
  const [hintTier, setHintTier] = useState(0);
  const hintRef = useRef(null);
  const hint2Ref = useRef(null);

  useEffect(() => {
    setHintTier(0);
    hintRef.current = setTimeout(() => setHintTier(1), 8000);
    hint2Ref.current = setTimeout(() => setHintTier(2), 15000);
    return () => { clearTimeout(hintRef.current); clearTimeout(hint2Ref.current); };
  }, [current]);

  function advance() {
    if (current + 1 < vocab.length) setCurrent(c => c + 1);
    else onComplete({ correct: correctCount, total: vocab.length, xp });
  }

  function handleChoice(option) {
    if (feedback) return;
    clearTimeout(hintRef.current);
    clearTimeout(hint2Ref.current);
    const isCorrect = option === vocab[current].emoji;
    if (isCorrect) {
      setCorrectCount(c => c + 1);
      setXp(x => x + (hintTier > 0 ? 5 : 10));
      setFeedback("correct");
      setTimeout(() => { setFeedback(null); advance(); }, 1500);
    } else {
      setXp(x => x + 2);
      setFeedback("wrong");
      setTimeout(() => { setFeedback("reveal"); }, 1200);
    }
  }

  function handleNextAfterWrong() { setFeedback(null); advance(); }

  const word = vocab[current];
  const bgColor = settings.theme === "warm" ? "#F8FFF0" : settings.theme === "neutral" ? "#F8F8F6" : "#F0FFF8";

  return (
    <div style={{ padding: 20 }}>
      <ScoreHUD correct={correctCount} total={current} xp={xp} companionEmoji={companionEmoji} companionName={companionName} />
      <div style={{ fontSize: 16, color: "#888", marginBottom: 14 }}>Word {current + 1} of {vocab.length}</div>
      <div style={{ background: bgColor, borderRadius: 20, padding: 28, textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 18, color: "#666", marginBottom: 10, fontWeight: 600 }}>
          {phase === "seedlings" ? "Which picture matches this word?" : "Which symbol matches this word?"}
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, color: "#2B579A", marginBottom: 10 }}>{word.word}</div>
        {word.hint && <div style={{ fontSize: 16, color: "#888", fontStyle: "italic" }}>{word.hint}</div>}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
        {word.options.map((option, i) => {
          const isAnswer = option === word.emoji;
          return (
            <button key={i} onClick={() => handleChoice(option)}
              style={{ width: 80, height: 80, borderRadius: 18, border: "3px solid",
                borderColor: (hintTier >= 1 && isAnswer) ? "#7EC8E3" : feedback === "reveal" && isAnswer ? "#4CAF50" : "#e0e0e0",
                background: feedback === "reveal" && isAnswer ? "#E8F8E8" : (hintTier >= 2 && isAnswer) ? "#E8F4FD" : "white",
                cursor: feedback ? "default" : "pointer", fontSize: 40,
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
                opacity: feedback === "reveal" && !isAnswer ? 0.4 : 1,
                animation: (hintTier >= 2 && isAnswer) ? "glow 1.5s ease-in-out infinite" : "none" }}>{option}</button>
          );
        })}
      </div>
      {feedback === "correct" && (
        <div style={{ textAlign: "center", padding: 18, background: "#E8F8E8", borderRadius: 16, marginTop: 18, animation: "popIn 0.3s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#2E8B57", fontWeight: 700, fontSize: 18, marginTop: 4 }}>{companionName} says great vocabulary!</div>
        </div>
      )}
      {feedback === "wrong" && (
        <div style={{ textAlign: "center", padding: 18, background: "#FFF8E8", borderRadius: 16, marginTop: 18, animation: "shake 0.4s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#B8860B", fontWeight: 600, fontSize: 18, marginTop: 4 }}>Almost! Let's see the answer.</div>
        </div>
      )}
      {feedback === "reveal" && (
        <div style={{ marginTop: 18 }}>
          <CorrectAnswerReveal text={word.word} emoji={word.emoji} onNext={handleNextAfterWrong} />
          {word.teach && <div style={{ textAlign: "center", color: "#666", fontSize: 14, marginTop: 8, fontStyle: "italic", padding: "0 20px" }}>{word.teach}</div>}
        </div>
      )}
    </div>
  );
}

function SentenceGame({ onComplete, settings, companionEmoji, companionName }) {
  const questions = VOCAB_NAVIGATORS;
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);

  function advance() {
    if (current + 1 < questions.length) setCurrent(c => c + 1);
    else onComplete({ correct: correctCount, total: questions.length, xp });
  }

  function handleChoice(idx) {
    if (feedback) return;
    const isCorrect = idx === questions[current].answer;
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

  const q = questions[current];
  return (
    <div style={{ padding: 20 }}>
      <ScoreHUD correct={correctCount} total={current} xp={xp} companionEmoji={companionEmoji} companionName={companionName} />
      <div style={{ fontSize: 16, color: "#888", marginBottom: 14 }}>Scenario {current + 1} of {questions.length}</div>
      <div style={{ background: "#F0FFF8", borderRadius: 20, padding: 24, textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 18, color: "#555", fontWeight: 600, marginBottom: 8 }}>What would be the kindest thing to say?</div>
        <div style={{ fontSize: settings.fontSize, color: "#333", fontWeight: 600, lineHeight: 1.5 }}>{q.scenario}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {q.options.map((opt, i) => {
          const isAnswer = i === q.answer;
          return (
            <button key={i} onClick={() => handleChoice(i)}
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
          <div style={{ color: "#2E8B57", fontWeight: 700, fontSize: 18, marginTop: 4 }}>That was really kind! {companionName} is proud!</div>
        </div>
      )}
      {feedback === "wrong" && (
        <div style={{ textAlign: "center", padding: 18, background: "#FFF8E8", borderRadius: 16, marginTop: 18, animation: "shake 0.4s ease" }}>
          <span style={{ fontSize: 32 }}>{companionEmoji}</span>
          <div style={{ color: "#B8860B", fontWeight: 600, fontSize: 18, marginTop: 4 }}>Let's see the kindest answer!</div>
        </div>
      )}
      {feedback === "reveal" && (
        <div style={{ marginTop: 18 }}>
          <CorrectAnswerReveal text={q.options[q.answer]} onNext={handleNextAfterWrong} />
          {q.teach && <div style={{ textAlign: "center", color: "#666", fontSize: 14, marginTop: 8, fontStyle: "italic", padding: "0 20px" }}>{q.teach}</div>}
        </div>
      )}
    </div>
  );
}

export default function CommunicationGame({ phase, onComplete, settings, companionEmoji, companionName }) {
  if (phase === "navigators") return <SentenceGame onComplete={onComplete} settings={settings} companionEmoji={companionEmoji} companionName={companionName} />;
  const vocabSets = { seedlings: VOCAB_SEEDLINGS, explorers: VOCAB_EXPLORERS };
  const vocab = vocabSets[phase] || VOCAB_SEEDLINGS;
  return <CommunicationWordGame vocabSet={vocab} onComplete={onComplete} settings={settings} companionEmoji={companionEmoji} companionName={companionName} phase={phase} />;
}
