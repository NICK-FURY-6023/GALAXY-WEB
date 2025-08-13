/**
 * Global Player Bar Component
 * Bottom-fixed player with full controls
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaPause, 
  FaStepBackward, 
  FaStepForward,
  FaVolumeUp,
  FaVolumeMute,
  FaRandom,
  FaRedoAlt,
  FaList,
  FaHeart,
  FaRegHeart,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { usePlayer } from '../../hooks/usePlayer';
import { useAuth } from '../../hooks/useAuth';
import SourceBadge from './SourceBadge';
import QueuePanel from './QueuePanel';

export default function PlayerBar() {
  const { user } = useAuth();
  const {
    current,
    isPlaying,
    volume,
    repeatMode,
    shuffle,
    currentTime,
    duration,
    queue,
    togglePlay,
    setVolume,
    setRepeatMode,
    setShuffle,
    seek,
    next,
    previous,
    setAudioRef
  } = usePlayer();

  const audioRef = useRef(null);
  const [showQueue, setShowQueue] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [playbackError, setPlaybackError] = useState(null);

  // Set audio ref in player store
  useEffect(() => {
    setAudioRef(audioRef);
  }, [setAudioRef]);

  // Handle track changes
  useEffect(() => {
    if (current && audioRef.current) {
      // Resolve track for playback
      resolveTrackPlayback();
    }
  }, [current]);

  const resolveTrackPlayback = async () => {
    if (!current) return;

    try {
      setPlaybackError(null);
      const response = await fetch('/api/music/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: current.source, sid: current.sid }),
      });

      if (response.ok) {
        const { playable } = await response.json();
        
        if (playable.kind === 'direct' && playable.streamUrl) {
          audioRef.current.src = playable.streamUrl;
          if (isPlaying) {
            audioRef.current.play();
          }
        } else if (playable.kind === 'external') {
          setPlaybackError(`Track opens in ${current.source} - ${playable.message}`);
        } else {
          setPlaybackError(playable.message || 'Playback not available');
        }
      } else {
        setPlaybackError('Failed to resolve track');
      }
    } catch (error) {
      console.error('Playback resolution error:', error);
      setPlaybackError('Connection error');
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    seek(newTime);
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(Math.max(0, Math.min(1, percent)));
  };

  const toggleFavorite = async () => {
    if (!current || !user) return;
    
    try {
      const response = await fetch('/api/music/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: isFavorite ? 'remove' : 'add',
          track: { source: current.source, sid: current.sid }
        }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Favorite toggle error:', error);
    }
  };

  const openInSource = () => {
    if (current?.url) {
      window.open(current.url, '_blank');
    }
  };

  if (!current) return null;

  return (
    <>
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-white/10"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
      >
        {/* Progress bar */}
        <div 
          className="h-1 bg-gray-600 cursor-pointer group"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-purple-400 relative group-hover:bg-purple-300 transition-colors"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          >
            <div className="absolute right-0 top-1/2 w-3 h-3 bg-purple-400 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between">
            
            {/* Track Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {current.thumbnailUrl && (
                <motion.img
                  src={current.thumbnailUrl}
                  alt={current.title}
                  className="w-12 h-12 rounded-lg object-cover"
                  whileHover={{ scale: 1.05 }}
                />
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold truncate">{current.title}</h4>
                <p className="text-sm text-gray-400 truncate">{current.artist}</p>
                <div className="flex items-center gap-2 mt-1">
                  <SourceBadge source={current.source} />
                  {playbackError && (
                    <span className="text-xs text-red-400">{playbackError}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => setShuffle(!shuffle)}
                className={`p-2 rounded-full transition-colors ${
                  shuffle ? 'text-purple-400 bg-purple-400/20' : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaRandom />
              </motion.button>

              <motion.button
                onClick={previous}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaStepBackward size={20} />
              </motion.button>

              <motion.button
                onClick={togglePlay}
                className="p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
              </motion.button>

              <motion.button
                onClick={next}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaStepForward size={20} />
              </motion.button>

              <motion.button
                onClick={() => {
                  const nextMode = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
                  setRepeatMode(nextMode);
                }}
                className={`p-2 rounded-full transition-colors ${
                  repeatMode !== 'off' ? 'text-purple-400 bg-purple-400/20' : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaRedoAlt />
                {repeatMode === 'one' && (
                  <span className="absolute -top-1 -right-1 text-xs bg-purple-400 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    1
                  </span>
                )}
              </motion.button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              
              {/* Time Display */}
              <div className="text-sm text-gray-400 hidden md:block">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              {/* Volume Control */}
              <div className="hidden md:flex items-center gap-2">
                <motion.button
                  onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                </motion.button>
                <div 
                  className="w-20 h-1 bg-gray-600 rounded cursor-pointer"
                  onClick={handleVolumeChange}
                >
                  <div 
                    className="h-full bg-purple-400 rounded"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <motion.button
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isFavorite ? <FaHeart /> : <FaRegHeart />}
              </motion.button>

              <motion.button
                onClick={openInSource}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={`Open in ${current.source}`}
              >
                <FaExternalLinkAlt />
              </motion.button>

              <motion.button
                onClick={() => setShowQueue(!showQueue)}
                className={`p-2 rounded-full transition-colors ${
                  showQueue ? 'text-purple-400 bg-purple-400/20' : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaList />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          onTimeUpdate={() => {
            if (!isDragging && audioRef.current) {
              usePlayer.getState().setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              usePlayer.getState().setDuration(audioRef.current.duration);
            }
          }}
          onEnded={() => {
            // Auto-advance based on repeat mode
            const { repeatMode: mode, next: nextTrack } = usePlayer.getState();
            if (mode === 'one') {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            } else {
              nextTrack();
            }
          }}
          onError={() => {
            setPlaybackError('Playback failed');
          }}
          volume={volume}
        />
      </motion.div>

      {/* Queue Panel */}
      <AnimatePresence>
        {showQueue && (
          <QueuePanel 
            isOpen={showQueue} 
            onClose={() => setShowQueue(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}