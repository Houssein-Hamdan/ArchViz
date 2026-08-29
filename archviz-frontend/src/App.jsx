import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useArchitectureStore } from './services/useArchitectureStore';
import { authService } from './services/authService';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import GeneratorPage from './pages/GeneratorPage';
import DashboardPage from './pages/DashboardPage';
import ViewArchitecturePage from './pages/ViewArchitecturePage';
import ExplorePage from './pages/ExplorePage';
import BookmarksPage from './pages/BookmarksPage';

function AppContent() {
  const { user, setUser, setLoading, isLoading ,setDarkMode} = useArchitectureStore();

  // Check if user is already logged in (has token)
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, [setUser, setLoading]);

  useEffect(() => {
  const initializeAuth = async () => {
    // Initialize theme
    const isDarkMode = localStorage.getItem('theme') === 'dark' ||
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }

    const token = localStorage.getItem('auth_token');
    
    if (token) {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        localStorage.removeItem('auth_token');
        setUser(null);
      }
    }
    
    setLoading(false);
  };

  initializeAuth();
}, [setUser, setLoading, setDarkMode]);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4">
            <div className="animate-spin">
              <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading Archviz...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Protected Routes */}
      <Route
        path="/generator"
        element={
          <ProtectedRoute>
            <GeneratorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Public Shared Route (no auth needed) */}
      <Route path="/share/:slug" element={<ViewArchitecturePage />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
      <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;