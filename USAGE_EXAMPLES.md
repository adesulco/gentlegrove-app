# GentleGrove Components - Usage Examples

## Complete Application Example

```jsx
import React, { useState, useCallback } from 'react';
import {
  WelcomeScreen,
  RegisterScreen,
  SignInScreen,
  ProfileSelector,
  NameStep,
  AgeGroupStep,
  CompanionStep,
  WelcomeToTreehouse,
  TreehouseHub
} from './components';
import { COMPANIONS, BIOMES, THEME_COLORS, companionStage } from './data';

export default function GentleGroveApp() {
  // Auth State
  const [screen, setScreen] = useState('login'); // login, profiles, onboarding, treehouse
  const [loginError, setLoginError] = useState('');
  const [parentContact, setParentContact] = useState('');

  // Profile Management
  const [childProfiles, setChildProfiles] = useState({});
  const [selectedChild, setSelectedChild] = useState(null);

  // Onboarding State
  const [onboardStep, setOnboardStep] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [phase, setPhase] = useState('seedlings');
  const [companion, setCompanion] = useState(null);
  const [companionName, setCompanionName] = useState('');

  // Game State
  const [totalXp, setTotalXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [stars, setStars] = useState(0);
  const [biomesPlayed, setBiomesPlayed] = useState(new Set());
  const [biomeStars, setBiomeStars] = useState({});
  const [earnedBadges, setEarnedBadges] = useState(new Set());

  // Settings
  const [settings, setSettings] = useState({ theme: 'cool' });
  const theme = THEME_COLORS[settings.theme];

  // Auth Handlers
  const handleRegister = (contact, pin) => {
    if (!contact || pin.length < 4) {
      setLoginError('Please enter valid contact and PIN');
      return;
    }
    // Validate or create parent account
    setParentContact(contact);
    setLoginError('');
    setScreen('profiles');
  };

  const handleSignIn = (contact, pin) => {
    // Validate parent credentials
    if (contact === 'test@example.com' && pin === '1234') {
      setParentContact(contact);
      setLoginError('');
      setScreen('profiles');
    } else {
      setLoginError('Invalid contact or PIN');
    }
  };

  const handleGuest = () => {
    setParentContact(''); // No saved parent
    setScreen('onboarding');
    setOnboardStep(0);
  };

  // Profile Handlers
  const handleSelectChild = (username) => {
    const profile = childProfiles[username];
    setSelectedChild(username);
    setPlayerName(profile.playerName);
    setPhase(profile.phase);
    setCompanion(profile.companion);
    setCompanionName(profile.companionName);
    setTotalXp(profile.totalXp || 0);
    setLevel(profile.level || 1);
    setStars(profile.stars || 0);
    setBiomesPlayed(new Set(profile.biomesPlayed || []));
    setBiomeStars(profile.biomeStars || {});
    setEarnedBadges(new Set(profile.earnedBadges || []));
    setScreen('treehouse');
  };

  const handleAddChild = (username) => {
    if (username.trim()) {
      // Create new child profile, start onboarding
      setSelectedChild(username);
      setScreen('onboarding');
      setOnboardStep(0);
      setPlayerName('');
      setPhase('seedlings');
      setCompanion(null);
      setCompanionName('');
      setTotalXp(0);
      setLevel(1);
      setStars(0);
    }
  };

  const handleSignOut = () => {
    setParentContact('');
    setChildProfiles({});
    setSelectedChild(null);
    setLoginError('');
    setScreen('login');
  };

  // Onboarding Handlers
  const handleNameSubmit = (name) => {
    setPlayerName(name);
    setOnboardStep(1);
  };

  const handleAgeGroupSelect = (phaseId) => {
    setPhase(phaseId);
  };

  const handleCompletedOnboarding = (comp, compName) => {
    // Save profile to childProfiles
    const newProfile = {
      playerName,
      phase,
      companion: comp,
      companionName: compName,
      totalXp: 0,
      level: 1,
      stars: 0,
      biomesPlayed: [],
      biomeStars: {},
      earnedBadges: [],
      settings
    };
    setChildProfiles({
      ...childProfiles,
      [selectedChild || playerName]: newProfile
    });
    setCompanion(comp);
    setCompanionName(compName);
    setTotalXp(0);
    setLevel(1);
    setStars(0);
    setScreen('treehouse');
  };

  // Game Handlers
  const handleStartQuest = (biome) => {
    // Navigate to quest screen
    console.log('Starting quest in:', biome.name);
    // setScreen('quest');
  };

  const handleShowBadges = () => {
    // Show badges overlay
    console.log('Showing badges');
  };

  const handleChangePlayer = () => {
    // Save current profile and go to profile selector
    if (selectedChild) {
      const currentProfile = {
        playerName,
        phase,
        companion,
        companionName,
        totalXp,
        level,
        stars,
        biomesPlayed: [...biomesPlayed],
        biomeStars,
        earnedBadges: [...earnedBadges],
        settings
      };
      setChildProfiles({
        ...childProfiles,
        [selectedChild]: currentProfile
      });
    }
    setScreen('profiles');
  };

  // Render Screens
  if (screen === 'login') {
    const [loginMode, setLoginMode] = useState('welcome');

    if (loginMode === 'welcome') {
      return (
        <WelcomeScreen
          onSignIn={() => setLoginMode('signin')}
          onRegister={() => setLoginMode('register')}
          onGuest={handleGuest}
          theme={theme}
        />
      );
    }
    if (loginMode === 'register') {
      return (
        <RegisterScreen
          onRegister={handleRegister}
          onBack={() => setLoginMode('welcome')}
          error={loginError}
          theme={theme}
        />
      );
    }
    if (loginMode === 'signin') {
      return (
        <SignInScreen
          onSignIn={handleSignIn}
          onBack={() => setLoginMode('welcome')}
          error={loginError}
          theme={theme}
        />
      );
    }
  }

  if (screen === 'profiles') {
    return (
      <ProfileSelector
        childProfiles={childProfiles}
        onSelectChild={handleSelectChild}
        onAddChild={handleAddChild}
        onSignOut={handleSignOut}
        theme={theme}
      />
    );
  }

  if (screen === 'onboarding') {
    if (onboardStep === 0) {
      return (
        <NameStep
          onSubmit={handleNameSubmit}
          theme={theme}
        />
      );
    }
    if (onboardStep === 1) {
      return (
        <AgeGroupStep
          playerName={playerName}
          phase={phase}
          onSelect={handleAgeGroupSelect}
          onNext={() => setOnboardStep(2)}
          theme={theme}
        />
      );
    }
    if (onboardStep === 2) {
      return (
        <CompanionStep
          onComplete={(comp, compName) => {
            setCompanion(comp);
            setCompanionName(compName);
            setOnboardStep(3);
          }}
          theme={theme}
        />
      );
    }
    if (onboardStep === 3) {
      return (
        <WelcomeToTreehouse
          companion={companion}
          companionName={companionName}
          onEnter={() => handleCompletedOnboarding(companion, companionName)}
          onSettings={() => {
            // Show settings modal
            console.log('Adjust settings');
          }}
          theme={theme}
        />
      );
    }
  }

  if (screen === 'treehouse') {
    return (
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
        onShowBadges={handleShowBadges}
        onChangePlayer={handleChangePlayer}
        theme={theme}
      />
    );
  }

  return null;
}
```

## Individual Component Usage Examples

### WelcomeScreen
```jsx
<WelcomeScreen
  onSignIn={() => navigateTo('signin')}
  onRegister={() => navigateTo('register')}
  onGuest={() => startGuestMode()}
  theme={THEME_COLORS.cool}
/>
```

### RegisterScreen
```jsx
<RegisterScreen
  onRegister={(contact, pin) => {
    createParentAccount(contact, pin);
    navigateTo('profiles');
  }}
  onBack={() => navigateTo('welcome')}
  error={registrationError}
  theme={THEME_COLORS.cool}
/>
```

### SignInScreen
```jsx
<SignInScreen
  onSignIn={(contact, pin) => {
    if (authenticateParent(contact, pin)) {
      navigateTo('profiles');
    }
  }}
  onBack={() => navigateTo('welcome')}
  error={authError}
  theme={THEME_COLORS.cool}
/>
```

### ProfileSelector
```jsx
<ProfileSelector
  childProfiles={{
    "sarah": {
      playerName: "Sarah",
      companion: COMPANIONS[0], // Fox
      companionName: "Fluffy",
      totalXp: 150,
      level: 4,
      stars: 12
    },
    "tom": {
      playerName: "Tom",
      companion: COMPANIONS[1], // Owl
      companionName: "Hoot",
      totalXp: 85,
      level: 2,
      stars: 5
    }
  }}
  onSelectChild={(username) => {
    loadChildProfile(username);
    navigateTo('treehouse');
  }}
  onAddChild={(username) => {
    createNewChild(username);
    navigateTo('onboarding');
  }}
  onSignOut={() => navigateTo('welcome')}
  theme={THEME_COLORS.cool}
/>
```

### NameStep
```jsx
<NameStep
  onSubmit={(name) => {
    setPlayerName(name);
    goToNextStep();
  }}
  theme={THEME_COLORS.cool}
/>
```

### AgeGroupStep
```jsx
const [selectedPhase, setSelectedPhase] = useState('seedlings');

<AgeGroupStep
  playerName="Sarah"
  phase={selectedPhase}
  onSelect={(phase) => setSelectedPhase(phase)}
  onNext={() => goToNextStep()}
  theme={THEME_COLORS.cool}
/>
```

### CompanionStep
```jsx
<CompanionStep
  onComplete={(companion, companionName) => {
    setSelectedCompanion(companion);
    setCompanionName(companionName);
    goToNextStep();
  }}
  theme={THEME_COLORS.cool}
/>
```

### WelcomeToTreehouse
```jsx
<WelcomeToTreehouse
  companion={COMPANIONS[0]}
  companionName="Fluffy"
  onEnter={() => {
    startGame();
    navigateTo('treehouse');
  }}
  onSettings={() => {
    showSettingsModal();
  }}
  theme={THEME_COLORS.cool}
/>
```

### TreehouseHub
```jsx
<TreehouseHub
  playerName="Sarah"
  phase="explorers"
  companion={COMPANIONS[0]}
  companionName="Fluffy"
  totalXp={125}
  level={3}
  stars={8}
  biomesPlayed={new Set(['communication', 'harmony'])}
  biomeStars={{ communication: 2, harmony: 3 }}
  earnedBadges={new Set(['explorer', 'kind-heart'])}
  onStartQuest={(biome) => {
    console.log('Starting quest:', biome.name);
    navigateTo('quest', { biome });
  }}
  onShowBadges={() => {
    showBadgesOverlay();
  }}
  onChangePlayer={() => {
    saveGameState();
    navigateTo('profiles');
  }}
  theme={THEME_COLORS.cool}
/>
```

## Data Constants Usage

```jsx
import { COMPANIONS, BIOMES, AGE_GROUPS, companionStage, THEME_COLORS } from './data';

// Get all companions
const allCompanions = COMPANIONS;
// [
//   { id: "fox", emoji: "🦊", name: "Fox", stages: [...] },
//   { id: "owl", emoji: "🦉", name: "Owl", stages: [...] },
//   { id: "bunny", emoji: "🐰", name: "Bunny", stages: [...] },
//   { id: "cat", emoji: "🐱", name: "Cat", stages: [...] }
// ]

// Get specific companion
const fox = COMPANIONS.find(c => c.id === 'fox');

// Get all biomes
const allBiomes = BIOMES;

// Get specific biome
const communicationCove = BIOMES.find(b => b.id === 'communication');

// Calculate companion stage
const stage = companionStage(120, fox);
// { label: "Young Fox", suffix: "💕", desc: "..." }

// Use theme
const coolTheme = THEME_COLORS.cool;
const warmTheme = THEME_COLORS.warm;

// Age groups
AGE_GROUPS.forEach(group => {
  console.log(`${group.emoji} ${group.label} (${group.ages})`);
});
```

## Styling with Different Themes

```jsx
// Cool Theme (Default)
<WelcomeScreen theme={THEME_COLORS.cool} />

// Warm Theme
<WelcomeScreen theme={THEME_COLORS.warm} />

// Neutral Theme
<WelcomeScreen theme={THEME_COLORS.neutral} />

// Custom Theme
const customTheme = {
  accent: "#FF6B6B",
  bg: "#FFE5E5",
  secondary: "#FF9999"
};
<WelcomeScreen theme={customTheme} />
```

## Handling Theme Changes
```jsx
const [currentTheme, setCurrentTheme] = useState('cool');

const handleThemeChange = (newTheme) => {
  setCurrentTheme(newTheme);
  // Update all components
};

<WelcomeScreen theme={THEME_COLORS[currentTheme]} />
```

## Type Definitions (TypeScript)
```typescript
interface ThemeObject {
  accent: string;
  bg: string;
  secondary?: string;
}

interface Companion {
  id: string;
  emoji: string;
  name: string;
  stages: Array<{
    label: string;
    suffix: string;
    desc: string;
  }>;
}

interface Biome {
  id: string;
  name: string;
  emoji: string;
  color: string;
  skill: string;
  mascot: string;
}

interface ChildProfile {
  playerName: string;
  phase: 'seedlings' | 'explorers' | 'navigators';
  companion: Companion;
  companionName: string;
  totalXp: number;
  level: number;
  stars: number;
  biomesPlayed: string[];
  biomeStars: Record<string, number>;
  earnedBadges: string[];
}
```
