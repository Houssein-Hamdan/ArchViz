import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bookmark, Eye, Network, Layers, Boxes, Cpu, Workflow  } from 'lucide-react';
import toast from 'react-hot-toast';
import { architectureService } from '../../services/architectureService';

export default function ArchitectureExploreCard({
  architecture,
  userHasLiked = false,
  userHasBookmarked = false,
  onLikeToggle,
  onBookmarkToggle,
}) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(
    Boolean(architecture.is_liked)
  );
  const [isBookmarked, setIsBookmarked] = useState(
    Boolean(architecture.is_bookmarked)
  );
  const [likeCount, setLikeCount] = useState(architecture.likes_count || 0);
  const [bookmarkCount, setBookmarkCount] = useState(architecture.bookmarks_count || 0);

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      if (isLiked) {
        await architectureService.unlikeArchitecture(architecture.id);
        setLikeCount(likeCount - 1);
      } else {
        await architectureService.likeArchitecture(architecture.id);
        setLikeCount(likeCount + 1);
      }
      setIsLiked(!isLiked);
      onLikeToggle?.(architecture.id, !isLiked);
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    try {
      if (isBookmarked) {
        await architectureService.removeBookmark(architecture.id);
        setBookmarkCount(bookmarkCount - 1);
      } else {
        await architectureService.addBookmark(architecture.id);
        setBookmarkCount(bookmarkCount + 1);
      }
      setIsBookmarked(!isBookmarked);
      onBookmarkToggle?.(architecture.id, !isBookmarked);
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleCardClick = () => {
    navigate(`/share/${architecture.share_slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden group flex flex-col h-full"
    >
      {/* Header with Icon & Badge */}
<div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 h-28 flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0 group-hover:from-blue-100 group-hover:to-indigo-100 transition duration-300">
  
  {/* Icon with styled background circle */}
  <div className="p-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-xl shadow-sm mb-2 group-hover:scale-110 transition duration-300">
    <Network className="w-6 h-6" />
  </div>

  {/* Components Count */}
  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
    {architecture.diagram_json?.nodes?.length || 0} Components
  </span>

    {/* Badge if Trending */}
    {architecture.likes_count > 50 && (
      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
        <span>🔥</span> Trending
      </div>
      )}
    </div>
      {/* Content Container - Takes full height & pushes actions to bottom */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
            {architecture.title}
          </h3>

          {/* Author */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            by <span className="font-semibold hover:text-blue-600 dark:hover:text-blue-400">
              {architecture.user?.name || 'Unknown'}
            </span>
          </p>

          {/* Description */}
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
            {architecture.short_description || architecture.prompt_input}
          </p>

          {/* Tech Stack */}
          {architecture.tech_stack && (
            <div className="flex flex-wrap gap-1 mb-4">
              {architecture.tech_stack.split(',').slice(0, 3).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full font-semibold"
                >
                  {tech.trim()}
                </span>
              ))}
              {architecture.tech_stack.split(',').length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full font-semibold">
                  +{architecture.tech_stack.split(',').length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Section (Stats + Action Buttons) - Pushed to bottom */}
        <div className="mt-4">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-t border-b border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
                <Eye className="w-4 h-4" />
                <span className="font-semibold">{architecture.views_count || 0}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">Views</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
                <Heart className="w-4 h-4" />
                <span className="font-semibold">{likeCount}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">Likes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
                <Bookmark className="w-4 h-4" />
                <span className="font-semibold">{bookmarkCount}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">Saved</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleLike}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition ${
                isLiked
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm hidden sm:inline">
                {isLiked ? 'Liked' : 'Like'}
              </span>
            </button>

            <button
              onClick={handleBookmark}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition ${
                isBookmarked
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              <span className="text-sm hidden sm:inline">
                {isBookmarked ? 'Saved' : 'Save'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}