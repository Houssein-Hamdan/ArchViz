import { useNavigate } from 'react-router-dom';
import { ExternalLink, Share2, Trash2,  Calendar, Code } from 'lucide-react';
import toast from 'react-hot-toast';
import { architectureService } from '../services/architectureService';

export default function ArchitectureCard({ architecture, onDelete }) {
  const navigate = useNavigate();

  const handleShare = async () => {
    const shareLink = `${window.location.origin}/share/${architecture.share_slug}`;
    navigator.clipboard.writeText(shareLink);
    toast.success('Share link copied!');
  };

  


  const handleDelete = async () => {
    if (window.confirm('Are you sure? This action cannot be undone.')) {
      try {
        // TODO: Add delete endpoint to backend
        toast.success('Architecture deleted');
        onDelete(architecture.id);
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleViewShared = () => {
  window.open(`/share/${architecture.share_slug}`, '_blank');
};
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {architecture.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {architecture.prompt_input}
          </p>
        </div>
      </div>

      {/* Tech Stack */}
      {architecture.tech_stack && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Code className="w-4 h-4 text-gray-500" />
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
              {architecture.tech_stack}
            </span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-gray-500">Components</p>
          <p className="text-lg font-bold text-gray-900">
            {architecture.diagram_json?.nodes?.length || 0}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Connections</p>
          <p className="text-lg font-bold text-gray-900">
            {architecture.diagram_json?.edges?.length || 0}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Steps</p>
          <p className="text-lg font-bold text-gray-900">
            {architecture.diagram_json?.flow?.length || 0}
          </p>
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 pb-4 border-b">
        <Calendar className="w-3 h-3" />
        <span>{new Date(architecture.created_at).toLocaleDateString()}</span>
      </div>

      {/* Diagram Preview (Summary) */}
      <div className="mb-4 flex-1">
        <p className="text-xs font-semibold text-gray-600 mb-2">Architecture Summary</p>
        <p className="text-sm text-gray-700 line-clamp-3">
          {architecture.diagram_json?.summary}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleViewShared}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition"
        >
          <ExternalLink className="w-4 h-4" />
          View
        </button>

        <button
          onClick={handleShare}
          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>

        

        <button
          onClick={handleDelete}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}