import { Handle, Position } from '@xyflow/react';
import {
  Globe, Server, Database, Zap, MessageSquare, 
  ExternalLink, HardDrive, Network, Layers
} from 'lucide-react';

// lookup table to match architecture component types to icons
const nodeTypeIcons = {
  frontend: Globe,
  backend: Server,
  database: Database,
  cache: Zap,
  queue: MessageSquare,
  external: ExternalLink,
  storage: HardDrive,
  gateway: Network,
  service: Layers,
};

// border and container styling variants per node type
const nodeTypeColors = {
  frontend: 'bg-white dark:bg-slate-900 border-blue-500',
  backend: 'bg-white dark:bg-slate-900 border-green-500',
  database: 'bg-white dark:bg-slate-900 border-orange-500',
  cache: 'bg-white dark:bg-slate-900 border-yellow-500',
  queue: 'bg-white dark:bg-slate-900 border-purple-500',
  external: 'bg-white dark:bg-slate-900 border-red-500',
  storage: 'bg-white dark:bg-slate-900 border-indigo-500',
  gateway: 'bg-white dark:bg-slate-900 border-pink-500',
  service: 'bg-white dark:bg-slate-900 border-cyan-500',
};

// badge color mappings for rendering technology tags
const nodeTypeBadgeColors = {
  frontend: 'bg-blue-100 text-blue-900 dark:bg-blue-900/60 dark:text-blue-300',
  backend: 'bg-green-100 text-green-900 dark:bg-green-900/60 dark:text-green-300',
  database: 'bg-orange-100 text-orange-900 dark:bg-orange-900/60 dark:text-orange-300',
  cache: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/60 dark:text-yellow-300',
  queue: 'bg-purple-100 text-purple-900 dark:bg-purple-900/60 dark:text-purple-300',
  external: 'bg-red-100 text-red-900 dark:bg-red-900/60 dark:text-red-300',
  storage: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/60 dark:text-indigo-300',
  gateway: 'bg-pink-100 text-pink-900 dark:bg-pink-900/60 dark:text-pink-300',
  service: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-900/60 dark:text-cyan-300',
};

export default function CustomNode({ data, selected }) {
  // fallback to Server icon and default gray theme if type is unknown
  const Icon = nodeTypeIcons[data.type] || Server;
  const colorClass = nodeTypeColors[data.type] || 'bg-gray-50 border-gray-500';
  const badgeColor = nodeTypeBadgeColors[data.type] || 'bg-gray-200 text-gray-800';

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 shadow-md transition-all cursor-pointer ${colorClass} ${
        selected ? 'ring-2 ring-offset-2 ring-blue-600 dark:ring-offset-slate-900' : ''
      }`}
      style={{ minWidth: '200px' }}
    >
      {/* Handle - Top */}
      <Handle type="target" position={Position.Top} />

      {/* Icon + Label */}
      <div className="flex items-start gap-3 mb-2">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-900 dark:text-slate-100" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">
            {data.label}
          </h3>
        </div>
      </div>

      {/* Technology Badge */}
      <div className="mb-2">
        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${badgeColor}`}>
          {data.technology}
        </span>
      </div>

      {/* Role */}
      <p className="text-xs text-slate-800 dark:text-slate-200 mb-2 leading-snug font-medium">
        {data.role}
      </p>

      {/* Why */}
      {data.why && (
        <p className="text-xs text-slate-700 dark:text-slate-300 italic border-t border-gray-300 dark:border-gray-700/60 pt-2">
          💡 {data.why}
        </p>
      )}

      {/* Handle - Bottom */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}