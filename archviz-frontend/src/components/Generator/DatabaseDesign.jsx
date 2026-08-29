import { Database, Table, Key, Link2 } from 'lucide-react';

export default function DatabaseDesign({ architecture }) {
  // fallback view if no database schema exists in the provided architecture prop
  if (!architecture?.diagram_json?.database) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No database design available
        </p>
      </div>
    );
  }

  const db = architecture.diagram_json.database;

  // normalize tables or entities array from diagram json
  const tables = db.entities || db.tables || []; 

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8">
      <div className="max-w-4xl">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
          🗄️ Database Design
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {db.type || 'Relational Database'} - {db.description || 'Database Schema'}
        </p>

        {/* Tables / Entities */}
        <div className="space-y-6">
          {tables.map((table, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 border-b dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Table className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-50">
                      {table.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {table.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Columns */}
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-50">Column</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-50">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-50">Constraints</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.columns?.map((col, colIdx) => (
                        <tr key={colIdx} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {/* Primary key indicator */}
                              {(col.pk || col.isPrimary) && (
                                <Key className="w-4 h-4 text-yellow-600" title="Primary Key" />
                              )}
                              {/* Foreign key indicator */}
                              {col.isForeign && (
                                <Link2 className="w-4 h-4 text-blue-600" title="Foreign Key" />
                              )}
                              <span className="font-medium text-gray-900 dark:text-gray-50">
                                {col.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded font-mono text-xs">
                              {col.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-xs">
                            {/* Render attribute flags like UNIQUE and PRIMARY KEY */}
                            <div className="space-y-1">
                              {col.pk && <span className="inline-block bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-0.5 rounded mr-1">PRIMARY KEY</span>}
                              {col.unique && <span className="inline-block bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded mr-1">UNIQUE</span>}
                              {col.constraints?.map((c, i) => (
                                <span key={i} className="inline-block bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded mr-1">{c}</span>
                              ))}
                              {!col.pk && !col.unique && (!col.constraints || col.constraints.length === 0) && (
                                <span className="text-gray-400">—</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Relationships */}
        {db.relationships?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-4">
              🔗 Relationships
            </h3>
            <div className="space-y-3">
              {db.relationships.map((rel, idx) => (
                <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <p className="font-medium text-gray-900 dark:text-gray-50">
                    {rel.from} <span className="text-gray-500">→</span> {rel.to}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {rel.type} {rel.foreign_key ? `(FK: ${rel.foreign_key})` : ''} {rel.description ? `: ${rel.description}` : ''}
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