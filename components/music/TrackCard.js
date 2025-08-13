/**
 * Track Card Component
 * Displays individual track with actions
 */

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  FaPlay, 
  FaPause, 
  FaPlus, 
  FaHeart, 
  FaRegHeart,
  FaList,
  FaExternalLinkAlt,
  FaEllipsisV
} from 'react-icons/fa';
import { usePlayer } from '../../hooks/usePlayer';
import { useAuth } from '../../hooks/useAuth';
import SourceBadge from './SourceBadge';

export default function TrackCard({ track, variant = 'default', showActions = true }) {
  const { user } = useAuth();
  const { 
    current, 
    isPlaying, 
    addToQueue, 
    setCurrent,
    setQueue,
    play 
  } = usePlayer();

  const [isFavorite, setIsFavorite] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isCurrentTrack = current && current.source === track.source && current.sid === track.sid;

  const handlePlay = () => {
    if (isCurrentTrack) {
      if (isPlaying) {
        // Pause current track
        usePlayer.getState().pause();
      } else {
        // Resume current track
        play();
      }
    } else {
      // Play this track immediately
      setCurrent(track);
      setQueue([track], 0);
      play();
      
      // Record play history if user is logged in
      if (user) {
        recordPlayHistory();
      }
    }
  };

  const handleAddToQueue = (position = 'end') => {
    addToQueue(track, position);
    
    // Show brief feedback
    // TODO: Add toast notification
  };

  const toggleFavorite = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/music/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: isFavorite ? 'remove' : 'add',
          track: { source: track.source, sid: track.sid }
        }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Favorite toggle error:', error);
    }
  };

  const recordPlayHistory = async () => {
    try {
      await fetch('/api/music/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ trackId: track._id }),
      });
    } catch (error) {
      console.error('History recording error:', error);
    }
  };

  const openExternal = () => {
    if (track.url) {
      window.open(track.url, '_blank');
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const cardVariants = {
    default: "p-4",
    compact: "p-3",
    list: "p-2"
  };

  return (
    <motion.div
      className={`
        group relative bg-white/5 hover:bg-white/10 rounded-lg transition-all cursor-pointer
        ${cardVariants[variant]}
        ${isCurrentTrack ? 'ring-2 ring-purple-400' : ''}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        
        {/* Thumbnail */}
        <div className="relative flex-shrink-0">
          {track.thumbnailUrl ? (
            <img
              src={track.thumbnailUrl}
              alt={track.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              <SourceBadge source={track.source} showText={false} />
            </div>
          )}
          
          {/* Play Button Overlay */}
          <motion.button
            onClick={handlePlay}
            className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isCurrentTrack && isPlaying ? (
              <FaPause className="text-white" size={16} />
            ) : (
              <FaPlay className="text-white ml-0.5" size={16} />
            )}
          </motion.button>

          {/* Currently Playing Indicator */}
          {isCurrentTrack && isPlaying && (
            <div className="absolute -bottom-1 -right-1">
              <div className="flex space-x-0.5">
                <div className="w-1 h-3 bg-purple-400 animate-wave"></div>
                <div className="w-1 h-2 bg-purple-400 animate-wave" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-4 bg-purple-400 animate-wave" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium truncate ${isCurrentTrack ? 'text-purple-400' : ''}`}>
            {track.title}
          </h4>
          <p className="text-sm text-gray-400 truncate">
            {track.artist}
          </p>
          {track.album && variant === 'default' && (
            <p className="text-xs text-gray-500 truncate">
              {track.album}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-1">
            <SourceBadge source={track.source} size="xs" />
            {track.explicit && (
              <span className="px-1 py-0.5 bg-red-500/20 text-red-400 text-xs rounded font-bold">
                E
              </span>
            )}
            {track.duration && (
              <span className="text-xs text-gray-500">
                {formatDuration(track.duration)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            
            {user && (
              <motion.button
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
              </motion.button>
            )}

            <motion.button
              onClick={() => handleAddToQueue('end')}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Add to queue"
            >
              <FaPlus size={14} />
            </motion.button>

            <motion.button
              onClick={() => handleAddToQueue('next')}
              className="p-2 text-gray-400 hover:text-purple-400 transition-colors rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Play next"
            >
              <FaList size={14} />
            </motion.button>

            <motion.button
              onClick={openExternal}
              className="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={`Open in ${track.source}`}
            >
              <FaExternalLinkAlt size={12} />
            </motion.button>

            {/* More Options Menu */}
            <div className="relative">
              <motion.button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaEllipsisV size={12} />
              </motion.button>

              {/* Dropdown Menu */}
              {showMenu && (
                <motion.div
                  className="absolute right-0 top-full mt-1 bg-gray-800 rounded-lg shadow-xl border border-white/10 py-2 z-10 min-w-48"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <button
                    onClick={() => {
                      handleAddToQueue('next');
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                  >
                    Play next
                  </button>
                  <button
                    onClick={() => {
                      handleAddToQueue('end');
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                  >
                    Add to queue
                  </button>
                  {user && (
                    <button
                      onClick={() => {
                        // TODO: Add to playlist functionality
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                    >
                      Add to playlist
                    </button>
                  )}
                  <hr className="my-2 border-white/10" />
                  <button
                    onClick={() => {
                      openExternal();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                  >
                    Open in {track.source}
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </motion.div>
  );
}