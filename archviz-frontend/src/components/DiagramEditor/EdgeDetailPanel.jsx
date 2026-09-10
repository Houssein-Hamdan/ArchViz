
import { X, Trash2, ArrowRight } from 'lucide-react';

export default function EdgeDetailPanel({
  edge,
  onClose,
  onDelete,
}) {
  if (!edge) {
    return null;
  }

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

          px-4
          sm:px-5

          py-4

          border-b
          border-gray-200
          dark:border-gray-700
        "
      >
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Connection Details
          </h2>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Information about this connection
          </p>
        </div>

        <button
          onClick={onClose}
          className="
            flex-shrink-0

            p-2

            rounded-lg

            text-gray-500
            dark:text-gray-400

            hover:bg-gray-100
            dark:hover:bg-gray-700

            hover:text-gray-700
            dark:hover:text-gray-200

            transition
          "
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        {/* Connection */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Connection
          </h3>

          <div
            className="
              bg-gray-50
              dark:bg-gray-900

              rounded-lg

              p-4

              border
              border-gray-200
              dark:border-gray-700
            "
          >
            <div className="flex items-center gap-3">
              {/* Source */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  From
                </p>

                <p className="font-semibold text-gray-900 dark:text-white break-words">
                  {edge.data?.sourceLabel || edge.source}
                </p>
              </div>

              <ArrowRight
                className="
                  w-5
                  h-5

                  flex-shrink-0

                  text-blue-500
                  dark:text-blue-400
                "
              />

              {/* Target */}
              <div className="flex-1 min-w-0 text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  To
                </p>

                <p className="font-semibold text-gray-900 dark:text-white break-words">
                  {edge.data?.targetLabel || edge.target}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Protocol / Label */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Protocol
          </h3>

          <div
            className="
              inline-flex
              items-center

              px-3
              py-2

              rounded-lg

              bg-blue-50
              dark:bg-blue-900/30

              text-blue-700
              dark:text-blue-300

              font-semibold
              text-sm

              border
              border-blue-200
              dark:border-blue-800
            "
          >
            {edge.data?.label || 'Connection'}
          </div>
        </div>

        {/* Description */}
        {edge.data?.description && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Description
            </h3>

            <div
              className="
                bg-gray-50
                dark:bg-gray-900

                rounded-lg

                p-4

                border
                border-gray-200
                dark:border-gray-700
              "
            >
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 break-words">
                {edge.data.description}
              </p>
            </div>
          </div>
        )}

        {/* Edge ID */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Connection ID
          </h3>

          <code
            className="
              block

              bg-gray-100
              dark:bg-gray-900

              text-gray-700
              dark:text-gray-300

              rounded-lg

              p-3

              text-xs

              break-all

              border
              border-gray-200
              dark:border-gray-700
            "
          >
            {edge.id}
          </code>
        </div>
      </div>

      {/* Footer */}
      <div
        className="
          p-4
          sm:p-5

          border-t
          border-gray-200
          dark:border-gray-700
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

            rounded-lg

            bg-red-50
            hover:bg-red-100

            dark:bg-red-900/20
            dark:hover:bg-red-900/40

            text-red-600
            dark:text-red-400

            border
            border-red-200
            dark:border-red-800

            font-medium

            transition
          "
        >
          <Trash2 className="w-4 h-4" />

          Delete Connection
        </button>
      </div>
    </div>
  );
}

