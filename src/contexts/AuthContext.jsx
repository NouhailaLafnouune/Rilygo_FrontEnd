import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { syncUserWithBackend } from '../services/userService.js';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { AuthContext } from '../hooks/useAuth.js';
async function syncAndGetProfile(user) {
  const token = await user.getIdToken(true); 
  const profile = await syncUserWithBackend(token, {
    email:             user.email,
    photoUrl:          user.photoURL      ?? null,
    phone:             user.phoneNumber   ?? null,
    preferredLanguage: 'FR',
  });
  return profile;
}
function decodeToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');
    return JSON.parse(atob(parts[1]));
  } catch (error) {
    console.error('Token decode failed:', error);
    return null;
  }
}
async function refreshRoleWithRetry(user, setRole, maxRetries = 5, delayMs = 500) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const token = await user.getIdToken(true);
      const claims = decodeToken(token);
      if (claims?.role) {
        setRole(claims.role);
        return claims.role;
      }
      if (attempt < maxRetries - 1) {
        const backoffDelay = delayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    } catch (error) {
      console.error(`Token refresh attempt ${attempt + 1} failed:`, error);
      if (attempt === maxRetries - 1) throw error;
      const backoffDelay = delayMs * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  throw new Error('Failed to refresh role after max retries');
}
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [role,        setRole       ] = useState(null);   
  const [loading,     setLoading    ] = useState(true);
  async function signup(email, password, displayName) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName });
    await sendEmailVerification(user);
    const profile = await syncAndGetProfile(user);
    setRole(profile.role ?? null);
  }
  async function login(email, password) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const profile  = await syncAndGetProfile(user);
    setRole(profile.role ?? null);
  }
  async function loginWithGoogle() {
    const provider   = new GoogleAuthProvider();
    const { user }   = await signInWithPopup(auth, provider);
    const profile    = await syncAndGetProfile(user);
    setRole(profile.role ?? null);
    return user;
  }
  function logout() {
    setRole(null);
    return signOut(auth);
  }
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }
  async function sendVerificationEmail() {
    if (currentUser) await sendEmailVerification(currentUser);
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await syncAndGetProfile(user);
          setRole(profile.role ?? null);
        } catch (err) {
          console.error('Sync on auth state change failed:', err);
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  const value = {
    currentUser,
    role,               
    loading,
    signup,
    loginWithGoogle,
    login,
    logout,
    resetPassword,
    sendVerificationEmail,
    refreshRole: () => {
      if (currentUser) {
        return refreshRoleWithRetry(currentUser, setRole);
      }
      return Promise.reject(new Error('No user logged in'));
    },
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}