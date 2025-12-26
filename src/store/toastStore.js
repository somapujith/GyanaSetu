import { create } from 'zustand';

let toastId = 0;

const useToastStore = create((set) => ({
  toasts: [],

  addToast: (message, type = 'info', duration = 3000) => {
    const id = toastId++;
    const toast = { id, message, type, duration };
    
    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  showToast: (message, type = 'info', duration = 3000) => {
    return useToastStore.getState().addToast(message, type, duration);
  },

  showSuccess: (message, duration) => {
    return useToastStore.getState().addToast(message, 'success', duration);
  },

  showError: (message, duration) => {
    return useToastStore.getState().addToast(message, 'error', duration);
  },

  success: (message, duration) => {
    return useToastStore.getState().addToast(message, 'success', duration);
  },

  error: (message, duration) => {
    return useToastStore.getState().addToast(message, 'error', duration);
  },

  warning: (message, duration) => {
    return useToastStore.getState().addToast(message, 'warning', duration);
  },

  info: (message, duration) => {
    return useToastStore.getState().addToast(message, 'info', duration);
  },
}));

// Support both named and default exports
export { useToastStore };
export default useToastStore;
