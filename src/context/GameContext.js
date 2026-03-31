/**
 * Game Context for GentleGrove
 *
 * Manages all game state for the currently selected child profile.
 * Handles auto-save with debounce and provides game state to all components.
 *
 * Usage in components:
 * const {
 *   playerName, phase, companion, stars, totalXp, level,
 *   biomesPlayed, biomeStars, harmonyCount, earnedBadges, settings,
 *   loadChildProfile, saveCurrentProfile, resetGameState
 * } = useContext(GameContext);
 */

import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import * as dataService from '../services/dataService';

export const GameContext = createContext();

/**
 * GameProvider component that wraps game screens
 * Manages game state and auto-save functionality
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.parentId - Firebase UID of the parent
 * @param {string} props.childUsername - Username of the selected child
 * @returns {React.ReactElement}
 *
 * @example
 * <GameProvider parentId={userId} childUsername="child1">
 *   <Game />
 * </GameProvider>
 */
export const GameProvider = ({ children, parentId, childUsername }) => {
  // Player data
  const [playerName, setPlayerName] = useState('');
  const [phase, setPhase] = useState('seedlings');
  const [companion, setCompanion] = useState(null);
  const [companionName, setCompanionName] = useState('');
  const [stars, setStars] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [level, setLevel] = useState(1);

  // Biome data
  const [biomesPlayed, setBiomesPlayed] = useState([]);
  const [biomeStars, setBiomeStars] = useState({});

  // Badge/reward data
  const [harmonyCount, setHarmonyCount] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState([]);

  // Settings
  const [settings, setSettings] = useState({
    theme: 'light',
    animSpeed: 'normal',
    sound: true,
    fontSize: 'medium',
    reduceMotion: false,
    screenTime: 60,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auto-save timer reference
  const saveTimeoutRef = useRef(null);

  /**
   * Auto-saves game state with debounce
   * Prevents excessive database writes
   * Debounce delay: 2 seconds
   */
  const debouncedSave = useCallback(() => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    saveTimeoutRef.current = setTimeout(async () => {
      if (!parentId || !childUsername) return;

      try {
        await dataService.saveChildProfile(parentId, childUsername, {
          playerName,
          phase,
          companion,
          companionName,
          stars,
          totalXp,
          level,
          biomesPlayed,
          biomeStars,
          harmonyCount,
          earnedBadges,
          settings,
        });
      } catch (err) {
        console.error('Error auto-saving game state:', err.message);
      }
    }, 2000);
  }, [parentId, childUsername, playerName, phase, companion, companionName, stars, totalXp, level, biomesPlayed, biomeStars, harmonyCount, earnedBadges, settings]);

  /**
   * Loads child profile and initializes game state
   *
   * @param {string} pId - Parent ID
   * @param {string} cUsername - Child username
   * @throws {Error} Database error
   */
  const loadChildProfile = useCallback(async (pId, cUsername) => {
    try {
      setLoading(true);
      setError(null);

      const profile = await dataService.getChildProfile(pId, cUsername);

      if (profile) {
        setPlayerName(profile.playerName || '');
        setPhase(profile.phase || 'seedlings');
        setCompanion(profile.companion || null);
        setCompanionName(profile.companionName || '');
        setStars(profile.stars || 0);
        setTotalXp(profile.totalXp || 0);
        setLevel(profile.level || 1);
        setBiomesPlayed(profile.biomesPlayed || []);
        setBiomeStars(profile.biomeStars || {});
        setHarmonyCount(profile.harmonyCount || 0);
        setEarnedBadges(profile.earnedBadges || []);
        setSettings(profile.settings || {
          theme: 'light',
          animSpeed: 'normal',
          sound: true,
          fontSize: 'medium',
          reduceMotion: false,
          screenTime: 60,
        });
      }
    } catch (err) {
      console.error('Error loading child profile:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Manually saves current game state (full save, not debounced)
   *
   * @returns {Promise<void>}
   * @throws {Error} Database error
   */
  const saveCurrentProfile = useCallback(async () => {
    if (!parentId || !childUsername) return;

    try {
      setError(null);

      await dataService.saveChildProfile(parentId, childUsername, {
        playerName,
        phase,
        companion,
        companionName,
        stars,
        totalXp,
        level,
        biomesPlayed,
        biomeStars,
        harmonyCount,
        earnedBadges,
        settings,
      });
    } catch (err) {
      console.error('Error saving game state:', err.message);
      setError(err.message);
      throw err;
    }
  }, [parentId, childUsername, playerName, phase, companion, companionName, stars, totalXp, level, biomesPlayed, biomeStars, harmonyCount, earnedBadges, settings]);

  /**
   * Resets game state to default values
   * Used when switching child profiles or resetting game
   */
  const resetGameState = useCallback(() => {
    setPlayerName('');
    setPhase('seedlings');
    setCompanion(null);
    setCompanionName('');
    setStars(0);
    setTotalXp(0);
    setLevel(1);
    setBiomesPlayed([]);
    setBiomeStars({});
    setHarmonyCount(0);
    setEarnedBadges([]);
    setSettings({
      theme: 'light',
      animSpeed: 'normal',
      sound: true,
      fontSize: 'medium',
      reduceMotion: false,
      screenTime: 60,
    });
    setError(null);
  }, []);

  /**
   * Trigger auto-save when game state changes
   */
  useEffect(() => {
    if (!loading) {
      debouncedSave();
    }
  }, [playerName, phase, companion, companionName, stars, totalXp, level, biomesPlayed, biomeStars, harmonyCount, earnedBadges, settings, debouncedSave, loading]);

  /**
   * Cleanup auto-save timer on unmount
   */
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const value = {
    // Player data
    playerName,
    setPlayerName,
    phase,
    setPhase,
    companion,
    setCompanion,
    companionName,
    setCompanionName,
    stars,
    setStars,
    totalXp,
    setTotalXp,
    level,
    setLevel,

    // Biome data
    biomesPlayed,
    setBiomesPlayed,
    biomeStars,
    setBiomeStars,

    // Badge/reward data
    harmonyCount,
    setHarmonyCount,
    earnedBadges,
    setEarnedBadges,

    // Settings
    settings,
    setSettings,

    // State
    loading,
    error,

    // Methods
    loadChildProfile,
    saveCurrentProfile,
    resetGameState,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameContext;
