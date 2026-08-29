import { useNavigate } from 'react-router-dom';
import { useArchitectureStore } from '../services/useArchitectureStore';
import { ArrowRight, Zap, Share2, Layers } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';


export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useArchitectureStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Archviz</h1>
          <div className="flex gap-4">
           <div className="flex items-center gap-2">
  <ThemeToggle />
  {user ? (
    <>
      <button
        onClick={() => navigate('/explore')}
        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
      >
        🔍 Explore
      </button>
      <button
        onClick={() => navigate('/generator')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Generator
      </button>
      <button
        onClick={() => navigate('/dashboard')}
        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
      >
        Dashboard
      </button>
      <button
        onClick={() => navigate('/bookmarks')}
        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
      >
        🔖 Bookmarks
      </button>
    </>
  ) : (
    <button
      onClick={() => navigate('/auth')}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Get Started
    </button>
  )}
</div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">
          Design Software Architecture with AI
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Describe your project idea and let AI generate a complete architecture diagram with data flow
        </p>

        <button
          onClick={() => navigate(user ? '/generator' : '/auth')}
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Start Creating <ArrowRight className="w-5 h-5" />
        </button>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">AI Powered</h3>
            <p className="text-gray-600">
              Uses AI to generate architectures instantly
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <Layers className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Editable Diagrams</h3>
            <p className="text-gray-600">
              Drag, drop, and customize every node and connection
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <Share2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Easy Sharing</h3>
            <p className="text-gray-600">
              Get a unique link to share diagrams with your team
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}