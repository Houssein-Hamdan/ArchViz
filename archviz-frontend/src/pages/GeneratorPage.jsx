import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArchitectureStore } from '../services/useArchitectureStore';
import PromptForm from '../components/Generator/PromptForm';
import DiagramTabs from '../components/Generator/DiagramTabs';
import ThemeToggle from '../components/ThemeToggle';
import { ArrowLeft, Home } from 'lucide-react';
export default function GeneratorPage() {
  const navigate = useNavigate();
  const { user } = useArchitectureStore();
  const [generatedArchitecture, setGeneratedArchitecture] = useState(null);
  const [diagramChanges, setDiagramChanges] = useState(null);
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);
  if (!user) return null;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition flex-shrink-0"
              title="Home"
            >
              <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
              Archviz
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between">
            <ThemeToggle />
            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">
              <span className="font-semibold">{user.name}</span>
            </span>
            <button
              onClick={() => {
                localStorage.removeItem('auth_token');
                window.location.href = '/';
              }}
              className="px-3 md:px-4 py-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition flex-shrink-0"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
        {!generatedArchitecture ? (
          // Form Step - Centered
          <div className="flex justify-center items-center min-h-96">
            <PromptForm onArchitectureGenerated={setGeneratedArchitecture} />
          </div>
        ) : (
          // Diagram + Tabs Step - Full Height
          <div className="space-y-4 h-full">
            {/* Back Button */}
            <button
              onClick={() => setGeneratedArchitecture(null)}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Create Another Architecture
            </button>
            {/* Tabs Container */}
              <div
  className="
    h-[500px]
    sm:h-[550px]
    md:h-[calc(100vh-200px)]
    bg-white dark:bg-gray-800
    rounded-lg shadow-lg overflow-hidden
  "
>
                <DiagramTabs
                architecture={generatedArchitecture}
                diagramChanges={diagramChanges}
                onSaveChanges={setDiagramChanges}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
