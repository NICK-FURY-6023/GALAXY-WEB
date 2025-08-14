/**
 * Now Playing - Full Screen Player
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, 
  FaVolumeMute, FaRandom, FaRedoAlt, FaHeart, FaRegHeart, 
  FaExternalLinkAlt, FaArrowLeft, FaList, FaPlus
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { usePlayer } from '../../hooks/usePlayer';
import GlassCard from '../../components/ui/GlassCard';
import SourceBadge from '../../components/music/SourceBadge';

export default function NowPlayingPage() {
  const router = useRouter();
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
    currentIndex,
    togglePlay,
    setVolume,
    setRepeatMode,
    setShuffle,
    seek,
    next,
    previous
  } = usePlayer();

  const [showQueue, setShowQueue] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Check if track is favorited
  useEffect(() => {
    if (current && user) {
      checkIfFavorite();
    }
  }, [current, user]);

  const checkIfFavorite = async () => {
    if (!current || !user) return;
    
    try {
      const response = await fetch('/api/music/favorites', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const favorited = data.tracks.some(track => 
          track.source === current.source && track.sid === current.sid
        );
        setIsFavorite(favorited);
      }
    } catch (error) {
      console.error('Failed to check favorite status:', error);
    }
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

  const addToHistory = async () => {
    if (!current || !user) return;

    try {
      await fetch('/api/music/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ track: current })
      });
    } catch (error) {
      console.error('Failed to add to history:', error);
    }
  };

  // Add to history when track starts playing
  useEffect(() => {
    if (current && isPlaying) {
      const timer = setTimeout(() => {
        addToHistory();
      }, 5000); // Add to history after 5 seconds of playback

      return () => clearTimeout(timer);
    }
  }, [current, isPlaying]);

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

  const openInSource = () => {
    if (current?.url) {
      window.open(current.url, '_blank');
    }
  };

  if (!current) {
    return (
      <>
        <Head>
          <title>Now Playing | VEYNOVA Music Player</title>
        </Head>
        <div className="min-h-screen px-4 py-20 flex items-center justify-center">
          <GlassCard className="p-8 text-center max-w-md">
            <div className="text-6xl text-gray-600 mx-auto mb-4">🎵</div>
            <h1 className="text-2xl font-bold mb-4">Nothing Playing</h1>
            <p className="text-gray-400 mb-6">Select a track to start listening</p>
            <motion.button
              onClick={() => router.push('/music')}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Music
            </motion.button>
          </GlassCard>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{current.title} by {current.artist} | VEYNOVA Music Player</title>
      </Head>

      <div className="min-h-screen relative overflow-hidden">
        
        {/* Background with blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: current.thumbnailUrl 
              ? `url(${current.thumbnailUrl})` 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          
          {/* Header */}
          <header className="p-6 flex items-center justify-between">
            <motion.button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft />
              Back
            </motion.button>

            <h1 className="text-lg font-semibold text-white/80">Now Playing</h1>

            <motion.button
              onClick={() => setShowQueue(!showQueue)}
              className={`p-2 rounded-full transition-colors ${
                showQueue ? 'text-purple-400 bg-purple-400/20' : 'text-white/80 hover:text-white'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaList />
            </motion.button>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-2xl">
              
              {/* Album Art */}
              <motion.div
                className="aspect-square max-w-md mx-auto mb-8 rounded-2xl overflow-hidden shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                {current.thumbnailUrl ? (
                  <img 
                    src={current.thumbnailUrl} 
                    alt={current.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <div className="text-6xl text-white/60">🎵</div>
                  </div>
                )}
              </motion.div>

              {/* Track Info */}
              <motion.div
                className="text-center mb-8"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {current.title}
                </h1>
                <p className="text-xl text-white/80 mb-4">{current.artist}</p>
                {current.album && (
                  <p className="text-lg text-white/60">{current.album}</p>
                )}
                
                <div className="flex items-center justify-center gap-4 mt-4">
                  <SourceBadge source={current.source} />
                  {current.explicit && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                      EXPLICIT
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                className="mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div 
                  className="h-2 bg-white/20 rounded-full cursor-pointer group mb-2"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-white rounded-full relative group-hover:bg-purple-300 transition-colors"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  >
                    <div className="absolute right-0 top-1/2 w-4 h-4 bg-white rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-white/60">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </motion.div>

              {/* Controls */}
              <motion.div
                className="flex items-center justify-center gap-6 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {/* Shuffle */}
                <motion.button
                  onClick={() => setShuffle(!shuffle)}
                  className={`p-3 text-2xl transition-colors ${
                    shuffle ? 'text-purple-400' : 'text-white/60 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaRandom />
                </motion.button>

                {/* Previous */}
                <motion.button
                  onClick={previous}
                  className="p-3 text-3xl text-white/80 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaStepBackward />
                </motion.button>

                {/* Play/Pause */}
                <motion.button
                  onClick={togglePlay}
                  className="p-6 bg-white text-black rounded-full text-3xl hover:bg-gray-100 transition-colors shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                </motion.button>

                {/* Next */}
                <motion.button
                  onClick={next}
                  className="p-3 text-3xl text-white/80 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaStepForward />
                </motion.button>

                {/* Repeat */}
                <motion.button
                  onClick={() => {
                    const nextMode = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
                    setRepeatMode(nextMode);
                  }}
                  className={`p-3 text-2xl transition-colors relative ${
                    repeatMode !== 'off' ? 'text-purple-400' : 'text-white/60 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaRedoAlt />
                  {repeatMode === 'one' && (
                    <span className="absolute -top-1 -right-1 text-xs bg-purple-400 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      1
                    </span>
                  )}
                </motion.button>
              </motion.div>

              {/* Secondary Controls */}
              <motion.div
                className="flex items-center justify-center gap-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {/* Volume */}
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                    className="text-white/60 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {volume === 0 ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                  </motion.button>
                  <div 
                    className="w-24 h-1 bg-white/20 rounded cursor-pointer"
                    onClick={handleVolumeChange}
                  >
                    <div 
                      className="h-full bg-white rounded"
                      style={{ width: `${volume * 100}%` }}
                    />
                  </div>
                </div>

                {/* Favorite */}
                {user && (
                  <motion.button
                    onClick={toggleFavorite}
                    className={`text-2xl transition-colors ${
                      isFavorite ? 'text-red-400' : 'text-white/60 hover:text-red-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                  </motion.button>
                )}

                {/* Open in Source */}
                <motion.button
                  onClick={openInSource}
                  className="text-white/60 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={`Open in ${current.source}`}
                >
                  <FaExternalLinkAlt size={20} />
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Queue Info */}
          {queue.length > 0 && (
            <motion.div
              className="p-6 text-center text-white/60"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-sm">
                {currentIndex + 1} of {queue.length} in queue
                {queue.length > 1 && (
                  <span className="ml-2">
                    • Next: {queue[currentIndex + 1]?.title || 'End of queue'}
                  </span>
                )}
              </p>
            </motion.div>
          )}
        </div>

        {/* Queue Sidebar */}
        {showQueue && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-black/90 backdrop-blur-xl border-l border-white/10 z-20 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Queue</h2>
                <motion.button
                  onClick={() => setShowQueue(false)}
                  className="text-white/60 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>

              {queue.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/60">Queue is empty</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {queue.map((track, index) => (
                    <div
                      key={`${track.source}-${track.sid}-${index}`}
                      className={`p-3 rounded-lg transition-colors cursor-pointer ${
                        index === currentIndex 
                          ? 'bg-purple-500/20 border border-purple-400/30' 
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {track.thumbnailUrl ? (
                          <img 
                            src={track.thumbnailUrl} 
                            alt={track.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                            🎵
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {track.title}
                          </p>
                          <p className="text-white/60 text-xs truncate">
                            {track.artist}
                          </p>
                        </div>
                        {index === currentIndex && (
                          <div className="text-purple-400 text-xs">
                            NOW
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}