# GentleGrove React Components

This document describes the React components created for the GentleGrove educational game app.

## Component Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── WelcomeScreen.jsx        # Landing page with logo and three action buttons
│   │   ├── RegisterScreen.jsx       # Parent account creation form
│   │   ├── SignInScreen.jsx         # Parent sign-in form
│   │   └── ProfileSelector.jsx      # Child profile selection screen
│   ├── onboarding/
│   │   ├── NameStep.jsx             # Step 0: Child name entry
│   │   ├── AgeGroupStep.jsx         # Step 1: Age group selection
│   │   ├── CompanionStep.jsx        # Step 2: Companion selection and naming
│   │   └── WelcomeToTreehouse.jsx   # Step 3: Welcome and treehouse intro
│   ├── TreehouseHub.jsx             # Main treehouse hub screen
│   └── index.js                     # Component exports
├── data/
│   ├── constants.js                 # Core data constants
│   ├── index.js                     # Data exports
│   └── [other data files]           # Existing game content
└── ...
```

## Authentication Components

### WelcomeScreen
Landing page for GentleGrove with:
- Floating treehouse emoji (🏡)
- Title: "GentleGrove"
- Subtitle about learning adventures for autism spectrum children
- Three action buttons: Sign In, Create Account, Play as Guest

**Props:**
- `onSignIn` (function): Callback when Sign In button clicked
- `onRegister` (function): Callback when Create Account button clicked
- `onGuest` (function): Callback when Play as Guest button clicked
- `theme` (object): Theme with accent and bg colors

**Usage:**
```jsx
<WelcomeScreen
  onSignIn={handleSignIn}
  onRegister={handleRegister}
  onGuest={handleGuest}
  theme={themeColors.cool}
/>
```

### RegisterScreen
Parent account creation form with:
- Email/mobile input
- PIN input (4+ digits)
- Error message display
- Create Account and Back buttons

**Props:**
- `onRegister(contact, pin)` (function): Called when account is created
- `onBack` (function): Called to return to welcome screen
- `error` (string): Error message to display
- `theme` (object): Theme colors

**Usage:**
```jsx
<RegisterScreen
  onRegister={handleRegister}
  onBack={handleBack}
  error={errorMessage}
  theme={themeColors.cool}
/>
```

### SignInScreen
Parent sign-in form with:
- Email/mobile input
- PIN input
- Error message display
- Sign In and Back buttons

**Props:**
- `onSignIn(contact, pin)` (function): Called when signed in
- `onBack` (function): Called to return to welcome screen
- `error` (string): Error message to display
- `theme` (object): Theme colors

**Usage:**
```jsx
<SignInScreen
  onSignIn={handleSignIn}
  onBack={handleBack}
  error={errorMessage}
  theme={themeColors.cool}
/>
```

### ProfileSelector
Child profile selection and creation screen with:
- Grid of existing child profiles (emoji, name, level, XP)
- Input field + Add button to create new profile
- Sign Out button

**Props:**
- `childProfiles` (object): Child profiles with username as key
- `onSelectChild(username)` (function): Called when profile selected
- `onAddChild(username)` (function): Called when new profile created
- `onSignOut` (function): Called when Sign Out button clicked
- `theme` (object): Theme colors

**Usage:**
```jsx
<ProfileSelector
  childProfiles={{
    "sarah": { playerName: "Sarah", companion: {...}, totalXp: 150, ... },
    "tom": { playerName: "Tom", companion: {...}, totalXp: 80, ... }
  }}
  onSelectChild={handleSelectChild}
  onAddChild={handleAddChild}
  onSignOut={handleSignOut}
  theme={themeColors.cool}
/>
```

## Onboarding Components

### NameStep (Step 0)
Name entry screen with:
- GentleGrove logo (treehouse emoji 🏡)
- Title: "GentleGrove"
- Question: "What's your name?"
- Large text input field
- Next button (disabled until name entered)

**Props:**
- `onSubmit(name)` (function): Called with entered name
- `theme` (object): Theme colors

**Usage:**
```jsx
<NameStep
  onSubmit={handleNameSubmit}
  theme={themeColors.cool}
/>
```

### AgeGroupStep (Step 1)
Age group selection with:
- Greeting: "Hi, {playerName}!"
- Three selectable options:
  - Seedlings 🌱 (Ages 3-5)
  - Explorers 🌿 (Ages 6-8)
  - Navigators 🌸 (Ages 9-12)
- Next button

**Props:**
- `playerName` (string): Child's name for greeting
- `phase` (string): Currently selected phase ID
- `onSelect(phase)` (function): Called when phase selected
- `onNext` (function): Called when Next button clicked
- `theme` (object): Theme colors

**Usage:**
```jsx
<AgeGroupStep
  playerName="Sarah"
  phase={selectedPhase}
  onSelect={handlePhaseSelect}
  onNext={handleNext}
  theme={themeColors.cool}
/>
```

### CompanionStep (Step 2)
Companion selection and naming with:
- Four selectable companions with emojis:
  - Fox 🦊
  - Owl 🦉
  - Bunny 🐰
  - Cat 🐱
- Text input to name the chosen companion
- Next button (disabled until companion and name selected)

**Props:**
- `onComplete(companion, companionName)` (function): Called when step complete
- `theme` (object): Theme colors

**Usage:**
```jsx
<CompanionStep
  onComplete={handleCompanionComplete}
  theme={themeColors.cool}
/>
```

### WelcomeToTreehouse (Step 3)
Welcome and treehouse intro with:
- Bouncing companion emoji
- Title: "Meet {companionName}!"
- Growth stages preview: {emoji}🐾 → {emoji}💕 → {emoji}✨
- Treehouse intro text: "The Treehouse is your home base!"
- "Enter the Treehouse!" button
- "Adjust Settings First" link

**Props:**
- `companion` (object): Companion object with emoji and stages
- `companionName` (string): Name given to companion
- `onEnter` (function): Called to enter treehouse
- `onSettings` (function): Called to adjust settings
- `theme` (object): Theme colors

**Usage:**
```jsx
<WelcomeToTreehouse
  companion={selectedCompanion}
  companionName="Fluffy"
  onEnter={handleEnterTreehouse}
  onSettings={handleAdjustSettings}
  theme={themeColors.cool}
/>
```

## Main Game Components

### TreehouseHub
Main treehouse hub showing:
- Treehouse title and "Where to, {playerName}?" greeting
- Companion display with:
  - Emoji and name
  - Current stage label
  - XP progress bar (0-50 towards next stage)
- 7 biome buttons in 2-column grid:
  - Emoji, name, skill category
  - Star count for that biome
  - Checkmark if biome has been played
- Level/XP progress bar
- Badges count and Change Player buttons

**Props:**
- `playerName` (string): Child's name
- `phase` (string): Age phase (seedlings, explorers, navigators)
- `companion` (object): Companion object
- `companionName` (string): Name given to companion
- `totalXp` (number): Total experience points
- `level` (number): Current level
- `stars` (number): Total stars earned
- `biomesPlayed` (Set): Set of biome IDs played
- `biomeStars` (object): Stars per biome
- `earnedBadges` (Set): Earned badge IDs
- `onStartQuest(biome)` (function): Called when biome selected
- `onShowBadges` (function): Called to show badges
- `onChangePlayer` (function): Called to change player
- `theme` (object): Theme colors

**Usage:**
```jsx
<TreehouseHub
  playerName="Sarah"
  phase="explorers"
  companion={foxCompanion}
  companionName="Fluffy"
  totalXp={120}
  level={3}
  stars={8}
  biomesPlayed={new Set(['communication', 'harmony'])}
  biomeStars={{ communication: 2, harmony: 3 }}
  earnedBadges={new Set(['explorer', 'kind'])}
  onStartQuest={handleStartQuest}
  onShowBadges={handleShowBadges}
  onChangePlayer={handleChangePlayer}
  theme={themeColors.cool}
/>
```

## Data Constants

The `src/data/constants.js` file exports:

### COMPANIONS
Array of companion objects with:
- `id`: "fox", "owl", "bunny", or "cat"
- `emoji`: Unicode emoji character
- `name`: Display name
- `stages`: Array of 3 stage objects with label, suffix, and desc

**Example:**
```javascript
{
  id: "fox",
  emoji: "🦊",
  name: "Fox",
  stages: [
    { label: "Kit", suffix: "🐾", desc: "A tiny fox kit..." },
    { label: "Young Fox", suffix: "💕", desc: "Growing braver..." },
    { label: "Wise Fox", suffix: "✨", desc: "A wise and loyal..." }
  ]
}
```

### BIOMES
Array of 7 biome objects with:
- `id`: Unique identifier
- `name`: Display name
- `emoji`: Unicode emoji
- `color`: Hex color code
- `skill`: Skill category
- `mascot`: Biome mascot name

**Example:**
```javascript
{
  id: "communication",
  name: "Communication Cove",
  emoji: "🐙",
  color: "#7EC8E3",
  skill: "Communication",
  mascot: "Coral"
}
```

### companionStage(xp, companionObj)
Function that determines companion stage based on XP:
- XP 0-49: Stage 0 (🐾)
- XP 50-199: Stage 1 (💕)
- XP 200+: Stage 2 (✨)

**Example:**
```javascript
const stage = companionStage(120, foxCompanion);
// Returns: { label: "Young Fox", suffix: "💕", desc: "..." }
```

### THEME_COLORS
Object with three theme presets:
- `cool`: Blue theme (#F0F7FF bg, #2B579A accent)
- `warm`: Warm orange theme (#FFF8F0 bg, #8B5E3C accent)
- `neutral`: Gray theme (#F5F5F3 bg, #555555 accent)

### AGE_GROUPS
Array of 3 age group objects with:
- `id`: "seedlings", "explorers", or "navigators"
- `label`: Display name
- `emoji`: Group emoji
- `ages`: Age range text

## Styling Notes

- All components use inline styles for portability
- Theme colors are passed via props
- Gradient backgrounds use: `linear-gradient(180deg, {bg} 0%, #E8F4FD 100%)`
- Button accent color: #2B579A
- Primary button style: dark accent background with white text
- Secondary button style: transparent with underline
- Hover effects use CSS transitions
- Animations: float (3s), bounce (1s), fadeIn, etc.

## Integration Example

```jsx
import React, { useState } from 'react';
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
import { THEME_COLORS } from './data';

export default function GentleGroveApp() {
  const [screen, setScreen] = useState('login'); // login, profiles, onboarding, treehouse
  const [theme] = useState(THEME_COLORS.cool);
  // ... manage auth, profiles, onboarding state ...

  if (screen === 'login') {
    return <WelcomeScreen {...} />;
  }
  // ... handle other screens
}
```
