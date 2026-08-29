import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArchitectureStore } from '../services/useArchitectureStore';
import { architectureService } from '../services/architectureService';
import ArchitectureCard from '../components/ArchitectureCard';
import { Plus, Search, Home, Loader, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useArchitectureStore();

  const [architectures, setArchitectures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Load architectures
  useEffect(() => {
    const loadArchitectures = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await architectureService.getUserArchitectures();
        setArchitectures(data);
      } catch (err) {
        setError('Failed to load architectures');
        toast.error('Failed to load architectures');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadArchitectures();
    }
  }, [user]);

  // Filter & Sort
  const filteredArchitectures = architectures
    .filter(arch =>
      arch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      arch.prompt_input.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const handleDelete = (id) => {
    setArchitectures(prev => prev.filter(arch => arch.id !== id));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Home"
            >
              <Home className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-blue-600">Archviz</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              <span className="font-semibold">{user.name}</span>
            </span>
            <button
              onClick={() => {
                localStorage.removeItem('auth_token');
                window.location.href = '/';
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">My Architectures</h2>
              <p className="text-gray-600">
                {architectures.length} {architectures.length === 1 ? 'architecture' : 'architectures'} saved
              </p>
            </div>
            <button
              onClick={() => navigate('/generator')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              Create New
            </button>
          </div>

          {/* Search & Sort */}
          <div className="flex gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search architectures..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading your architectures...</p>
          </div>
        ) : error ? (
          // Error State
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error Loading Architectures</h3>
              <p className="text-red-800 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredArchitectures.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📐</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Architectures Yet</h3>
            <p className="text-gray-600 mb-8">
              {searchTerm ? 'No architectures match your search.' : 'Create your first architecture diagram with AI!'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/generator')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                <Plus className="w-5 h-5" />
                Create Your First Architecture
              </button>
            )}
          </div>
        ) : (
          // Grid of Cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArchitectures.map(architecture => (
              <ArchitectureCard
                key={architecture.id}
                architecture={architecture}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}