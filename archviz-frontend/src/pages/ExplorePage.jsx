import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArchitectureStore } from '../services/useArchitectureStore';
import ArchitectureExploreCard from '../components/Explore/ArchitectureExploreCard';
import ThemeToggle from '../components/ThemeToggle';
import { Home, Search, Filter, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import { architectureService } from '../services/architectureService';

export default function ExplorePage() {
  const navigate = useNavigate();
  const { user } = useArchitectureStore();

  // Local component states
  const [architectures, setArchitectures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [allTechs, setAllTechs] = useState([]);

  // Fetch public architectures on component mount
  useEffect(() => {
    const loadArchitectures = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await architectureService.getPublicArchitectures();
        
        // Handle variations in paginated API response structures
        const archData = response.data ? response.data : response;
        const architecturesArray = Array.isArray(archData) ? archData : archData.data || [];
        
        setArchitectures(architecturesArray);

        // Extract and aggregate unique tech stacks for the dropdown filter
        const techs = new Set();
        architecturesArray.forEach(arch => {
          if (arch.tech_stack) {
            arch.tech_stack.split(',').forEach(tech => {
              techs.add(tech.trim());
            });
          }
        });
        setAllTechs(Array.from(techs).sort());
      } catch (err) {
        console.error('Error loading architectures:', err);
        setError('Failed to load architectures');
        toast.error('Failed to load architectures');
      } finally {
        setIsLoading(false);
      }
    };

    loadArchitectures();
  }, []);

  // Filter & sort architectures in-memory based on user inputs
  const filteredArchitectures = architectures
    .filter(arch => {
      const matchesSearch = arch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            arch.prompt_input.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTech = !techFilter || 
                          (arch.tech_stack && arch.tech_stack.toLowerCase().includes(techFilter.toLowerCase()));
      return matchesSearch && matchesTech;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === 'popular') {
        return b.views_count - a.views_count;
      } else if (sortBy === 'trending') {
        return b.likes_count - a.likes_count;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header Bar */}
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
              Archviz - Explore
            </h1>
          </div>

          {/* Action controls */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => navigate('/bookmarks')}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
            >
              🔖 My Bookmarks
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

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Title & Subtitle */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">
            🔍 Explore Architectures
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and learn from {architectures.length} community-created software architectures
          </p>
        </div>

        {/* Search Input & Filter Controls */}
        <div className="mb-8 space-y-4 lg:flex lg:gap-4 lg:space-y-0">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search architectures..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tech Stack Selection Filter */}
          <select
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="">All Technologies</option>
            {allTechs.map(tech => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>

          {/* Sorting Control */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Viewed</option>
            <option value="trending">Trending 🔥</option>
          </select>
        </div>

        {/* Data Views: Loading, Error, Empty, or Grid Display */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 animate-spin">
                <svg className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Loading architectures...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
            <p className="text-red-800 dark:text-red-300 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Try Again
            </button>
          </div>
        ) : filteredArchitectures.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl mb-2">🤔</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
              No architectures found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArchitectures.map(architecture => (
              <ArchitectureExploreCard
                key={architecture.id}
                architecture={architecture}
                userHasBookmarked={false} // Placeholder for future state update
                userHasLiked={false} // Placeholder for future state update
              />
            ))}
          </div>
        )}

        {/* Footer Results Count */}
        {!isLoading && !error && (
          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            Showing {filteredArchitectures.length} of {architectures.length} architectures
          </div>
        )}
      </main>
    </div>
  );
}