import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { User } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Converts Firebase user object to application User type
 * 
 * This function normalizes the Firebase user data structure to match
 * our application's User interface, extracting name parts and generating
 * a numeric ID from the Firebase UID.
 * 
 * @param firebaseUser - Firebase user object or null
 * @returns Application User object or null
 */
const convertFirebaseUser = (firebaseUser: FirebaseUser | null): User | null => {
  if (!firebaseUser) return null;
  
  const displayName = firebaseUser.displayName || '';
  const nameParts = displayName.split(' ');
  
  // Generate a numeric ID from the last 8 characters of Firebase UID
  // This provides a consistent numeric identifier for the user
  return {
    id: parseInt(firebaseUser.uid.slice(-8), 16) || 0,
    username: firebaseUser.email?.split('@')[0] || 'user',
    email: firebaseUser.email || '',
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
  };
};

/**
 * Authentication Provider Component
 * 
 * Manages authentication state using Firebase Authentication.
 * Provides authentication methods and user state to all child components.
 * 
 * Features:
 * - Email/password authentication
 * - Google Sign-In
 * - Password reset
 * - Automatic auth state synchronization
 * 
 * @param children - React child components
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Subscribe to Firebase auth state changes
   * 
   * This effect automatically updates the user state whenever
   * the authentication state changes (login, logout, token refresh).
   * The subscription is cleaned up when the component unmounts.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(convertFirebaseUser(firebaseUser));
      setIsLoading(false);
    });

    // Cleanup: Unsubscribe from auth state changes on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const signup = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (firstName || lastName) {
        await updateProfile(userCredential.user, {
          displayName: `${firstName || ''} ${lastName || ''}`.trim() || undefined,
        });
      }
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      throw new Error(error.message || 'Google login failed');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || 'Password reset failed');
    }
  };

  const checkAuth = async () => {
    // Firebase handles this automatically via onAuthStateChanged
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

