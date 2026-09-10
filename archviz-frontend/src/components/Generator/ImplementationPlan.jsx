import { Circle, Calendar, Zap } from 'lucide-react';
import { useState } from 'react';

export default function ImplementationPlan({ implementation }) {
  const [expandedPhase, setExpandedPhase] = useState(0);

  if (!implementation?.phases) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
      
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-50 mb-5 sm:mb-8">
        📋 Implementation Plan
      </h3>

      <div className="space-y-4 sm:space-y-6">
        {implementation.phases.map((phase, idx) => (
          <div
            key={idx}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            {/* Phase Header */}
            <button
              onClick={() =>
                setExpandedPhase(expandedPhase === idx ? -1 : idx)
              }
              className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition text-left"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                
                {/* Phase Number */}
                <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white font-bold">
                  {phase.phase}
                </div>

                {/* Phase Info */}
                <div className="min-w-0">
                  <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-50 break-words">
                    {phase.name}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span>{phase.duration}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 flex-shrink-0" />
                      <span>{phase.tasks?.length || 0} tasks</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <span
                className={`flex-shrink-0 transform transition ${
                  expandedPhase === idx ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>

            {/* Phase Content */}
            {expandedPhase === idx && (
              <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 bg-gray-50 dark:bg-gray-900/50">
                
                {phase.tasks?.map((task, taskIdx) => (
                  <div
                    key={taskIdx}
                    className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <h5 className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-50 mb-2 break-words">
                      {task.task}
                    </h5>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 break-words leading-relaxed">
                      {task.description}
                    </p>

                    {/* Checklist */}
                    <div className="space-y-2">
                      {task.checklist?.map((item, itemIdx) => (
                        <label
                          key={itemIdx}
                          className="flex items-start gap-2 sm:gap-3 cursor-pointer group"
                        >
                          <Circle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 text-gray-400 dark:text-gray-600 group-hover:text-blue-500 transition" />

                          <span className="min-w-0 text-xs sm:text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition break-words leading-relaxed">
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
      <div className="mt-5 sm:mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-300 leading-relaxed">
          💡 <strong>Tip:</strong> Use this plan as your development roadmap.
          Check off tasks as you complete them to track progress.
        </p>
      </div>
    </div>
  );
}