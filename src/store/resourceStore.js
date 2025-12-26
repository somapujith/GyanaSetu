import { create } from 'zustand';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const useResourceStore = create((set, get) => ({
  resources: [],
  favorites: [],
  recentSearches: [],
  loading: false,
  error: null,
  lastVisible: null,
  hasMore: true,

  // Create new resource (with approval workflow)
  createResource: async (resourceData, userId) => {
    try {
      set({ error: null, loading: true });
      const docRef = await addDoc(collection(db, 'resources'), {
        ...resourceData,
        uploadedBy: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'pending', // pending, approved, rejected
        downloads: 0,
        views: 0,
        favorites: 0,
        rating: 0,
        reviewCount: 0,
        tags: resourceData.tags || [],
      });
      return docRef.id;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Fetch all resources
  fetchResources: async (filters = {}) => {
    try {
      set({ error: null, loading: true });
      let q = collection(db, 'resources');

      const constraints = [];
      
      // Build constraints based on filters
      if (filters.category) constraints.push(where('category', '==', filters.category));
      if (filters.college) constraints.push(where('college', '==', filters.college));
      if (filters.status) constraints.push(where('status', '==', filters.status));

      // Apply query with constraints
      if (constraints.length > 0) {
        q = query(q, ...constraints, orderBy('createdAt', 'desc'));
      } else {
        q = query(q, orderBy('createdAt', 'desc'));
      }

      const snapshot = await getDocs(q);
      const resources = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      set({ resources });
      return resources;
    } catch (error) {
      // If index error, try without ordering (fallback)
      if (error.code === 'failed-precondition' || error.message.includes('index')) {
        console.warn('Index not available, fetching without order:', error.message);
        try {
          let fallbackQuery = collection(db, 'resources');
          const constraints = [];
          if (filters.category) constraints.push(where('category', '==', filters.category));
          if (filters.college) constraints.push(where('college', '==', filters.college));
          if (filters.status) constraints.push(where('status', '==', filters.status));
          
          if (constraints.length > 0) {
            fallbackQuery = query(fallbackQuery, ...constraints);
          }
          
          const snapshot = await getDocs(fallbackQuery);
          const resources = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          
          // Sort client-side
          resources.sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(0);
            const dateB = b.createdAt?.toDate?.() || new Date(0);
            return dateB - dateA;
          });
          
          set({ resources });
          return resources;
        } catch (fallbackError) {
          set({ error: fallbackError.message });
          throw fallbackError;
        }
      }
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Fetch user's resources
  fetchUserResources: async (userId) => {
    try {
      set({ error: null, loading: true });
      const q = query(
        collection(db, 'resources'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const resources = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return resources;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Search resources
  searchResources: async (searchTerm) => {
    try {
      set({ error: null, loading: true });
      const q = query(
        collection(db, 'resources'),
        orderBy('title'),
        where('title', '>=', searchTerm),
        where('title', '<=', searchTerm + '\uf8ff')
      );
      const snapshot = await getDocs(q);
      const resources = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return resources;
    } catch (error) {
      // Fallback to client-side search if query fails
      const allResources = get().resources;
      const filtered = allResources.filter(
        (r) =>
          r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return filtered;
    } finally {
      set({ loading: false });
    }
  },

  // Update resource
  updateResource: async (resourceId, updates) => {
    try {
      set({ error: null });
      await updateDoc(doc(db, 'resources', resourceId), updates);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Delete resource
  deleteResource: async (resourceId) => {
    try {
      set({ error: null });
      await deleteDoc(doc(db, 'resources', resourceId));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Request resource
  requestResource: async (resourceId, userId, message) => {
    try {
      set({ error: null });
      const resourceRef = doc(db, 'resources', resourceId);
      const resource = get().resources.find((r) => r.id === resourceId);

      const newRequest = {
        userId,
        message,
        createdAt: serverTimestamp(),
        status: 'pending',
      };

      await updateDoc(resourceRef, {
        requests: [...(resource.requests || []), newRequest],
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Toggle favorite
  toggleFavorite: async (resourceId, userId) => {
    try {
      set({ error: null });
      const favorites = get().favorites;
      const isFavorited = favorites.includes(resourceId);

      if (isFavorited) {
        // Remove from favorites
        await deleteDoc(doc(db, 'favorites', `${userId}_${resourceId}`));
        set({ favorites: favorites.filter((id) => id !== resourceId) });
      } else {
        // Add to favorites
        await addDoc(collection(db, 'favorites'), {
          userId,
          resourceId,
          createdAt: serverTimestamp(),
        });
        set({ favorites: [...favorites, resourceId] });
      }

      // Update resource favorites count
      const resourceRef = doc(db, 'resources', resourceId);
      await updateDoc(resourceRef, {
        favorites: increment(isFavorited ? -1 : 1),
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Fetch user favorites
  fetchFavorites: async (userId) => {
    try {
      set({ error: null, loading: true });
      const q = query(collection(db, 'favorites'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const favoriteIds = snapshot.docs.map((doc) => doc.data().resourceId);
      set({ favorites: favoriteIds });
      return favoriteIds;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
