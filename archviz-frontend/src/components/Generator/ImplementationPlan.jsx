import { CheckCircle2, Circle, Calendar, Zap } from 'lucide-react';
import { useState } from 'react';

export default function ImplementationPlan({ implementation }) {
  const [expandedPhase, setExpandedPhase] = useState(0);

  if (!implementation?.phases) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-8">
        📋 Implementation Plan
      </h3>

      <div className="space-y-6">
        {implementation.phases.map((phase, idx) => (
          <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {/* Phase Header */}
            <button
              onClick={() => setExpandedPhase(expandedPhase === idx ? -1 : idx)}
              className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 flex items-center justify-between hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                  {phase.phase}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-900 dark:text-gray-50">
                    {phase.name}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {phase.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {phase.tasks?.length || 0} tasks
                    </span>
                  </div>
                </div>
              </div>
              <span className={`transform transition ${expandedPhase === idx ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* Phase Content */}
            {expandedPhase === idx && (
              <div className="p-6 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                {phase.tasks?.map((task, taskIdx) => (
                  <div key={taskIdx} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h5 className="font-bold text-gray-900 dark:text-gray-50 mb-2">
                      {task.task}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {task.description}
                    </p>

                    {/* Checklist */}
                    <div className="space-y-2">
                      {task.checklist?.map((item, itemIdx) => (
                        <label key={itemIdx} className="flex items-center gap-3 cursor-pointer group">
                          <Circle className="w-5 h-5 text-gray-400 dark:text-gray-600 group-hover:text-blue-500 transition" />
                          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition">
                            {item}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          💡 <strong>Tip:</strong> Use this plan as your development roadmap. Check off tasks as you complete them to track progress.
        </p>
      </div>
    </div>
  );
}