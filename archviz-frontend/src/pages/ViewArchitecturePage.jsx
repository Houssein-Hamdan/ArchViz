import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { architectureService } from '../services/architectureService';
import DiagramCanvas from '../components/DiagramEditor/DiagramCanvas';
import ThemeToggle from '../components/ThemeToggle';
import { Home, Loader, AlertCircle, Copy, Eye, Heart, Bookmark } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ViewArchitecturePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [architecture, setArchitecture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    const loadArchitecture = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await architectureService.getSharedArchitecture(slug);
        
        // Handle both direct data or wrapped response
        const archData = response.data ? response.data : response;
        setArchitecture(archData);
      } catch (err) {
        console.error('Error loading architecture:', err);
        setError('Architecture not found or not shared publicly');
      } finally {
        setIsLoading(false);
      }
    };

    loadArchitecture();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading architecture...</p>
        </div>
      </div>
    );
  }

  if (error || !architecture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">Oops!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Archviz</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Shared Architecture</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied!');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition font-medium"
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!showCanvas ? (
          // Preview View
          <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-3">
                {architecture.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {architecture.diagram_json?.summary}
              </p>

              {/* Author */}
              {architecture.user && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  by <span className="font-semibold text-gray-900 dark:text-gray-50">
                    {architecture.user.name}
                  </span>
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 py-6 border-t border-b dark:border-gray-700">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-900 dark:text-gray-50 text-2xl font-bold">
                    <Eye className="w-5 h-5" />
                    {architecture.views_count || 0}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Views</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-900 dark:text-gray-50 text-2xl font-bold">
                    <Heart className="w-5 h-5" />
                    {architecture.likes_count || 0}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Likes</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-900 dark:text-gray-50 text-2xl font-bold">
                    <Bookmark className="w-5 h-5" />
                    {architecture.bookmarks_count || 0}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Saved</p>
                </div>
                <div className="text-center">
                  <div className="text-gray-900 dark:text-gray-50 text-2xl font-bold">
                    {architecture.diagram_json?.nodes?.length || 0}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Components</p>
                </div>
              </div>

              {/* Tech Stack */}
              {architecture.tech_stack && (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {architecture.tech_stack.split(',').map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* View Diagram Button */}
              <button
                onClick={() => setShowCanvas(true)}
                className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold rounded-lg transition"
              >
                📐 View Interactive Diagram
              </button>
            </div>

            {/* Data Flow */}
            {architecture.diagram_json?.flow && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6">
                  Data Flow
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
                  {architecture.diagram_json.flow.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-gray-50">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Architecture Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6">
                Architecture Components
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
                {architecture.diagram_json?.nodes?.map(node => (
                  <div key={node.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 dark:text-gray-50 mb-2">{node.label}</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      <span className="font-semibold">Technology:</span> {node.technology}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      <span className="font-semibold">Role:</span> {node.role}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">Why:</span> {node.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Decisions & Tradeoffs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {architecture.diagram_json?.decisions && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6">
                    Key Decisions
                  </h3>
                  <div className="space-y-4">
                    {architecture.diagram_json.decisions.map((dec, idx) => (
                      <div key={idx} className="border-l-4 border-blue-600 dark:border-blue-400 pl-4">
                        <p className="font-bold text-gray-900 dark:text-gray-50 mb-1">
                          {dec.decision}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {dec.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {architecture.diagram_json?.tradeoffs && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6">
                    Tradeoffs
                  </h3>
                  <div className="space-y-4">
                    {architecture.diagram_json.tradeoffs.pros && (
                      <div>
                        <p className="font-bold text-green-700 dark:text-green-400 mb-3">
                          ✓ Pros
                        </p>
                        <ul className="space-y-2">
                          {architecture.diagram_json.tradeoffs.pros.map((pro, idx) => (
                            <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                              • {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {architecture.diagram_json.tradeoffs.cons && (
                      <div>
                        <p className="font-bold text-red-700 dark:text-red-400 mb-3">
                          ✗ Cons
                        </p>
                        <ul className="space-y-2">
                          {architecture.diagram_json.tradeoffs.cons.map((con, idx) => (
                            <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                              • {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Canvas View
          <div>
            <button
              onClick={() => setShowCanvas(false)}
              className="mb-4 px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              ← Back to Details
            </button>
            <div className="h-screen bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <DiagramCanvas
                diagramData={architecture.diagram_json}
                onSaveChanges={() => {}}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}