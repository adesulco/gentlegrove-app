/**
 * Authentication Service for GentleGrove
 *
 * Handles parent authentication through Firebase Auth.
 * Supports both email and mobile number login (converted to email format).
 * Uses PIN as password (minimum 4 characters, padded if needed).
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase';

/**
 * Converts a mobile number to a valid email format for Firebase Auth
 * @param {string} mobileNumber - The mobile number (e.g., "+1234567890")
 * @returns {string} Email-like format (e.g., "mobile+1234567890@gentlegrove.app")
 */
const mobileToEmail = (mobileNumber) => {
  // Normalize: remove spaces, dashes, and parentheses
  const normalized = mobileNumber.replace(/[\s\-()]/g, '');
  return `mobile${normalized}@gentlegrove.app`;
};

/**
 * Pads PIN to minimum 4 characters with leading zeros
 * @param {string} pin - The PIN as a string
 * @returns {string} Padded PIN
 */
const padPin = (pin) => {
  return pin.toString().padStart(4, '0');
};

/**
 * Registers a new parent with email and PIN
 *
 * @param {string} contact - Email or mobile number
 * @param {string} pin - 4+ digit PIN
 * @returns {Promise<{user: object, contactType: string}>} User object and contact type
 * @throws {Error} Firebase auth error
 *
 * @example
 * const { user, contactType } = await registerParent('parent@email.com', '1234');
 * const { user, contactType } = await registerParent('+1234567890', '5678');
 */
export const registerParent = async (contact, pin) => {
  try {
    // Determine if contact is email or mobile
    const isEmail = contact.includes('@');
    const email = isEmail ? contact : mobileToEmail(contact);
    const password = padPin(pin);

    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    return {
      user: userCredential.user,
      contactType: isEmail ? 'email' : 'mobile',
    };
  } catch (error) {
    console.error('Error registering parent:', error.message);
    throw error;
  }
};

/**
 * Signs in a parent with email and PIN
 *
 * @param {string} contact - Email or mobile number
 * @param {string} pin - 4+ digit PIN
 * @returns {Promise<object>} User object
 * @throws {Error} Firebase auth error
 *
 * @example
 * const user = await signInParent('parent@email.com', '1234');
 * const user = await signInParent('+1234567890', '5678');
 */
export const signInParent = async (contact, pin) => {
  try {
    const isEmail = contact.includes('@');
    const email = isEmail ? contact : mobileToEmail(contact);
    const password = padPin(pin);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in parent:', error.message);
    throw error;
  }
};

/**
 * Signs out the current parent
 *
 * @returns {Promise<void>}
 * @throws {Error} Firebase auth error
 *
 * @example
 * await signOutParent();
 */
export const signOutParent = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
};

/**
 * Gets the currently authenticated parent user
 *
 * @returns {object|null} Current Firebase user or null
 *
 * @example
 * const user = getCurrentUser();
 * if (user) {
 *   console.log(user.uid, user.email);
 * }
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Subscribes to authentication state changes
 * Useful for updating UI when user logs in/out
 *
 * @param {Function} callback - Called with user object (or null) on auth change
 * @returns {Function} Unsubscribe function
 *
 * @example
 * const unsubscribe = onAuthChange((user) => {
 *   if (user) {
 *     console.log('Parent logged in:', user.uid);
 *   } else {
 *     console.log('Parent logged out');
 *   }
 * });
 *
 * // Later: unsubscribe();
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  registerParent,
  signInParent,
  signOutParent,
  getCurrentUser,
  onAuthChange,
};
