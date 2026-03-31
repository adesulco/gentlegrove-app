import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { GameContext, GameProvider } from './context/GameContext';
import { useScreenTimer } from './hooks/useScreenTimer';
import * as dataService from './services/dataService';

// Auth Components
import WelcomeScreen from './components/auth/WelcomeScreen';
import SignInScreen from './components/auth/SignInScreen';
import RegisterScreen from './components/auth/RegisterScreen';
import ProfileSelector from './components/auth/ProfileSelector';

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
import { BADGES } from './components/shared/data';

const THEMES = {
  cool: { accent: '#2B579A', bg: '#F0F7FF', secondary: '#7EC8E3' },
  warm: { accent: '#8B5E3C', bg: '#FFF8F0', secondary: '#D4943A' },
  neutral: { accent: '#666666', bg: '#F5F5F3', secondary: '#999999' },
};

/**
 * AppContent - Main application component
 * Manages screen routing, game state, and overlays
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
    const questStars = Math.max(1, Math.ceil((result.correct / result.total) * 3));
    const xpGained = result.xp || (result.correct * 10);
    const newTotalXp = totalXp + xpGained;
    const newLevel = Math.floor(newTotalXp / 50) + 1;

    const biomeId = selectedBiome?.id;
    const newBiomeStars = { ...biomeStars };
    newBiomeStars[biomeId] = Math.max(newBiomeStars[biomeId] || 0, questStars);

    setStars(stars + questStars);
    setTotalXp(newTotalXp);
    setLevel(newLevel);
    setBiomeStars(newBiomeStars);

    const newBiomesPlayed = new Set(biomesPlayed);
    newBiomesPlayed.add(biomeId);
    setBiomesPlayed(newBiomesPlayed);

    if (biomeId === 'harmony') {
      setHarmonyCount(harmonyCount + 1);
    }

    const newBadges = checkNewBadges({
      questStars,
      xp: xpGained,
      maxStars: 3,
    });

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
      companionEmoji: companion?.emoji || '🐾',
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
    setScreen('onboarding');
    setOnboardStep(0);
  };

  const handleSignInSuccess = async (contact, pin) => {
    try {
      await authContext.login(contact, pin);
      setLoginMode('profiles');
    } catch (err) {
      console.error('Sign in failed:', err);
    }
  };

  const handleRegisterSuccess = async (contact, pin) => {
    try {
      await authContext.register(contact, pin);
      // After registration, go to profiles (which will show "add first child")
      setLoginMode('profiles');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  /**
   * Profile selection: select existing child
   */
  const handleSelectChild = async (username, profile) => {
    if (gameContext?.loadChildProfile && authContext?.currentUser) {
      await gameContext.loadChildProfile(authContext.currentUser.uid, username);
      setPlayerName(profile?.playerName || username);
      setPhase(profile?.phase || 'seedlings');
      setCompanion(profile?.companion || null);
      setCompanionName(profile?.companionName || 'Companion');
      setScreen('treehouse');
    }
  };

  /**
   * Profile selection: add new child → go to onboarding
   */
  const handleAddChild = () => {
    setScreen('onboarding');
    setOnboardStep(0);
  };

  /**
   * Sign out
   */
  const handleSignOut = async () => {
    try {
      await authContext.logout();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
    setLoginMode('welcome');
    setScreen('login');
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

  const handleOnboardingComplete = async () => {
    // If parent is logged in, save the new child profile
    if (authContext?.currentUser) {
      try {
        await dataService.saveChildProfile(authContext.currentUser.uid, playerName, {
          playerName,
          phase,
          companion,
          companionName,
          stars: 0,
          totalXp: 0,
          level: 1,
          biomesPlayed: [],
          biomeStars: {},
          harmonyCount: 0,
          earnedBadges: [],
          settings: {},
        });
      } catch (err) {
        console.error('Error saving child profile:', err);
      }
    }
    setScreen('treehouse');
  };

  /**
   * Quest flow handlers - single "Back to Treehouse" after quest complete + bridge prompt
   */
  const handleQuestStart = () => {
    setQuestPhase('playing');
  };

  const handleBackToTreehouse = () => {
    setQuestPhase('preview');
    setScreen('treehouse');
  };

  /**
   * Treehouse handlers
   */
  const handleChangePlayer = () => {
    timer.stopTimer();
    if (authContext?.currentUser) {
      setScreen('login');
      setLoginMode('profiles');
    } else {
      setScreen('login');
      setLoginMode('welcome');
    }
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
          onSignIn={handleSignInSuccess}
          onBack={() => setLoginMode('welcome')}
          error={authContext?.error || ''}
          theme={currentTheme}
        />
      );
    }

    if (loginMode === 'register') {
      return (
        <RegisterScreen
          onRegister={handleRegisterSuccess}
          onBack={() => setLoginMode('welcome')}
          error={authContext?.error || ''}
          theme={currentTheme}
        />
      );
    }

    if (loginMode === 'profiles') {
      return (
        <ProfileSelector
          parentId={authContext?.currentUser?.uid}
          onSelectChild={handleSelectChild}
          onAddChild={handleAddChild}
          onSignOut={handleSignOut}
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
          onSettings={() => setScreen('settings')}
          theme={currentTheme}
        />
      );
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
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <button
            onClick={handleBackToTreehouse}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 32,
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            🏡
          </button>
          <div style={{ fontSize: 18, color: '#555', fontWeight: 700 }}>
            {Math.floor(timer.timeLeft / 60)}m {timer.timeLeft % 60}s
          </div>
          <button
            onClick={() => setShowSensoryMenu(true)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 32,
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            ⚙️
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

        {/* Quest Complete: merged with offline activity (single screen, one button) */}
        {questPhase === 'complete' && questResult && (
          <div style={{ padding: 24, textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ fontSize: 64, marginBottom: 12, animation: 'popIn 0.5s ease' }}>🎉</div>
            <h2 style={{
              color: currentTheme.accent,
              fontSize: 30,
              fontWeight: 800,
              marginBottom: 8,
              fontFamily: "'Nunito', sans-serif"
            }}>
              Well Done!
            </h2>
            <p style={{
              color: '#666',
              fontSize: 16,
              marginBottom: 20,
              fontFamily: "'Inter', sans-serif"
            }}>
              You finished the quest — {companionName} is proud of you!
            </p>
            <div style={{
              background: 'white',
              borderRadius: 20,
              padding: 24,
              marginBottom: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <div style={{
                fontSize: 20,
                color: '#666',
                marginBottom: 12,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif"
              }}>
                {questResult.correct} out of {questResult.total} correct
              </div>
              <div style={{ fontSize: 32, marginBottom: 12, letterSpacing: 4 }}>
                {'⭐'.repeat(questResult.questStars)}
              </div>
              {/* Progress bar for score */}
              <div style={{
                height: 10,
                background: '#e8e8e8',
                borderRadius: 5,
                overflow: 'hidden',
                marginBottom: 14,
                maxWidth: 260,
                margin: '0 auto 14px'
              }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #4A7C59, #7EC8E3)',
                  borderRadius: 5,
                  width: `${(questResult.correct / questResult.total) * 100}%`,
                  transition: 'width 0.6s ease'
                }} />
              </div>
              <div style={{
                fontSize: 20,
                color: '#2B579A',
                fontWeight: 700,
                fontFamily: "'Nunito', sans-serif"
              }}>
                +{questResult.xpGained} XP earned
              </div>
            </div>

            {/* Offline activity embedded right in the complete screen */}
            {selectedBiome && (
              <BridgePrompt biomeId={selectedBiome.id} embedded={true} />
            )}

            {/* Single button: Back to Treehouse */}
            <button
              onClick={handleBackToTreehouse}
              style={{
                marginTop: 16,
                padding: '18px 56px',
                borderRadius: 26,
                border: 'none',
                background: currentTheme.accent,
                color: 'white',
                fontSize: 20,
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%',
                maxWidth: 340,
                fontFamily: "'Nunito', sans-serif",
                minHeight: 56,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              Back to Treehouse
            </button>
          </div>
        )}

        {/* Overlays */}
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
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 800, color: currentTheme.accent }}>
            ✨ {playerName}
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <button
              onClick={() => setShowBreathingPause(true)}
              style={{
                background: '#FFD700',
                border: 'none',
                borderRadius: 22,
                padding: '10px 18px',
                fontSize: 17,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Breathe 🌬️
            </button>
            <button
              onClick={() => setShowBadgesPanel(true)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 28,
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              🏆 <span style={{ fontSize: 18, fontWeight: 700 }}>{earnedBadges.size}</span>
            </button>
            <button
              onClick={() => setShowSensoryMenu(true)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 28,
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              ⚙️
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
          GentleGrove v0.6
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
              fontSize: 18,
              fontWeight: 700,
              zIndex: 100,
              animation: 'slideUp 0.3s ease',
            }}
          >
            ⏰ Only {Math.floor(timer.timeLeft / 60)} minutes left!
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
