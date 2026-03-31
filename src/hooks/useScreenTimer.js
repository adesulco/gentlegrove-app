/**
 * useScreenTimer Custom Hook
 *
 * Manages screen time countdown for child accounts.
 * Provides timer state and controls with warning at 5 minutes remaining.
 *
 * Features:
 * - Countdown timer based on screen time limit (in minutes)
 * - Warning flag when 5 minutes or less remain
 * - Time-up flag when timer reaches zero
 * - Start/stop controls
 * - Tracks elapsed time
 *
 * Usage:
 * const { timeLeft, timerStart, isWarning, isTimeUp, startTimer, stopTimer } = useScreenTimer(60);
 *
 * @param {number} screenTimeMinutes - Screen time limit in minutes (default: 60)
 * @returns {Object} Timer state and controls
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for managing screen time countdown
 *
 * @param {number} [screenTimeMinutes=60] - Screen time limit in minutes
 * @returns {Object} Timer state and controls
 * @returns {number} return.timeLeft - Remaining seconds
 * @returns {number} return.totalTime - Total screen time in seconds
 * @returns {boolean} return.timerStart - Whether timer is running
 * @returns {boolean} return.isWarning - Whether 5 minutes or less remain
 * @returns {boolean} return.isTimeUp - Whether time is up (0 seconds)
 * @returns {Function} return.startTimer - Start the countdown
 * @returns {Function} return.stopTimer - Stop the countdown
 * @returns {Function} return.resetTimer - Reset timer to initial value
 * @returns {number} return.elapsedSeconds - Total elapsed time in seconds
 *
 * @example
 * const timer = useScreenTimer(60);
 *
 * useEffect(() => {
 *   timer.startTimer();
 * }, []);
 *
 * useEffect(() => {
 *   if (timer.isTimeUp) {
 *     showWarning('Screen time is up!');
 *   } else if (timer.isWarning) {
 *     showWarning('5 minutes remaining');
 *   }
 * }, [timer.isTimeUp, timer.isWarning]);
 *
 * return (
 *   <div>
 *     <p>Time left: {Math.floor(timer.timeLeft / 60)}m {timer.timeLeft % 60}s</p>
 *     <p>{timer.isWarning && 'Warning: Time running out!'}</p>
 *     <p>{timer.isTimeUp && 'Time is up!'}</p>
 *   </div>
 * );
 */
export const useScreenTimer = (screenTimeMinutes = 60) => {
  // Convert minutes to seconds
  const totalSeconds = screenTimeMinutes * 60;

  // Timer state
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [timerStart, setTimerStart] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Refs for interval management
  const intervalRef = useRef(null);

  // Derived state
  const isWarning = timeLeft <= 300 && timeLeft > 0; // 5 minutes or less (in seconds)
  const isTimeUp = timeLeft <= 0;

  /**
   * Starts the timer countdown
   */
  const startTimer = useCallback(() => {
    setTimerStart(true);
  }, []);

  /**
   * Stops the timer countdown
   */
  const stopTimer = useCallback(() => {
    setTimerStart(false);
  }, []);

  /**
   * Resets timer to initial value
   */
  const resetTimer = useCallback(() => {
    setTimeLeft(totalSeconds);
    setElapsedSeconds(0);
    setTimerStart(false);
  }, [totalSeconds]);

  /**
   * Timer interval effect
   * Decrements time every second when timer is running
   */
  useEffect(() => {
    if (!timerStart) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          setTimerStart(false);
          return 0;
        }
        return prev - 1;
      });

      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerStart]);

  /**
   * Auto-stop timer when time is up
   */
  useEffect(() => {
    if (isTimeUp && timerStart) {
      setTimerStart(false);
    }
  }, [isTimeUp, timerStart]);

  /**
   * Cleanup interval on unmount
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeLeft,
    totalTime: totalSeconds,
    timerStart,
    isWarning,
    isTimeUp,
    startTimer,
    stopTimer,
    resetTimer,
    elapsedSeconds,
  };
};

export default useScreenTimer;
