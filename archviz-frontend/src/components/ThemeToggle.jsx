import { useArchitectureStore } from '../services/useArchitectureStore';
import { Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';

export default function ThemeToggle() {
  const { isDarkMode, setDarkMode } = useArchitectureStore();

  // Apply theme on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      title={isDarkMode ? 'Light mode' : 'Dark mode'}
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
}