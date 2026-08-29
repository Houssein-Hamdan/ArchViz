import { useState } from 'react';
import toast from 'react-hot-toast';
import { Save, ChevronDown } from 'lucide-react';
import { architectureService } from '../../services/architectureService';

export default function DiagramPreview({ architecture }) {
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setIsSaving(true);
    try {
      const response = await architectureService.saveArchitecture(
        title,
        architecture.prompt_input,
        architecture.tech_stack,
        architecture.diagram_json,
        architecture.diagram_json?.tradeoffs || null
      );

      toast.success('Architecture saved!');
      setSaved(true);
      
      // Copy share link
      const shareLink = `${window.location.origin}/share/${response.data.share_slug}`;
      navigator.clipboard.writeText(shareLink);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to save architecture');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Info Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left: Save Section */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-4">
              Save Architecture
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., E-commerce Platform v1"
                  maxLength={255}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving || !title.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save & Share'}
              </button>

              {saved && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded p-3 text-sm text-green-800 dark:text-green-300">
                  ✓ Saved! Share link copied to clipboard
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="mt-6 pt-6 border-t dark:border-gray-700 space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                  Prompt
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {architecture.prompt_input}
                </p>
              </div>

              {architecture.tech_stack && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {architecture.tech_stack.split(',').map((tech, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Diagram Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Title & Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
              {architecture.diagram_json?.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {architecture.diagram_json?.summary}
            </p>
          </div>

          {/* Architecture Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-4">
              Architecture Overview
            </h3>
            
            <div className="space-y-4">
              {/* Nodes */}
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Components
                </p>
                <div className="space-y-2">
                  {architecture.diagram_json?.nodes?.slice(0, 5).map(node => (
                    <div key={node.id} className="flex items-start gap-3 p-2 bg-gray-50 dark:bg-gray-900/50 rounded">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                        {node.id.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-50">{node.label}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{node.technology}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 italic mt-0.5">{node.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flow Steps */}
              {architecture.diagram_json?.flow && (
                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Data Flow
                  </p>
                  <ol className="space-y-2">
                    {architecture.diagram_json.flow.slice(0, 3).map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">
                          {idx + 1}.
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 line-clamp-2">
                          {step}
                        </span>
                      </li>
                    ))}
                    {architecture.diagram_json.flow.length > 3 && (
                      <li className="text-xs text-gray-500 dark:text-gray-400 italic">
                        ... and {architecture.diagram_json.flow.length - 3} more steps
                      </li>
                    )}
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* Decisions & Tradeoffs */}
          {(architecture.diagram_json?.decisions || architecture.diagram_json?.tradeoffs) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Decisions */}
              {architecture.diagram_json?.decisions && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-4">
                    Key Decisions
                  </h3>
                  <div className="space-y-3">
                    {architecture.diagram_json.decisions.slice(0, 3).map((dec, idx) => (
                      <div key={idx} className="border-l-4 border-blue-600 pl-4">
                        <p className="font-medium text-gray-900 dark:text-gray-50 text-sm line-clamp-2">
                          {dec.decision}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {dec.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tradeoffs */}
              {architecture.diagram_json?.tradeoffs && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-4">
                    Tradeoffs
                  </h3>
                  <div className="space-y-4">
                    {architecture.diagram_json.tradeoffs.pros && (
                      <div>
                        <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                          ✓ Pros
                        </p>
                        <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                          {architecture.diagram_json.tradeoffs.pros.slice(0, 2).map((pro, idx) => (
                            <li key={idx} className="line-clamp-1">• {pro}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {architecture.diagram_json.tradeoffs.cons && (
                      <div>
                        <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                          ✗ Cons
                        </p>
                        <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                          {architecture.diagram_json.tradeoffs.cons.slice(0, 2).map((con, idx) => (
                            <li key={idx} className="line-clamp-1">• {con}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {architecture.diagram_json.tradeoffs.cost && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          💰 Cost
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {architecture.diagram_json.tradeoffs.cost}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full JSON Preview (Development) */}
      <details className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <summary className="cursor-pointer font-semibold text-gray-900 dark:text-gray-50 select-none flex items-center gap-2">
          📋 Full JSON Preview (for debugging)
          <ChevronDown className="w-4 h-4" />
        </summary>
        <pre className="mt-4 p-4 bg-gray-900 text-gray-100 rounded overflow-auto text-xs max-h-96">
          {JSON.stringify(architecture.diagram_json, null, 2)}
        </pre>
      </details>
    </div>
  );
}