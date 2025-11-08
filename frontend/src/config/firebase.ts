import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// These should be in environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBBBGPRerBRlvZ2qxZhe2XvRyCsHLEtY4Q',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'hackcbs-37dec.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'hackcbs-37dec',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'hackcbs-37dec.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '811853199475',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:811853199475:web:c9336ac86eff817045d206',
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;

