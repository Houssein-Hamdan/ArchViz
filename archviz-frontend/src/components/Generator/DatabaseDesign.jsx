import { Database, Table, Key, Link2 } from 'lucide-react';

export default function DatabaseDesign({ architecture }) {
  const db = architecture?.diagram_json?.database;

  /*
   * Support multiple possible database structures.
   * This makes the UI more tolerant of AI-generated JSON.
   */
  if (!db) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <Database className="w-10 h-10 mx-auto mb-3 text-gray-400" />

          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No database design available
          </p>
        </div>
      </div>
    );
  }

  /*
   * Prefer a non-empty entities array.
   * Otherwise use tables.
   */
  const tables =
    Array.isArray(db.entities) && db.entities.length > 0
      ? db.entities
      : Array.isArray(db.tables)
        ? db.tables
        : [];

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start gap-3">
            <Database className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />

            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50">
                Database Design
              </h2>

              <p className="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                {db.type || 'Relational Database'}
                {db.description ? ` — ${db.description}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* No tables */}
        {tables.length === 0 && (
          <div
            className="
              bg-white
              dark:bg-gray-800

              rounded-lg
              shadow

              border
              border-gray-200
              dark:border-gray-700

              p-6
              sm:p-8

              text-center
            "
          >
            <Table className="w-10 h-10 mx-auto mb-3 text-gray-400" />

            <p className="text-gray-600 dark:text-gray-400">
              No database tables were generated.
            </p>
          </div>
        )}

        {/* Tables */}
        <div className="space-y-6">
          {tables.map((table, idx) => {
            /*
             * Some AI responses may use:
             * columns
             * fields
             * attributes
             */
            const columns =
              Array.isArray(table.columns)
                ? table.columns
                : Array.isArray(table.fields)
                  ? table.fields
                  : Array.isArray(table.attributes)
                    ? table.attributes
                    : [];

            return (
              <div
                key={table.name || idx}
                className="
                  bg-white
                  dark:bg-gray-800

                  rounded-lg

                  shadow-lg

                  overflow-hidden

                  border
                  border-gray-200
                  dark:border-gray-700
                "
              >
                {/* Table Header */}
                <div
                  className="
                    bg-gradient-to-r
                    from-blue-50
                    to-indigo-50

                    dark:from-blue-900/30
                    dark:to-indigo-900/30

                    p-4
                    sm:p-5

                    border-b
                    border-gray-200
                    dark:border-gray-700
                  "
                >
                  <div className="flex items-start gap-3">
                    <Table className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />

                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-gray-50 text-base sm:text-lg break-words">
                        {table.name || `Table ${idx + 1}`}
                      </h3>

                      {table.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed break-words">
                          {table.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Columns */}
                {columns.length > 0 ? (
                  <div className="p-3 sm:p-5">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[560px]">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-900 dark:text-gray-50">
                              Column
                            </th>

                            <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-900 dark:text-gray-50">
                              Type
                            </th>

                            <th className="text-left py-3 px-3 sm:px-4 font-semibold text-gray-900 dark:text-gray-50">
                              Constraints
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {columns.map((col, colIdx) => {
                            const isPrimary =
                              col.pk ||
                              col.isPrimary ||
                              col.primary_key ||
                              col.primaryKey;

                            const isForeign =
                              col.isForeign ||
                              col.foreign_key ||
                              col.foreignKey;

                            const constraints = Array.isArray(
                              col.constraints
                            )
                              ? col.constraints
                              : [];

                            return (
                              <tr
                                key={col.name || colIdx}
                                className="
                                  border-b
                                  border-gray-200
                                  dark:border-gray-700

                                  hover:bg-gray-50
                                  dark:hover:bg-gray-700/40

                                  transition
                                "
                              >
                                {/* Column */}
                                <td className="py-3 px-3 sm:px-4">
                                  <div className="flex items-center gap-2">
                                    {isPrimary && (
                                      <Key
                                        className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0"
                                        title="Primary Key"
                                      />
                                    )}

                                    {!isPrimary && isForeign && (
                                      <Link2
                                        className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0"
                                        title="Foreign Key"
                                      />
                                    )}

                                    <span className="font-medium text-gray-900 dark:text-gray-50 break-words">
                                      {col.name || 'Unnamed column'}
                                    </span>
                                  </div>
                                </td>

                                {/* Type */}
                                <td className="py-3 px-3 sm:px-4">
                                  <span
                                    className="
                                      inline-block

                                      px-2
                                      py-1

                                      bg-purple-100
                                      dark:bg-purple-900/30

                                      text-purple-800
                                      dark:text-purple-300

                                      rounded

                                      font-mono
                                      text-xs

                                      whitespace-nowrap
                                    "
                                  >
                                    {col.type || col.data_type || 'unknown'}
                                  </span>
                                </td>

                                {/* Constraints */}
                                <td className="py-3 px-3 sm:px-4">
                                  <div className="flex flex-wrap gap-1">
                                    {isPrimary && (
                                      <span
                                        className="
                                          inline-block

                                          bg-yellow-100
                                          dark:bg-yellow-900/30

                                          text-yellow-800
                                          dark:text-yellow-300

                                          px-2
                                          py-0.5

                                          rounded

                                          text-xs
                                        "
                                      >
                                        PRIMARY KEY
                                      </span>
                                    )}

                                    {(col.unique || col.isUnique) && (
                                      <span
                                        className="
                                          inline-block

                                          bg-green-100
                                          dark:bg-green-900/30

                                          text-green-800
                                          dark:text-green-300

                                          px-2
                                          py-0.5

                                          rounded

                                          text-xs
                                        "
                                      >
                                        UNIQUE
                                      </span>
                                    )}

                                    {isForeign && (
                                      <span
                                        className="
                                          inline-block

                                          bg-blue-100
                                          dark:bg-blue-900/30

                                          text-blue-800
                                          dark:text-blue-300

                                          px-2
                                          py-0.5

                                          rounded

                                          text-xs
                                        "
                                      >
                                        FOREIGN KEY
                                      </span>
                                    )}

                                    {constraints.map((constraint, i) => (
                                      <span
                                        key={i}
                                        className="
                                          inline-block

                                          bg-gray-200
                                          dark:bg-gray-700

                                          text-gray-700
                                          dark:text-gray-300

                                          px-2
                                          py-0.5

                                          rounded

                                          text-xs
                                        "
                                      >
                                        {constraint}
                                      </span>
                                    ))}

                                    {!isPrimary &&
                                      !isForeign &&
                                      !col.unique &&
                                      !col.isUnique &&
                                      constraints.length === 0 && (
                                        <span className="text-gray-400 dark:text-gray-500">
                                          —
                                        </span>
                                      )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="p-5">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No columns available for this table.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Relationships */}
        {Array.isArray(db.relationships) &&
          db.relationships.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-4">
                🔗 Relationships
              </h3>

              <div className="space-y-3">
                {db.relationships.map((rel, idx) => (
                  <div
                    key={idx}
                    className="
                      bg-blue-50
                      dark:bg-blue-900/20

                      border
                      border-blue-200
                      dark:border-blue-800

                      rounded-lg

                      p-4
                    "
                  >
                    <p className="font-medium text-gray-900 dark:text-gray-50 break-words">
                      {rel.from || rel.source}
                      <span className="text-gray-500 dark:text-gray-400 mx-2">
                        →
                      </span>
                      {rel.to || rel.target}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed break-words">
                      {rel.type || 'Relationship'}

                      {rel.foreign_key
                        ? ` (FK: ${rel.foreign_key})`
                        : ''}

                      {rel.description
                        ? `: ${rel.description}`
                        : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

