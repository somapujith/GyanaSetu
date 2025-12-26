import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const useAuthStore = create((set) => ({
  user: null,
  userProfile: null,
  loading: true,
  error: null,

  // Initialize auth state
  initAuth: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user profile from Firestore
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        set({
          user,
          userProfile: docSnap.exists() ? docSnap.data() : null,
          loading: false,
        });
      } else {
        set({ user: null, userProfile: null, loading: false });
      }
    });
  },

  // Register new user
  register: async (email, password, college, fullName, role = 'student', rollNo = '') => {
    try {
      set({ error: null });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userProfile = {
        uid: user.uid,
        email,
        fullName,
        college,
        role,
        rollNo: role === 'student' ? rollNo : '',
        createdAt: new Date().toISOString(),
        avatar: null,
        bio: '',
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      set({ user, userProfile });
      return user;
    } catch (error) {
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'Email already registered'
        : error.message;
      set({ error: errorMessage });
      throw error;
    }
  },

  // Login user
  login: async (email, password, role = 'student') => {
    try {
      set({ error: null });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user profile
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      const userProfile = docSnap.data();

      // Verify role matches
      if (userProfile?.role !== role) {
        throw new Error(`Invalid login. Expected ${role}, but account is ${userProfile?.role || 'undefined'}`);
      }

      set({ user, userProfile });
      return user;
    } catch (error) {
      const errorMessage = error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'
        ? 'Invalid email or password'
        : error.message;
      set({ error: errorMessage });
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, userProfile: null, error: null });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));
