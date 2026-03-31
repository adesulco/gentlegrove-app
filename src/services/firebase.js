/**
 * Firebase Configuration and Initialization
 *
 * Initializes Firebase app, Auth, and Firestore services for GentleGrove.
 * Uses environment variables with hardcoded fallbacks for deployment.
 *
 * Note: Firebase client-side keys are safe to expose in frontend code.
 * Security is enforced through Firebase Security Rules, not key secrecy.
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyB2gJ3apAw0C_6nxbeGS6JfF8Vm1OHzKlU',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'gentlegrove-6d0b7.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'gentlegrove-6d0b7',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'gentlegrove-6d0b7.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '715458594854',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:715458594854:web:0294f913f4eb805f0e3ee7',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

export default app;
