/**
 * Queue Panel Component
 * Side panel showing current queue with drag-and-drop reordering
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  FaTimes, 
  FaPlay, 
  FaPause, 
  FaTrash, 
  FaGripVertical,
  FaClear
} from 'react-icons/fa';
import { usePlayer } from '../../hooks/usePlayer';
import SourceBadge from './SourceBadge';

export default function QueuePanel({ isOpen, onClose }) {
  const {
    queue,
    currentIndex,
    current,
    isPlaying,
    setCurrentIndex,
    removeFromQueue,
    clearQueue
  } = usePlayer();

  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleTrackClick = (index) => {
    setCurrentIndex(index);
  };

  const handleRemoveTrack = (index) => {
    removeFromQueue(index);
  };

  const handleClearQueue = () => {
    if (window.confirm('Are you sure you want to clear the entire queue?')) {
      clearQueue();
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-96 glass-card border-l border-white/10 z-40 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Queue</h2>
                <p className="text-sm text-gray-400">
                  {queue.length} track{queue.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {queue.length > 0 && (
                  <motion.button
                    onClick={handleClearQueue}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Clear queue"
                  >
                    <FaTrash />
                  </motion.button>
                )}
                <motion.button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes />
                </motion.button>
              </div>
            </div>

            {/* Queue List */}
            <div className="flex-1 overflow-y-auto">
              {queue.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <p className="text-lg mb-2">Queue is empty</p>
                  <p className="text-sm">Add tracks to start playing</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {queue.map((track, index) => {
                    const isCurrent = index === currentIndex;
                    const isPlayed = index < currentIndex;

                    return (
                      <motion.div
                        key={`${track.source}-${track.sid}-${index}`}
                        className={`
                          group relative p-3 rounded-lg cursor-pointer transition-all
                          ${isCurrent 
                            ? 'bg-purple-500/20 border border-purple-500/30' 
                            : 'hover:bg-white/5'
                          }
                          ${isPlayed ? 'opacity-60' : ''}
                        `}
                        onClick={() => handleTrackClick(index)}
                        whileHover={{ scale: 1.02 }}
                        layout
                      >
                        {/* Drag Handle */}
                        <div className="absolute left-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <FaGripVertical className="text-gray-500" />
                        </div>

                        <div className="flex items-center gap-3 ml-6">
                          {/* Track Number or Play/Pause */}
                          <div className="w-6 flex items-center justify-center">
                            {isCurrent ? (
                              <motion.div
                                className="text-purple-400"
                                animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 1 }}
                              >
                                {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
                              </motion.div>
                            ) : (
                              <span className="text-sm text-gray-400">
                                {index + 1}
                              </span>
                            )}
                          </div>

                          {/* Thumbnail */}
                          {track.thumbnailUrl && (
                            <img
                              src={track.thumbnailUrl}
                              alt={track.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}

                          {/* Track Info */}
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${isCurrent ? 'text-purple-400' : ''}`}>
                              {track.title}
                            </p>
                            <p className="text-sm text-gray-400 truncate">
                              {track.artist}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <SourceBadge source={track.source} size="xs" />
                              {track.duration && (
                                <span className="text-xs text-gray-500">
                                  {formatDuration(track.duration)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Remove Button */}
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTrack(index);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaTimes size={12} />
                          </motion.button>
                        </div>

                        {/* Current track indicator */}
                        {isCurrent && (
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-1 bg-purple-400 rounded-r"
                            layoutId="current-track-indicator"
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {queue.length > 0 && (
              <div className="p-4 border-t border-white/10">
                <div className="text-sm text-gray-400 text-center">
                  {currentIndex >= 0 && currentIndex < queue.length
                    ? `Playing ${currentIndex + 1} of ${queue.length}`
                    : `${queue.length} tracks in queue`
                  }
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}