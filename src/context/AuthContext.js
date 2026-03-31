/**
 * Authentication Context for GentleGrove
 *
 * Provides authentication state and methods to the entire app.
 * Manages parent login/registration, auto-login on page load, and parent profile data.
 *
 * Usage in components:
 * const { currentUser, parentData, loading, login, register, logout } = useContext(AuthContext);
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';
import * as dataService from '../services/dataService';

export const AuthContext = createContext();

/**
 * AuthProvider component that wraps the app
 * Manages auth state and provides auth methods
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement}
 *
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Loads parent profile data from database
   * Called when user logs in
   *
   * @param {string} userId - Firebase UID
   * @throws {Error} Database error
   */
  const loadParentProfile = useCallback(async (userId) => {
    try {
      const profile = await dataService.getParentProfile(userId);
      setParentData(profile);
    } catch (err) {
      console.error('Error loading parent profile:', err.message);
      setError(err.message);
    }
  }, []);

  /**
   * Sets up auth state listener on mount
   * Automatically logs in user if they have an active session
   */
  useEffect(() => {
    const unsubscribe = authService.onAuthChange(async (user) => {
      setLoading(true);
      setError(null);

      if (user) {
        setCurrentUser(user);
        await loadParentProfile(user.uid);
      } else {
        setCurrentUser(null);
        setParentData(null);
      }

      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [loadParentProfile]);

  /**
   * Registers a new parent account
   *
   * @param {string} contact - Email or mobile number
   * @param {string} pin - 4+ digit PIN
   * @returns {Promise<void>}
   * @throws {Error} Auth or database error
   *
   * @example
   * await register('parent@email.com', '1234');
   * await register('+1234567890', '5678');
   */
  const register = useCallback(async (contact, pin) => {
    try {
      setError(null);
      setLoading(true);

      const { user, contactType } = await authService.registerParent(contact, pin);

      // Create parent profile in database
      await dataService.saveParentProfile(user.uid, {
        contact,
        contactType,
      });

      setCurrentUser(user);
      await loadParentProfile(user.uid);
    } catch (err) {
      console.error('Registration error:', err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadParentProfile]);

  /**
   * Signs in an existing parent
   *
   * @param {string} contact - Email or mobile number
   * @param {string} pin - 4+ digit PIN
   * @returns {Promise<void>}
   * @throws {Error} Auth error
   *
   * @example
   * await login('parent@email.com', '1234');
   * await login('+1234567890', '5678');
   */
  const login = useCallback(async (contact, pin) => {
    try {
      setError(null);
      setLoading(true);

      const user = await authService.signInParent(contact, pin);

      setCurrentUser(user);
      await loadParentProfile(user.uid);
    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadParentProfile]);

  /**
   * Signs out the current parent
   *
   * @returns {Promise<void>}
   * @throws {Error} Auth error
   *
   * @example
   * await logout();
   */
  const logout = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      await authService.signOutParent();

      setCurrentUser(null);
      setParentData(null);
    } catch (err) {
      console.error('Logout error:', err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    currentUser,
    parentData,
    loading,
    error,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
