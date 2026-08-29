import { X, Copy, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NodeDetailPanel({ node, onClose, onDelete }) {
  if (!node) return null;

  const handleCopyLabel = () => {
    navigator.clipboard.writeText(node.data.label);
    toast.success('Copied to clipboard');
  };

  return (
  <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700">
    {/* Header */}
    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">Node Details</h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
      >
        <X className="w-5 h-5 dark:text-gray-300" />
      </button>
    </div>

    {/* Content */}
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* ... update text colors ... */}
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
          Name
        </p>
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-50 flex-1">
            {node.data.label}
          </p>
            <button
              onClick={handleCopyLabel}
              className="p-2 hover:bg-gray-100 rounded transition"
              title="Copy"
            >
              <Copy className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Type */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Type
          </p>
          <p className="text-gray-700 font-medium">
            {node.data.type}
          </p>
        </div>

        {/* Technology */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Technology
          </p>
          <p className="text-gray-700 font-medium">
            {node.data.technology}
          </p>
        </div>

        {/* Role */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Role
          </p>
          <p className="text-gray-700 leading-relaxed">
            {node.data.role}
          </p>
        </div>

        {/* Why */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Why This Choice?
          </p>
          <p className="text-gray-700 leading-relaxed">
            {node.data.why}
          </p>
        </div>

        {/* ID (for reference) */}
        <div className="bg-gray-50 rounded p-3">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            ID
          </p>
          <p className="text-xs font-mono text-gray-600 break-all">
            {node.id}
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
          Delete Node
        </button>
      </div>
    </div>
  );
}