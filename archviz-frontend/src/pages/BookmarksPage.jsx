import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArchitectureStore } from '../services/useArchitectureStore';
import ArchitectureExploreCard from '../components/Explore/ArchitectureExploreCard';
import ThemeToggle from '../components/ThemeToggle';
import { Home, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { architectureService } from '../services/architectureService';

export default function BookmarksPage() {
  const navigate = useNavigate();
  const { user } = useArchitectureStore();

  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadBookmarks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await architectureService.getUserBookmarks();
        setBookmarks(data);
      } catch (err) {
        setError('Failed to load bookmarks');
        toast.error('Failed to load bookmarks');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadBookmarks();
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              🔖 My Bookmarks
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => navigate('/explore')}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
            >
              🔍 Explore
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('auth_token');
                window.location.href = '/';
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">
            Saved Architectures
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {bookmarks.length} architecture{bookmarks.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📚</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
              No bookmarks yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start exploring and bookmark your favorite architectures
            </p>
            <button
              onClick={() => navigate('/explore')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              🔍 Go to Explore
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map(arch => (
              <ArchitectureExploreCard
                key={arch.id}
                architecture={arch}
                userHasBookmarked={true}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}