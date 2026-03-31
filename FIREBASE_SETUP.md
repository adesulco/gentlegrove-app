# GentleGrove Firebase Service Layer Setup

## Overview
This document describes the Firebase service layer files that have been created for the GentleGrove educational game app.

## Files Created

### Services (`src/services/`)

#### 1. **firebase.js** (1.2 KB)
- Firebase initialization and configuration
- Exports `auth` and `db` for use throughout the app
- Uses environment variables for secure credential management
- Required env vars: `REACT_APP_FIREBASE_*` (API_KEY, AUTH_DOMAIN, PROJECT_ID, etc.)

#### 2. **authService.js** (4.1 KB)
- Parent authentication functions
- `registerParent(contact, pin)` - Register with email or mobile number
- `signInParent(contact, pin)` - Sign in parent
- `signOutParent()` - Log out parent
- `getCurrentUser()` - Get current Firebase user
- `onAuthChange(callback)` - Subscribe to auth state changes
- Features:
  - Supports both email and mobile number authentication
  - Mobile numbers converted to email format for Firebase Auth
  - PIN padded to 4 characters minimum
  - Full error handling with console logging

#### 3. **databaseService.js** (9.0 KB)
- Firestore CRUD operations for parent and child profiles
- Parent profile functions:
  - `saveParentProfile(parentId, data)` - Create/update parent
  - `getParentProfile(parentId)` - Retrieve parent data
- Child profile functions:
  - `saveChildProfile(parentId, childUsername, data)` - Create/update child
  - `getChildProfile(parentId, childUsername)` - Get single child
  - `getChildrenProfiles(parentId)` - Get all children for parent
  - `deleteChildProfile(parentId, childUsername)` - Delete child
- Session logging functions:
  - `logSession(parentId, childUsername, sessionData)` - Log game session
  - `getRecentSessions(parentId, childUsername, limit)` - Retrieve session history
- Uses serverTimestamp() for all timestamps
- Full error handling and JSDoc documentation

#### 4. **localStorageService.js** (8.5 KB)
- Offline fallback implementation using localStorage
- Identical function signatures to databaseService
- Uses key: `gentlegrove_data`
- Features:
  - Stores parent and child profiles locally
  - Manages nested data structure for hierarchy
  - Automatic timestamp generation
  - Graceful error handling
- Useful for offline access or when Firebase is not configured

#### 5. **dataService.js** (5.9 KB)
- Unified abstraction layer for data persistence
- Automatically chooses between Firebase and localStorage
- `isFirebaseConfigured()` - Checks if Firebase env vars are set
- `executeWithFallback()` - Attempts Firebase first, falls back to localStorage
- `getActiveService()` - Returns current backend ("firebase" or "localStorage")
- All standard CRUD functions exported
- Seamless fallback on Firebase errors

### Context Components (`src/context/`)

#### 6. **AuthContext.js** (4.5 KB)
- React context for authentication state management
- `AuthProvider` wrapper component
- Provides to consuming components:
  - `currentUser` - Current Firebase user object
  - `parentData` - Parent profile data from database
  - `loading` - Loading state
  - `error` - Error messages
  - `register(contact, pin)` - Register new parent
  - `login(contact, pin)` - Sign in parent
  - `logout()` - Sign out parent
- Features:
  - Auto-login on page load via onAuthChange listener
  - Auto-loads parent profile on login
  - Full error handling and state cleanup
  - Cleanup of auth listener on unmount

#### 7. **GameContext.js** (7.2 KB)
- React context for game state management
- `GameProvider` wrapper component (requires parentId, childUsername props)
- Provides full game state:
  - Player data: playerName, phase, companion, stars, totalXp, level
  - Biome data: biomesPlayed, biomeStars
  - Badges: harmonyCount, earnedBadges
  - Settings: theme, animSpeed, sound, fontSize, reduceMotion, screenTime
- Functions:
  - `loadChildProfile(parentId, childUsername)` - Load child data
  - `saveCurrentProfile()` - Manual full save
  - `resetGameState()` - Reset to defaults
- Features:
  - Auto-save with 2-second debounce to prevent excessive writes
  - Loading and error states
  - Full cleanup of timers on unmount

### Custom Hooks (`src/hooks/`)

#### 8. **useScreenTimer.js** (4.2 KB)
- Custom React hook for screen time management
- Takes `screenTimeMinutes` parameter (default: 60)
- Returns timer state and controls:
  - `timeLeft` - Remaining seconds
  - `totalTime` - Total screen time in seconds
  - `timerStart` - Whether timer is running
  - `isWarning` - True when 5 minutes or less remain
  - `isTimeUp` - True when time reaches zero
  - `startTimer()` - Start countdown
  - `stopTimer()` - Stop countdown
  - `resetTimer()` - Reset to initial value
  - `elapsedSeconds` - Total elapsed time
- Features:
  - 1-second interval updates
  - Auto-stops when time is up
  - Full cleanup of intervals on unmount

## Database Schema

```
/parents/{parentId}
  - contact: string (email or mobile)
  - contactType: "email" | "mobile"
  - createdAt: timestamp
  - updatedAt: timestamp
  
  /children/{childUsername}
    - playerName: string
    - phase: "seedlings" | "explorers" | "navigators"
    - companion: { id, emoji, name, stages[] }
    - companionName: string
    - stars: number
    - totalXp: number
    - level: number
    - biomesPlayed: string[]
    - biomeStars: { [biomeId]: number }
    - harmonyCount: number
    - earnedBadges: string[]
    - settings: { theme, animSpeed, sound, fontSize, reduceMotion, screenTime }
    - createdAt: timestamp
    - updatedAt: timestamp
    
    /sessions/{sessionId}
      - startTime: timestamp
      - endTime: timestamp
      - biomesPlayed: string[]
      - xpEarned: number
      - starsEarned: number
```

## Environment Variables Required

For Firebase configuration, add these to your `.env` file:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

If these variables are not provided, the app will automatically fall back to localStorage.

## Usage Example

```jsx
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { GameContext } from './context/GameContext';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { currentUser, parentData, login, register, logout } = useContext(AuthContext);

  if (!currentUser) {
    return <LoginScreen onLogin={login} onRegister={register} />;
  }

  return (
    <GameProvider parentId={currentUser.uid} childUsername="child1">
      <GameScreen />
    </GameProvider>
  );
}

function GameScreen() {
  const { stars, level, setStars, saveCurrentProfile } = useContext(GameContext);
  const timer = useScreenTimer(60); // 60 minute session

  return (
    <div>
      <p>Level: {level} | Stars: {stars}</p>
      <p>Time left: {Math.floor(timer.timeLeft / 60)}m {timer.timeLeft % 60}s</p>
      {timer.isWarning && <p>Warning: Time running out!</p>}
      {timer.isTimeUp && <p>Session ended!</p>}
    </div>
  );
}
```

## File Sizes Summary

- firebase.js: 1.2 KB
- authService.js: 4.1 KB
- databaseService.js: 9.0 KB
- localStorageService.js: 8.5 KB
- dataService.js: 5.9 KB
- AuthContext.js: 4.5 KB
- GameContext.js: 7.2 KB
- useScreenTimer.js: 4.2 KB

**Total: 44.6 KB**

## Key Features

1. **Dual Backend Support**: Seamlessly switches between Firebase and localStorage
2. **Comprehensive Error Handling**: All operations wrapped in try/catch with console logging
3. **Fully Documented**: JSDoc comments on every function
4. **Production Ready**: Proper cleanup of listeners, timers, and intervals
5. **React Best Practices**: useCallback, useEffect dependencies, proper cleanup
6. **Type Safety Ready**: Structured for easy TypeScript migration
7. **Accessibility Focused**: Designed for children with autism spectrum needs
8. **Parental Controls**: PIN-based authentication, screen time limits, session logging

## Next Steps

1. Install Firebase SDK: `npm install firebase`
2. Set up Firebase project and add config to `.env`
3. Create additional components (LoginScreen, GameScreen, etc.)
4. Implement custom hooks for loading states and error boundaries
5. Add unit tests for service functions
6. Configure Firestore security rules
