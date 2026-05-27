'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase-client';
import { toast } from 'sonner';

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  photoURL?: string;
  newsletterOptIn?: boolean;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, newsletterOptIn?: boolean) => Promise<void>;
  signInWithGoogle: (newsletterOptIn?: boolean) => Promise<{ isNewUser: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Calls the /api/user/setup route which uses the Firebase Admin SDK to:
 *  1. Create the user profile document in Firestore (new users only)
 *  2. Link any orphaned guest orders placed with this email
 *
 * Using the Admin SDK server-side bypasses Firestore security rules and
 * is the correct approach for privileged writes (order linking, profile creation).
 */
async function callSetupApi(user: User, extra?: { displayName?: string; newsletterOptIn?: boolean }): Promise<{ isNewUser: boolean }> {
  const idToken = await user.getIdToken();
  const res = await fetch('/api/user/setup', {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(extra ?? {}),
  });
  if (!res.ok) throw new Error('Failed to set up user profile');
  return res.json();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (uid: string): Promise<UserProfile | null> => {
    try {
      const db = getFirebaseDb();
      const snap = await getDoc(doc(db, 'users', uid));
      return snap.exists() ? (snap.data() as UserProfile) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        let p = await fetchProfile(firebaseUser.uid);
        // Fallback: if the profile is missing and the auth token has a display name
        // (Google users always have one), create the profile via Admin SDK now.
        // This handles edge cases like: browser closed mid-signup, or token refresh
        // after a partial failure. For email/password users still in signUp(), the
        // displayName hasn't propagated yet so we skip — signUp() handles creation.
        if (!p && firebaseUser.displayName) {
          try {
            await callSetupApi(firebaseUser);
            p = await fetchProfile(firebaseUser.uid);
          } catch {
            /* non-critical — profile can be created on next action */
          }
        }
        setProfile(p ?? null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, displayName: string, newsletterOptIn = false) => {
    const auth = getFirebaseAuth();
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    // Set displayName on the Firebase Auth user so it appears in the token
    await updateProfile(user, { displayName });
    // Create profile + link orphaned orders via Admin SDK
    await callSetupApi(user, { displayName, newsletterOptIn });
    // Immediately hydrate profile state without waiting for onAuthStateChanged
    const p = await fetchProfile(user.uid);
    if (p) setProfile(p);
  };

  const signInWithGoogle = async (newsletterOptIn = false): Promise<{ isNewUser: boolean }> => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    // Create profile + link orphaned orders via Admin SDK (idempotent for returning users)
    const { isNewUser } = await callSetupApi(user, { newsletterOptIn });
    // Refresh profile state immediately
    const p = await fetchProfile(user.uid);
    if (p) setProfile(p);
    return { isNewUser };
  };

  const signOut = async () => {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
    toast.success('Signed out successfully.');
  };

  const resetPassword = async (email: string) => {
    const auth = getFirebaseAuth();
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin: profile?.role === 'admin',
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
