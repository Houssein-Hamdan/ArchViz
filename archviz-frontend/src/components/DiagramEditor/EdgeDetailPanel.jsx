import { X, Trash2 } from 'lucide-react';

export default function EdgeDetailPanel({ edge, onClose, onDelete }) {
  if (!edge) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Connection Details</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Source */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            From
          </p>
          <p className="text-gray-900 font-medium">
            {edge.data?.sourceLabel || edge.source}
          </p>
        </div>

        {/* Arrow */}
        <div className="text-center">
          <p className="text-2xl text-gray-400">↓</p>
        </div>

        {/* Target */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            To
          </p>
          <p className="text-gray-900 font-medium">
            {edge.data?.targetLabel || edge.target}
          </p>
        </div>

        {/* Label */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Type
          </p>
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
            {edge.data?.label}
          </span>
        </div>

        {/* Description */}
        {edge.data?.description && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Description
            </p>
            <p className="text-gray-700 leading-relaxed">
              {edge.data.description}
            </p>
          </div>
        )}

        {/* ID */}
        <div className="bg-gray-50 rounded p-3">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            ID
          </p>
          <p className="text-xs font-mono text-gray-600 break-all">
            {edge.id}
          </p>
        </div>
      </div>

      {/* Footer - Delete Button */}
      <div className="border-t border-gray-200 p-6">
        <button
          onClick={onDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Delete Connection
        </button>
      </div>
    </div>
  );
}