/**
 * Unified Data Service for GentleGrove
 *
 * Acts as an abstraction layer that automatically selects between Firebase Firestore
 * and localStorage based on configuration and availability.
 *
 * Uses Firebase when:
 * - REACT_APP_FIREBASE_PROJECT_ID environment variable is set
 *
 * Falls back to localStorage when:
 * - Firebase is not configured
 * - Network is unavailable
 * - Firebase initialization fails
 *
 * Exports the same interface regardless of backend implementation.
 */

import * as databaseService from './databaseService';
import * as localStorageService from './localStorageService';

/**
 * Checks if Firebase is properly configured
 * @returns {boolean} True if Firebase config vars exist
 */
const isFirebaseConfigured = () => {
  return (
    process.env.REACT_APP_FIREBASE_PROJECT_ID &&
    process.env.REACT_APP_FIREBASE_API_KEY &&
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
  );
};

/**
 * Selects the appropriate service (Firebase or localStorage)
 * Attempts to use Firebase first, falls back to localStorage on error
 *
 * @param {Function} firebaseMethod - Firebase service method
 * @param {Function} storageMethod - localStorage service method
 * @param {Array} args - Arguments to pass to the selected method
 * @returns {Promise} Result from the selected method
 */
const executeWithFallback = async (firebaseMethod, storageMethod, args) => {
  // If Firebase is not configured, use localStorage immediately
  if (!isFirebaseConfigured()) {
    try {
      return await storageMethod(...args);
    } catch (error) {
      console.error('localStorage operation failed:', error.message);
      throw error;
    }
  }

  // Try Firebase first
  try {
    return await firebaseMethod(...args);
  } catch (firebaseError) {
    console.warn('Firebase operation failed, falling back to localStorage:', firebaseError.message);

    // Fall back to localStorage
    try {
      return await storageMethod(...args);
    } catch (storageError) {
      console.error('Both Firebase and localStorage operations failed:', storageError.message);
      throw storageError;
    }
  }
};

/**
 * Saves or updates a parent profile
 * @param {string} parentId - Firebase UID of the parent
 * @param {Object} data - Parent profile data
 * @returns {Promise<void>}
 */
export const saveParentProfile = async (parentId, data) => {
  return executeWithFallback(
    databaseService.saveParentProfile,
    localStorageService.saveParentProfile,
    [parentId, data]
  );
};

/**
 * Retrieves a parent profile
 * @param {string} parentId - Firebase UID of the parent
 * @returns {Promise<Object|null>} Parent profile data or null
 */
export const getParentProfile = async (parentId) => {
  return executeWithFallback(
    databaseService.getParentProfile,
    localStorageService.getParentProfile,
    [parentId]
  );
};

/**
 * Saves or updates a child profile under a parent
 * @param {string} parentId - Firebase UID of the parent
 * @param {string} childUsername - Unique username for the child
 * @param {Object} data - Child profile data
 * @returns {Promise<void>}
 */
export const saveChildProfile = async (parentId, childUsername, data) => {
  return executeWithFallback(
    databaseService.saveChildProfile,
    localStorageService.saveChildProfile,
    [parentId, childUsername, data]
  );
};

/**
 * Retrieves a specific child profile
 * @param {string} parentId - Firebase UID of the parent
 * @param {string} childUsername - Username of the child
 * @returns {Promise<Object|null>} Child profile data or null
 */
export const getChildProfile = async (parentId, childUsername) => {
  return executeWithFallback(
    databaseService.getChildProfile,
    localStorageService.getChildProfile,
    [parentId, childUsername]
  );
};

/**
 * Retrieves all children under a parent
 * @param {string} parentId - Firebase UID of the parent
 * @returns {Promise<Array<Object>>} Array of child profiles
 */
export const getChildrenProfiles = async (parentId) => {
  return executeWithFallback(
    databaseService.getChildrenProfiles,
    localStorageService.getChildrenProfiles,
    [parentId]
  );
};

/**
 * Deletes a child profile
 * @param {string} parentId - Firebase UID of the parent
 * @param {string} childUsername - Username of the child
 * @returns {Promise<void>}
 */
export const deleteChildProfile = async (parentId, childUsername) => {
  return executeWithFallback(
    databaseService.deleteChildProfile,
    localStorageService.deleteChildProfile,
    [parentId, childUsername]
  );
};

/**
 * Logs a game session for a child
 * @param {string} parentId - Firebase UID of the parent
 * @param {string} childUsername - Username of the child
 * @param {Object} sessionData - Session data to log
 * @returns {Promise<string>} Session ID
 */
export const logSession = async (parentId, childUsername, sessionData) => {
  return executeWithFallback(
    databaseService.logSession,
    localStorageService.logSession,
    [parentId, childUsername, sessionData]
  );
};

/**
 * Retrieves recent game sessions for a child
 * @param {string} parentId - Firebase UID of the parent
 * @param {string} childUsername - Username of the child
 * @param {number} [limitCount=10] - Maximum number of sessions
 * @returns {Promise<Array<Object>>} Array of session records
 */
export const getRecentSessions = async (parentId, childUsername, limitCount = 10) => {
  return executeWithFallback(
    databaseService.getRecentSessions,
    localStorageService.getRecentSessions,
    [parentId, childUsername, limitCount]
  );
};

/**
 * Gets the current active service (for debugging/logging purposes)
 * @returns {string} "firebase" or "localStorage"
 */
export const getActiveService = () => {
  return isFirebaseConfigured() ? 'firebase' : 'localStorage';
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
  getActiveService,
};
