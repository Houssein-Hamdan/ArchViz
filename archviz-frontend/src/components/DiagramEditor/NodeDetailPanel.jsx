import { X, Copy, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NodeDetailPanel({ node, onClose, onDelete }) {
  if (!node) return null;

  const handleCopyLabel = async () => {
    try {
      await navigator.clipboard.writeText(node.data.label);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div
      className="
        fixed
        right-0
        top-0

        h-full

        w-full
        sm:w-96

        bg-white
        dark:bg-gray-800

        shadow-2xl

        z-50

        flex
        flex-col

        border-l
        border-gray-200
        dark:border-gray-700
      "
    >
      {/* Header */}
      <div
        className="
          flex
          items-center
          justify-between

          p-4
          sm:p-6

          border-b
          border-gray-200
          dark:border-gray-700
        "
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-50">
          Node Details
        </h2>

        <button
          onClick={onClose}
          className="
            p-2

            hover:bg-gray-100
            dark:hover:bg-gray-700

            rounded-lg

            transition

            flex-shrink-0
          "
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Content */}
      <div
        className="
          flex-1
          overflow-y-auto

          p-4
          sm:p-6

          space-y-6
        "
      >
        {/* Name */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
            Name
          </p>

          <div className="flex items-start gap-2">
            <p
              className="
                text-lg
                font-bold

                text-gray-900
                dark:text-gray-50

                flex-1
                min-w-0

                break-words
              "
            >
              {node.data.label}
            </p>

            <button
              onClick={handleCopyLabel}
              className="
                p-2

                hover:bg-gray-100
                dark:hover:bg-gray-700

                rounded

                transition

                flex-shrink-0
              "
              title="Copy"
              aria-label="Copy node name"
            >
              <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Type */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
            Type
          </p>

          <p className="text-gray-700 dark:text-gray-300 font-medium break-words">
            {node.data.type || 'N/A'}
          </p>
        </div>

        {/* Technology */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
            Technology
          </p>

          <p className="text-gray-700 dark:text-gray-300 font-medium break-words">
            {node.data.technology || 'N/A'}
          </p>
        </div>

        {/* Role */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
            Role
          </p>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words">
            {node.data.role || 'No role information available.'}
          </p>
        </div>

        {/* Why */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
            Why This Choice?
          </p>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words">
            {node.data.why || 'No explanation available.'}
          </p>
        </div>

        {/* ID */}
        <div
          className="
            bg-gray-50
            dark:bg-gray-900

            rounded-lg

            p-3

            border
            border-gray-200
            dark:border-gray-700
          "
        >
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
            ID
          </p>

          <p className="text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
            {node.id}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        className="
          border-t
          border-gray-200
          dark:border-gray-700

          p-4
          sm:p-6
        "
      >
        <button
          onClick={onDelete}
          className="
            w-full

            flex
            items-center
            justify-center
            gap-2

            px-4
            py-3

            bg-red-600
            hover:bg-red-700

            text-white

            rounded-lg

            transition

            font-medium
          "
        >
          <Trash2 className="w-4 h-4" />

          Delete Node
        </button>
      </div>
    </div>
  );
}
