
import { useState } from 'react';
import toast from 'react-hot-toast';
import DiagramCanvas from '../DiagramEditor/DiagramCanvas';
import ImplementationPlan from './ImplementationPlan';
import DatabaseDesign from './DatabaseDesign';
import { architectureService } from '../../services/architectureService';
import { MessageCircle, Grid, Zap, Save, ChevronDown, CheckSquare, Database } from 'lucide-react';

export default function DiagramTabs({ 
  architecture, 
  diagramChanges, 
  onSaveChanges 
}) {
  const [activeTab, setActiveTab] = useState('diagram');
  const [isSavePanelOpen, setIsSavePanelOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Check which tabs have content
  const hasImplementation = architecture?.diagram_json?.implementation?.phases?.length > 0;
  const hasDatabase = (architecture?.diagram_json?.database?.entities?.length > 0) || (architecture?.diagram_json?.database?.tables?.length > 0);
  const tabs = [
    {
      id: 'diagram',
      label: 'Diagram',
      icon: Grid,
      badge: architecture.diagram_json?.nodes?.length || 0,
      enabled: true,
    },
    {
      id: 'overview',
      label: 'Architecture Overview',
      icon: Zap,
      enabled: true,
    },
    {
      id: 'flow',
      label: 'Data Flow',
      icon: MessageCircle,
      badge: architecture.diagram_json?.flow?.length || 0,
      enabled: true,
    },
    {
      id: 'implementation',
      label: 'Implementation',
      icon: CheckSquare,
      badge: architecture.diagram_json?.implementation?.phases?.length || 0,
      enabled: hasImplementation,
    },
    {
      id: 'database',
      label: 'Database',
      icon: Database,
      badge: architecture.diagram_json.database.entities?.length || architecture.diagram_json.database.tables?.length || 0,
      enabled: hasDatabase,
    },
  ];

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
      
      const shareLink = `${window.location.origin}/share/${response.data.share_slug}`;
      navigator.clipboard.writeText(shareLink);
      toast.success('Share link copied to clipboard!');
      
      setIsSavePanelOpen(false);
      setTitle('');
    } catch (error) {
      toast.error('Failed to save architecture');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col flex-1 min-h-0 h-full">      {/* Tab Navigation */}
      <div className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center overflow-x-auto">
          {/* Tabs */}
          <div className="flex gap-0 flex-1 min-w-0">
            {tabs.map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => tab.enabled && setActiveTab(tab.id)}
                  disabled={!tab.enabled}
                  className={`
                    flex items-center gap-2 px-4 py-3 font-medium text-sm transition
                    border-b-2 whitespace-nowrap
                    ${isActive
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : tab.enabled
                      ? 'border-transparent text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                      : 'border-transparent text-gray-400 dark:text-gray-600 opacity-50 cursor-not-allowed'
                    }
                  `}
                  title={!tab.enabled ? `No ${tab.label} data available` : ''}
                >
                  <TabIcon className="w-4 h-4 flex-shrink-0" />
                  <span>{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-semibold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Save Button (Sticky on Right) */}
          <div className="flex-shrink-0 border-l dark:border-gray-700 pl-2">
            <button
              onClick={() => setIsSavePanelOpen(!isSavePanelOpen)}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white font-medium text-sm transition rounded-none"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
              <ChevronDown className={`w-4 h-4 transition ${isSavePanelOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Save Panel (Dropdown) */}
        {isSavePanelOpen && (
          <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-6 max-h-64 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Architecture Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., E-commerce Platform v1"
                  maxLength={255}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving || !title.trim()}
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition"
              >
                {isSaving ? 'Saving...' : 'Save & Get Share Link'}
              </button>

              <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded">
                💡 Your architecture will be saved and you'll get a shareable link
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === 'diagram' && (
          <div className="w-full h-full">
            <DiagramCanvas
              diagramData={diagramChanges || architecture.diagram_json}
              onSaveChanges={(updatedDiagram) => {
                onSaveChanges(updatedDiagram);
              }}
            />
          </div>
        )}

        {activeTab === 'overview' && (
          <OverviewTab architecture={architecture} />
        )}

        {activeTab === 'flow' && (
          <FlowTab architecture={architecture} />
        )}

        {activeTab === 'implementation' && hasImplementation && (
          <div className="h-full overflow-y-auto p-6 md:p-8">
            <ImplementationPlan implementation={architecture.diagram_json.implementation} />
          </div>
        )}

        {activeTab === 'database' && hasDatabase && (
          <DatabaseDesign architecture={architecture} />
        )}

        {activeTab === 'implementation' && !hasImplementation && (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No implementation plan available
            </p>
          </div>
        )}

        {activeTab === 'database' && !hasDatabase && (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No database design available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ architecture }) {
  return (
    <div className="h-full overflow-y-auto p-6 md:p-8">
      <div className="max-w-3xl">
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4">
          {architecture.diagram_json?.title}
        </h2>

        {/* Summary */}
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          {architecture.diagram_json?.summary}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {architecture.diagram_json?.nodes?.length || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Components</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {architecture.diagram_json?.edges?.length || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Connections</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {architecture.diagram_json?.flow?.length || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Flow Steps</p>
          </div>
        </div>

        {/* Prompt */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-3">
            📝 Original Prompt
          </h3>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {architecture.prompt_input}
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        {architecture.tech_stack && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-3">
              🛠️ Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {architecture.tech_stack.split(',').map((tech, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full font-medium"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Components List */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-4">
            🏗️ Components
          </h3>
          <div className="space-y-4">
            {architecture.diagram_json?.nodes?.map(node => (
              <div
                key={node.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:bg-gray-700/50 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center flex-shrink-0 text-sm font-bold text-blue-600 dark:text-blue-300">
                    {node.id.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-gray-50 mb-1">
                      {node.label}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-semibold">Technology:</span> {node.technology}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {node.role}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      💡 {node.why}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decisions & Tradeoffs */}
        {(architecture.diagram_json?.decisions || architecture.diagram_json?.tradeoffs) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Decisions */}
            {architecture.diagram_json?.decisions && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-4">
                  🎯 Key Decisions
                </h3>
                <div className="space-y-4">
                  {architecture.diagram_json.decisions.map((dec, idx) => (
                    <div key={idx} className="border-l-4 border-blue-600 pl-4 py-2">
                      <p className="font-semibold text-gray-900 dark:text-gray-50">
                        {dec.decision}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {dec.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tradeoffs */}
            {architecture.diagram_json?.tradeoffs && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-4">
                  ⚖️ Tradeoffs
                </h3>

                {architecture.diagram_json.tradeoffs.pros && (
                  <div className="mb-6">
                    <p className="font-semibold text-green-700 dark:text-green-400 mb-3">
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
                  <div className="mb-6">
                    <p className="font-semibold text-red-700 dark:text-red-400 mb-3">
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

                {architecture.diagram_json.tradeoffs.cost && (
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-50 mb-2">
                      💰 Cost: <span className="text-blue-600 dark:text-blue-400">
                        {architecture.diagram_json.tradeoffs.cost}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Flow Tab Component
function FlowTab({ architecture }) {
  return (
    <div className="h-full overflow-y-auto p-6 md:p-8">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8">
          Data Flow
        </h2>

        {architecture.diagram_json?.flow ? (
          <div className="space-y-6">
            {architecture.diagram_json.flow.map((step, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                {/* Step Number */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-700 text-white flex items-center justify-center font-bold text-lg">
                    {idx + 1}
                  </div>

                  {/* Connector Line (if not last) */}
                  {idx < architecture.diagram_json.flow.length - 1 && (
                    <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-gray-300 dark:to-gray-700 mt-2" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-2">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-lg text-gray-900 dark:text-gray-50 leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No flow steps available</p>
        )}
      </div>
    </div>
  );
}