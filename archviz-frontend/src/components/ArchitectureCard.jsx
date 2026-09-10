import { useState } from 'react';
import {
  ExternalLink,
  Share2,
  Trash2,
  Calendar,
  Code,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { architectureService } from '../services/architectureService';

export default function ArchitectureCard({ architecture, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleShare = async () => {
    const shareLink = `${window.location.origin}/share/${architecture.share_slug}`;

    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('Share link copied!');
    } catch (error) {
      console.error('Clipboard error:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    const confirmed = window.confirm(
      'Are you sure? This action cannot be undone.'
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await architectureService.deleteArchitecture(architecture.id);

      onDelete(architecture.id);

      toast.success('Architecture deleted');
    } catch (error) {
      console.error('Delete error:', error);

      if (error.response?.status === 403) {
        toast.error('You are not authorized to delete this architecture.');
      } else if (error.response?.status === 404) {
        toast.error('Architecture not found.');
      } else {
        toast.error('Failed to delete architecture.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewShared = () => {
    window.open(
      `/share/${architecture.share_slug}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const techStack = architecture.tech_stack
    ? architecture.tech_stack
        .split(',')
        .map((tech) => tech.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition p-4 sm:p-6 flex flex-col h-full border border-gray-100 dark:border-gray-700">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 truncate">
            {architecture.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {architecture.prompt_input}
          </p>
        </div>
      </div>

      {/* Tech Stack */}
      {techStack.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
            <Code className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="font-medium">Tech Stack</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, index) => (
              <span
                key={`${tech}-${index}`}
                className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-xs font-medium max-w-full truncate"
                title={tech}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Components
          </p>

          <p className="text-lg font-bold text-gray-900 dark:text-gray-50">
            {architecture.diagram_json?.nodes?.length || 0}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Connections
          </p>

          <p className="text-lg font-bold text-gray-900 dark:text-gray-50">
            {architecture.diagram_json?.edges?.length || 0}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Steps
          </p>

          <p className="text-lg font-bold text-gray-900 dark:text-gray-50">
            {architecture.diagram_json?.flow?.length || 0}
          </p>
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <Calendar className="w-3 h-3 flex-shrink-0" />

        <span>
          {architecture.created_at
            ? new Date(architecture.created_at).toLocaleDateString()
            : 'Unknown date'}
        </span>
      </div>

      {/* Architecture Summary */}
      <div className="mb-4 flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Architecture Summary
        </p>

        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
          {architecture.diagram_json?.summary ||
            'No architecture summary available.'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">

        {/* View */}
        <button
          onClick={handleViewShared}
          className="flex-1 min-w-0 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          <span>View</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex-shrink-0 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
          title="Share"
          aria-label="Share architecture"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-shrink-0 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition"
          title="Delete"
          aria-label="Delete architecture"
        >
          {isDeleting ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin block" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>

      </div>
    </div>
  );
}

