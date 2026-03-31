/**
 * Firestore Database Service for GentleGrove
 *
 * Handles all Firestore CRUD operations for parent profiles, child profiles,
 * and game sessions. Uses the following Firestore structure:
 *
 * /parents/{parentId}
 *   - contact: string (email or mobile)
 *   - contactType: "email" | "mobile"
 *   - createdAt: timestamp
 *   - updatedAt: timestamp
 *
 *   /children/{childUsername}
 *     - playerName: string
 *     - phase: "seedlings" | "explorers" | "navigators"
 *     - companion: { id, emoji, name, stages[] }
 *     - companionName: string
 *     - stars: number
 *     - totalXp: number
 *     - level: number
 *     - biomesPlayed: string[]
 *     - biomeStars: { [biomeId]: number }
 *     - harmonyCount: number
 *     - earnedBadges: string[]
 *     - settings: { theme, animSpeed, sound, fontSize, reduceMotion, screenTime }
 *     - createdAt: timestamp
 *     - updatedAt: timestamp
 *
 *     /sessions/{sessionId}
 *       - startTime: timestamp
 *       - endTime: timestamp
 *       - biomesPlayed: string[]
 *       - xpEarned: number
 *       - starsEarned: number
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Saves or updates a parent profile in Firestore
 *
 * @param {string} parentId - Firebase UID of the parent
 * @param {Object} data - Parent profile data
 * @param {string} data.contact - Email or mobile number
 * @param {string} data.contactType - "email" or "mobile"
 * @returns {Promise<void>}
 * @throws {Error} Firestore error
 *
 * @example
 * await saveParentProfile(parentId, {
 *   contact: 'parent@email.com',
 *   contactType: 'email'
 * });
 */
export const saveParentProfile = async (parentId, data) => {
  try {
    const parentRef = doc(db, 'parents', parentId);
    const timestamp = serverTimestamp();

    await setDoc(
      parentRef,
      {
        ...data,
        updatedAt: timestamp,
        // Only set createdAt on first creation
        ...(!(await getDoc(parentRef)).exists() && { createdAt: timestamp }),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving parent profile:', error.message);
    throw error;
  }
};

/**
 * Retrieves a parent profile from Firestore
 *
 * @param {string} parentId - Firebase UID of the parent
 * @returns {Promise<Object|null>} Parent profile data or null if not found
 * @throws {Error} Firestore error
 *
 * @example
 * const parentData = await getParentProfile(parentId);
 */
export const getParentProfile = async (parentId) => {
  try {
    const parentRef = doc(db, 'parents', parentId);
    const docSnap = await getDoc(parentRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting parent profile:', error.message);
    throw error;
  }
};

/**
 * Saves or updates a child profile under a parent
 *
 * @param {string} parentId - Firebase UID of the parent
 * @param {string} childUsername - Unique username for the child
 * @param {Object} data - Child profile data (playerName, phase, companion, stars, etc.)
 * @returns {Promise<void>}
 * @throws {Error} Firestore error
 *
 * @example
 * await saveChildProfile(parentId, 'child1', {
 *   playerName: 'Alex',
 *   phase: 'seedlings',
 *   companion: { id: 'companion_1', emoji: '🌱', name: 'Sprout' },
 *   stars: 100,
 *   totalXp: 500,
 *   level: 5,
 * });
 */
export const saveChildProfile = async (parentId, childUsername, data) => {
  try {
    const childRef = doc(db, 'parents', parentId, 'children', childUsername);
    const timestamp = serverTimestamp();

    await setDoc(
      childRef,
      {
        ...data,
        updatedAt: timestamp,
        // Only set createdAt on first creation
        ...(!(await getDoc(childRef)).exists() && { createdAt: timestamp }),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving child profile:', error.message);
    throw error;
  }
};

/**
 * Retrieves a specific child profile
 *
 * @param {string} parentId - Firebase UID of the parent
 * @param {string} childUsername - Username of the child
 * @returns {Promise<Object|null>} Child profile data or null if not found
 * @throws {Error} Firestore error
 *
 * @example
 * const childData = await getChildProfile(parentId, 'child1');
 */
export const getChildProfile = async (parentId, childUsername) => {
  try {
    const childRef = doc(db, 'parents', parentId, 'children', childUsername);
    const docSnap = await getDoc(childRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting child profile:', error.message);
    throw error;
  }
};

/**
 * Retrieves all children under a parent
 *
 * @param {string} parentId - Firebase UID of the parent
 * @returns {Promise<Array<Object>>} Array of child profiles
 * @throws {Error} Firestore error
 *
 * @example
 * const children = await getChildrenProfiles(parentId);
 * children.forEach(child => console.log(child.playerName));
 */
export const getChildrenProfiles = async (parentId) => {
  try {
    const childrenRef = collection(db, 'parents', parentId, 'children');
    const querySnapshot = await getDocs(childrenRef);

    const children = [];
    querySnapshot.forEach((doc) => {
      children.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return children;
  } catch (error) {
    console.error('Error getting children profiles:', error.message);
    throw error;
  }
};

/**
 * Deletes a child profile
 *
 * @param {string} parentId - Firebase UID of the parent
 * @param {string} childUsername - Username of the child
 * @returns {Promise<void>}
 * @throws {Error} Firestore error
 *
 * @example
 * await deleteChildProfile(parentId, 'child1');
 */
export const deleteChildProfile = async (parentId, childUsername) => {
  try {
    const childRef = doc(db, 'parents', parentId, 'children', childUsername);
    await deleteDoc(childRef);
  } catch (error) {
    console.error('Error deleting child profile:', error.message);
    throw error;
  }
};

/**
 * Logs a game session for a child
 *
 * @param {string} parentId - Firebase UID of the parent
 * @param {string} childUsername - Username of the child
 * @param {Object} sessionData - Session data to log
 * @param {Date} sessionData.startTime - Session start time
 * @param {Date} sessionData.endTime - Session end time
 * @param {string[]} sessionData.biomesPlayed - Array of biome IDs played
 * @param {number} sessionData.xpEarned - XP earned in session
 * @param {number} sessionData.starsEarned - Stars earned in session
 * @returns {Promise<string>} Document ID of the logged session
 * @throws {Error} Firestore error
 *
 * @example
 * const sessionId = await logSession(parentId, 'child1', {
 *   startTime: new Date(),
 *   endTime: new Date(),
 *   biomesPlayed: ['biome_1', 'biome_2'],
 *   xpEarned: 50,
 *   starsEarned: 3,
 * });
 */
export const logSession = async (parentId, childUsername, sessionData) => {
  try {
    const sessionsRef = collection(
      db,
      'parents',
      parentId,
      'children',
      childUsername,
      'sessions'
    );

    // Create a new document with auto-generated ID
    const newSessionRef = doc(sessionsRef);

    await setDoc(newSessionRef, {
      ...sessionData,
      startTime: serverTimestamp(),
      endTime: serverTimestamp(),
    });

    return newSessionRef.id;
  } catch (error) {
    console.error('Error logging session:', error.message);
    throw error;
  }
};

/**
 * Retrieves recent game sessions for a child
 *
 * @param {string} parentId - Firebase UID of the parent
 * @param {string} childUsername - Username of the child
 * @param {number} [limitCount=10] - Maximum number of sessions to retrieve
 * @returns {Promise<Array<Object>>} Array of session records, most recent first
 * @throws {Error} Firestore error
 *
 * @example
 * const sessions = await getRecentSessions(parentId, 'child1', 5);
 * sessions.forEach(session => {
 *   console.log(`Earned ${session.xpEarned} XP on ${session.startTime}`);
 * });
 */
export const getRecentSessions = async (parentId, childUsername, limitCount = 10) => {
  try {
    const sessionsRef = collection(
      db,
      'parents',
      parentId,
      'children',
      childUsername,
      'sessions'
    );

    const q = query(sessionsRef, orderBy('startTime', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);

    const sessions = [];
    querySnapshot.forEach((doc) => {
      sessions.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return sessions;
  } catch (error) {
    console.error('Error getting recent sessions:', error.message);
    throw error;
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  saveParentProfile,
  getParentProfile,
  saveChildProfile,
  getChildProfile,
  getChildrenProfiles,
  deleteChildProfile,
  logSession,
  getRecentSessions,
};
