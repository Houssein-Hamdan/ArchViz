import { create } from 'zustand';

export const useArchitectureStore = create((set) => ({
  // State
  currentArchitecture: null,
  savedArchitectures: [],
  isLoading: true,
  error: null,
  user: null,
  isDarkMode: localStorage.getItem('theme') === 'dark' || 
             (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches),

  // Actions
  setCurrentArchitecture: (architecture) => set({ currentArchitecture: architecture }),
  setSavedArchitectures: (architectures) => set({ savedArchitectures: architectures }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setUser: (user) => set({ user }),
  
  setDarkMode: (isDarkMode) => {
    set({ isDarkMode });
    
    // Update DOM
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  },

  // Clear
  clearCurrent: () => set({ currentArchitecture: null }),
  clearError: () => set({ error: null }),
}));