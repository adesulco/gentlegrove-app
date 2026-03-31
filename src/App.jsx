import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { GameContext, GameProvider } from './context/GameContext';
import { useScreenTimer } from './hooks/useScreenTimer';

// Auth Components
import WelcomeScreen from './components/auth/WelcomeScreen';
import SignInScreen from './components/auth/SignInScreen';
import RegisterScreen from './components/auth/RegisterScreen';
import ProfileSelector from './components/auth/ProfleSelector';

// Onboarding Components
import NameStep from './components/onboarding/NameStep';
import AgeGroupStep from './components/onboarding/AgeGroupStep';
import CompanionStep from './components/onboarding/CompanionStep';
import WelcomeToTreehouse from './components/onboarding/WelcomeToTreehouse';

// Main Components
import TreehouseHub from './components/TreehouseHub';

// Shared Components
import QuestPreview from './components/shared/QuestPreview';
import BreathingPause from './components/shared/BreathingPause';
import ScreenTimeUp from './components/shared/ScreenTimeUp';
import BadgeOverlay from './components/shared/BadgeOverlay';
import BadgesPanel from './components/shared/BadgesPanel';
import BridgePrompt from './components/shared/BridgePrompt';
import SensoryMenu from './components/shared/SensoryMenu';

// Game Components
import AlphabetGame from './components/games/AlphabetGame';
import BodySignalGame from './components/games/BodySignalGame';
import CommunicationGame from './components/games/CommunicationGame';
import EmotionGame from './components/games/EmotionGame';
import MathsGame from './components/games/MathsGame';
import PatternGame from './components/games/PatternGame';
import RoutineGame from './components/games/RoutineGame';

// Data
// COMPANIONS import removed - companion selection now handled in CompanionStep
import { BADGES } from './components/shared/data';

const THEMES = {
  cool: { accent: '#2B579A', bg: '#F0F7FF' },
  warm: { accent: '#8B4513', bg: '#FFF8F0' },
  neutral: { accent: '#555B7A', bg: '#F5F5F3' },
};

/**
 * AppContent - Main application component
 * Manages screen routing, game state, and overlays
 * This component is wrapped in both AuthProvider and GameProvider
 */
function AppContent() {
  const authContext = useContext(AuthContext);
  const gameContext = useContext(GameContext);

  // Screen and navigation state
  const [screen, setScreen] = useState('login');
  const [loginMode, setLoginMode] = useState('welcome'); // welcome, signin, register, profiles
  const [onboardStep, setOnboardStep] = useState(0); // 0=name, 1=age, 2=companion, 3=welcome
  const [questPhase, setQuestPhase] = useState('preview'); // preview, playing, complete
  const [selectedBiome, setSelectedBiome] = useState(null);

  // UI overlay state
  const [showBreathingPause, setShowBreathingPause] = useState(false);
  const [showScreenTimeUp, setShowScreenTimeUp] = useState(false);
  const [showBadgeOverlay, setShowBadgeOverlay] = useState(null);
  const [showBadgesPanel, setShowBadgesPanel] = useState(false);
  const [showBridgePrompt, setShowBridgePrompt] = useState(false);
  const [showSensoryMenu, setShowSensoryMenu] = useState(false);

  // Quest completion data
  const [questResult, setQuestResult] = useState(null);

  // Theme selection
  const [themeChoice] = useState('cool');
  const currentTheme = THEMES[themeChoice];

  // Screen timer
  const screenTimeMinutes = gameContext?.settings?.screenTime || 60;
  const timer = useScreenTimer(screenTimeMinutes);

  // Get game context values safely
  const {
    playerName = '',
    setPlayerName = () => {},
    phase = 'seedlings',
    setPhase = () => {},
    companion = null,
    setCompanion = () => {},
    companionName = '',
    setCompanionName = () => {},
    stars = 0,
    setStars = () => {},
    totalXp = 0,
    setTotalXp = () => {},
    level = 1,
    setLevel = () => {},
    biomesPlayed = new Set(),
    setBiomesPlayed = () => {},
    biomeStars = {},
    setBiomeStars = () => {},
    harmonyCount = 0,
    setHarmonyCount = () => {},
    earnedBadges = new Set(),
    setEarnedBadges = () => {},
    settings = {},
    // eslint-disable-next-line no-unused-vars
    _loadChildProfile = () => {},
    // eslint-disable-next-line no-unused-vars
    _saveCurrentProfile = () => {},
  } = gameContext || {};

  // Initialize screen timer on treehouse entry
  useEffect(() => {
    if (screen === 'treehouse' && !timer.timerStart) {
      timer.startTimer();
    }
  }, [screen, timer]);

  // Check for screen time warning and timeout
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (timer.isTimeUp && screen === 'treehouse') {
      timer.stopTimer();
      setShowScreenTimeUp(true);
    } else if (timer.isWarning && screen === 'treehouse') {
      // Show warning visually (can be added to UI)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.isTimeUp, timer.isWarning, screen]);

  /**
   * Check for new badges after quest completion
   */
  const checkNewBadges = useCallback((questData) => {
    const newBadges = [];
    const state = {
      totalStars: stars + questData.questStars,
      totalXp: totalXp + questData.xp,
      biomesPlayed: new Set([...biomesPlayed, selectedBiome?.id]),
      harmonyCount: selectedBiome?.id === 'harmony' ? harmonyCount + 1 : harmonyCount,
      hadPerfect: questData.questStars === questData.maxStars,
      level: level,
    };

    BADGES.forEach((badge) => {
      if (!earnedBadges.has(badge.id) && badge.check(state)) {
        newBadges.push(badge);
      }
    });

    return newBadges;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stars, totalXp, biomesPlayed, harmonyCount, earnedBadges, selectedBiome]);

  /**
   * Handle quest completion
   */
  const handleQuestComplete = useCallback((result) => {
    // Calculate stars based on correct answers
    const questStars = Math.max(1, Math.ceil((result.correct / result.total) * 3));
    const xpGained = result.xp || (result.correct * 10);
    const newTotalXp = totalXp + xpGained;
    const newLevel = Math.floor(newTotalXp / 50) + 1;

    // Update biome stars
    const biomeId = selectedBiome?.id;
    const newBiomeStars = { ...biomeStars };
    newBiomeStars[biomeId] = Math.max(newBiomeStars[biomeId] || 0, questStars);

    // Update all game state
    setStars(stars + questStars);
    setTotalXp(newTotalXp);
    setLevel(newLevel);
    setBiomeStars(newBiomeStars);

    // Update biomes played
    const newBiomesPlayed = new Set(biomesPlayed);
    newBiomesPlayed.add(biomeId);
    setBiomesPlayed(newBiomesPlayed);

    // Update harmony count if applicable
    if (biomeId === 'harmony') {
      setHarmonyCount(harmonyCount + 1);
    }

    // Check for new badges
    const newBadges = checkNewBadges({
      questStars,
      xp: xpGained,
      maxStars: 3,
    });

    // Update earned badges
    const updatedBadges = new Set(earnedBadges);
    newBadges.forEach((badge) => {
      updatedBadges.add(badge.id);
      setShowBadgeOverlay(badge);
    });
    setEarnedBadges(updatedBadges);

    setQuestResult({
      ...result,
      questStars,
      xpGained,
      newLevel,
      newBadges,
    });

    setQuestPhase('complete');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBiome, stars, totalXp, biomeStars, biomesPlayed, harmonyCount, level, earnedBadges, checkNewBadges, setStars, setTotalXp, setLevel, setBiomeStars, setBiomesPlayed, setHarmonyCount, setEarnedBadges]);

  /**
   * Handle starting a quest
   */
  const handleStartQuest = useCallback((biome) => {
    setSelectedBiome(biome);
    setQuestPhase('preview');
    setScreen('quest');
  }, []);

  /**
   * Render the game component for the selected biome
   */
  const renderGame = useCallback(() => {
    if (!selectedBiome) return null;

    const gameProps = {
      phase,
      onComplete: handleQuestComplete,
      settings,
      companionEmoji: companion?.emoji || 'ð¾',
      companionName,
    };

    switch (selectedBiome.id) {
      case 'alphabet':
        return <AlphabetGame {...gameProps} />;
      case 'rhythm':
        return <BodySignalGame {...gameProps} />;
      case 'communication':
        return <CommunicationGame {...gameProps} />;
      case 'harmony':
        return <EmotionGame {...gameProps} />;
      case 'numbers':
        return <MathsGame {...gameProps} />;
      case 'puzzle':
        return <PatternGame {...gameProps} />;
      case 'home':
        return <RoutineGame {...gameProps} />;
      default:
        return null;
    }
  }, [selectedBiome, phase, handleQuestComplete, settings, companion, companionName]);

  /**
   * Login flow handlers
   */
  const handleWelcomeLogin = () => setLoginMode('signin');
  const handleWelcomeRegister = () => setLoginMode('register');
  const handleWelcomeGuest = () => {
    // Start guest onboarding - let the child enter their name and pick age group
    setScreen('onboarding');
    setOnboardStep(0);
  };

  const handleSignInSuccess = async (contact, pin) => {
    try {
      await authContext.login(contact, pin);
      // After login, show profiles
      setLoginMode('profiles');
    } catch (err) {
      console.error('Sign in failed:', err);
    }
  };

  const handleRegisterSuccess = async (contact, pin) => {
    try {
      await authContext.register(contact, pin);
      // After registration, go to onboarding
      setScreen('onboarding');
      setOnboardStep(0);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleProfileSelected = async (profile) => {
    // Load the selected child profile
    if (gameContext?.loadChildProfile && authContext?.currentUser) {
      await gameContext.loadChildProfile(authContext.currentUser.uid, profile.username);
      setPlayerName(profile.playerName || 'Player');
      setPhase(profile.phase || 'seedlings');
      setCompanion(profile.companion);
      setCompanionName(profile.companionName || 'Companion');
      setScreen('treehouse');
    }
  };

  /**
   * Onboarding handlers
   */
  const handleNameSubmit = (name) => {
    setPlayerName(name);
    setOnboardStep(1);
  };

  const handleAgeSubmit = (ageGroup) => {
    setPhase(ageGroup);
    setOnboardStep(2);
  };

  const handleCompanionSubmit = (companionChoice, givenName) => {
    setCompanion(companionChoice);
    setCompanionName(givenName);
    setOnboardStep(3);
  };

  const handleOnboardingComplete = () => {
    setScreen('treehouse');
  };

  /**
   * Quest flow handlers
   */
  const handleQuestStart = () => {
    setQuestPhase('playing');
  };

  const handleQuestCompleteConfirm = () => {
    setShowBridgePrompt(true);
  };

  const handleBridgePromptContinue = () => {
    setShowBridgePrompt(false);
    setQuestPhase('preview');
    setScreen('treehouse');
  };

  /**
   * Treehouse handlers
   */
  const handleChangePlayer = () => {
    // Reset game state and go back to login
    timer.stopTimer();
    setScreen('login');
    setLoginMode('profiles');
  };

  /**
   * Render login screens
   */
  if (screen === 'login') {
    if (loginMode === 'welcome') {
      return (
        <WelcomeScreen
          onSignIn={handleWelcomeLogin}
          onRegister={handleWelcomeRegister}
          onGuest={handleWelcomeGuest}
          theme={currentTheme}
        />
      );
    }

    if (loginMode === 'signin') {
      return (
        <SignInScreen
          onSuccess={handleSignInSuccess}
          onBack={() => setLoginMode('welcome')}
          theme={currentTheme}
        />
      );
    }

    if (loginMode === 'register') {
      return (
        <RegisterScreen
          onSuccess={handleRegisterSuccess}
          onBack={() => setLoginMode('welcome')}
          theme={currentTheme}
        />
      );
    }

    if (loginMode === 'profiles') {
      return (
        <ProfileSelector
          onSelectProfile={handleProfileSelected}
          onBack={() => setLoginMode('welcome')}
          theme={currentTheme}
        />
      );
    }
  }

  /**
   * Render onboarding
   */
  if (screen === 'onboarding') {
    if (onboardStep === 0) {
      return <NameStep onSubmit={handleNameSubmit} theme={currentTheme} />;
    }
    if (onboardStep === 1) {
      return (
        <AgeGroupStep
          playerName={playerName}
          phase={phase}
          onSelect={setPhase}
          onNext={() => handleAgeSubmit(phase)}
          theme={currentTheme}
        />
      );
    }
    if (onboardStep === 2) {
      return (
        <CompanionStep
          onComplete={handleCompanionSubmit}
          theme={currentTheme}
        />
      );
    }
    if (onboardStep === 3) {
      return (
        <WelcomeToTreehouse
          companion={companion}
          companionName={companionName}
          onEnter={handleOnboardingComplete}
          theme={currentTheme}
        />
    }
  }

  /**
   * Render quest screen
   */
  if (screen === 'quest') {
    return (
      <div style={{ minHeight: '100vh', background: currentTheme.bg, position: 'relative' }}>
        {/* Top Bar */}
        <div
          style={{
            background: 'white',
            borderBottom: `2px solid ${currentTheme.accent}`,
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <button
            onClick={() => {
              setQuestPhase('preview');
              setScreen('treehouse');
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
            }}
          >
            ð¡
          </button>
          <div style={{ fontSize: 14, color: '#666', fontWeight: 600 }}>
            {Math.floor(timer.timeLeft / 60)}m {timer.timeLeft % 60}s
          </div>
          <button
            onClick={() => setShowSensoryMenu(true)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
            }}
          >
            âï¸
          </button>
        </div>

        {/* Quest Content */}
        {questPhase === 'preview' && selectedBiome && (
          <div style={{ padding: 20 }}>
            <QuestPreview
              biome={selectedBiome}
              phase={phase}
              onStart={handleQuestStart}
            />
          </div>
        )}

        {questPhase === 'playing' && (
          <div>{renderGame()}</div>
        )}

        {questPhase === 'complete' && questResult && (
          <div style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>ð</div>
            <h2 style={{ color: currentTheme.accent, fontSize: 28, marginBottom: 20 }}>
              Quest Complete!
            </h2>
            <div style={{
              background: 'white',
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 18, color: '#666', marginBottom: 12 }}>
                Correct: {questResult.correct}/{questResult.total}
              </div>
              <div style={{ fontSize: 18, color: '#666', marginBottom: 12 }}>
                Stars: {'â­'.repeat(questResult.questStars)}
              </div>
              <div style={{ fontSize: 18, color: '#666' }}>
                XP Gained: +{questResult.xpGained}
              </div>
            </div>
            <button
              onClick={handleQuestCompleteConfirm}
              style={{
                padding: '14px 48px',
                borderRadius: 24,
                border: 'none',
                background: currentTheme.accent,
                color: 'white',
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Continue
            </button>
          </div>
        )}

        {/* Overlays */}
        {showBreathingPause && (
          <BreathingPause onContinue={() => setShowBreathingPause(false)} />
        )}

        {showBridgePrompt && selectedBiome && (
          <div style={{ padding: 20 }}>
            <BridgePrompt
              biomeId={selectedBiome.id}
              onContinue={handleBridgePromptContinue}
            />
          </div>
        )}

        {showSensoryMenu && (
          <SensoryMenu
            settings={settings}
            onClose={() => setShowSensoryMenu(false)}
          />
        )}

        {showBadgeOverlay && (
          <BadgeOverlay
            badge={showBadgeOverlay}
            onContinue={() => setShowBadgeOverlay(null)}
          />
        )}
      </div>
    );
  }

  /**
   * Render treehouse hub
   */
  if (screen === 'treehouse') {
    return (
      <div style={{ minHeight: '100vh', background: currentTheme.bg }}>
        {/* Top Bar */}
        <div
          style={{
            background: 'white',
            borderBottom: `2px solid ${currentTheme.accent}`,
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, color: currentTheme.accent }}>
            â¨ {playerName}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              onClick={() => setShowBreathingPause(true)}
              style={{
                background: '#FFD700',
                border: 'none',
                borderRadius: 20,
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Breathe ð¬ï¸
            </button>
            <button
              onClick={() => setShowBadgesPanel(true)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
              }}
            >
              ð {earnedBadges.size}
            </button>
            <button
              onClick={() => setShowSensoryMenu(true)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
              }}
            >
              âï¸
            </button>
          </div>
        </div>

        {/* Main Hub Content */}
        <TreehouseHub
          playerName={playerName}
          phase={phase}
          companion={companion}
          companionName={companionName}
          totalXp={totalXp}
          level={level}
          stars={stars}
          biomesPlayed={biomesPlayed}
          biomeStars={biomeStars}
          earnedBadges={earnedBadges}
          onStartQuest={handleStartQuest}
          onShowBadges={() => setShowBadgesPanel(true)}
          onChangePlayer={handleChangePlayer}
          theme={currentTheme}
        />

        {/* Version Footer */}
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            color: '#999',
            fontSize: 12,
            borderTop: '1px solid #eee',
            marginTop: 20,
          }}
        >
          GentleGrove v0.4
        </div>

        {/* Screen Time Warning */}
        {timer.isWarning && !timer.isTimeUp && (
          <div
            style={{
              position: 'fixed',
              bottom: 20,
              left: 20,
              right: 20,
              background: '#FFA500',
              color: 'white',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 600,
              zIndex: 100,
              animation: 'slideUp 0.3s ease',
            }}
          >
            â° Only {Math.floor(timer.timeLeft / 60)} minutes left!
          </div>
        )}

        {/* Overlays */}
        {showScreenTimeUp && (
          <ScreenTimeUp onAcknowledge={() => setShowScreenTimeUp(false)} />
        )}

        {showBadgesPanel && (
          <BadgesPanel
            earnedBadges={earnedBadges}
            onClose={() => setShowBadgesPanel(false)}
          />
        )}

        {showBreathingPause && (
          <BreathingPause onContinue={() => setShowBreathingPause(false)} />
        )}

        {showSensoryMenu && (
          <SensoryMenu
            settings={settings}
            onClose={() => setShowSensoryMenu(false)}
          />
        )}

        {showBadgeOverlay && (
          <BadgeOverlay
            badge={showBadgeOverlay}
            onContinue={() => setShowBadgeOverlay(null)}
          />
        )}
      </div>
    );
  }

  // Fallback
  return (
    <div style={{ textAlign: 'center', padding: 40 }}>
      <p>Loading GentleGrove...</p>
    </div>
  );
}

/**
 * Main App Component
 * Provides AuthProvider and GameProvider context to AppContent
 */
function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
