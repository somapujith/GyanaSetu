import { create } from 'zustand';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const useResourceStore = create((set, get) => ({
  resources: [],
  loading: false,
  error: null,

  // Create new resource
  createResource: async (resourceData) => {
    try {
      set({ error: null, loading: true });
      const docRef = await addDoc(collection(db, 'resources'), {
        ...resourceData,
        createdAt: new Date().toISOString(),
        requests: [],
        status: 'available',
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
      if (filters.category) constraints.push(where('category', '==', filters.category));
      if (filters.college) constraints.push(where('college', '==', filters.college));
      if (filters.status) constraints.push(where('status', '==', filters.status));

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
        createdAt: new Date().toISOString(),
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
}));
