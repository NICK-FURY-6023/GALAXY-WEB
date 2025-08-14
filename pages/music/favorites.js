/**
 * Favorites Page
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaHeart, FaPlay, FaTrash, FaSearch, FaSort } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { usePlayer } from '../../hooks/usePlayer';
import GlassCard from '../../components/ui/GlassCard';
import TrackCard from '../../components/music/TrackCard';
import PlayerBar from '../../components/music/PlayerBar';

export default function FavoritesPage() {
  const { user, login } = useAuth();
  const { setQueue, play } = usePlayer();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent, title, artist

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      const response = await fetch('/api/music/favorites', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.tracks || []);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (track) => {
    try {
      const response = await fetch('/api/music/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: 'remove',
          track: { source: track.source, sid: track.sid }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.tracks || []);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      alert('Failed to remove from favorites');
    }
  };

  const playAllFavorites = () => {
    if (filteredFavorites.length > 0) {
      setQueue(filteredFavorites, 0);
      play();
    }
  };

  const playTrack = (track, index) => {
    setQueue(filteredFavorites, index);
    play();
  };

  // Filter and sort favorites
  const filteredFavorites = favorites
    .filter(track =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (track.album && track.album.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'recent':
        default:
          return new Date(b.addedAt) - new Date(a.addedAt);
      }
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (!user) {
    return (
      <>
        <Head>
          <title>Favorites | VEYNOVA Music Player</title>
        </Head>
        <div className="min-h-screen px-4 py-20 flex items-center justify-center">
          <GlassCard className="p-8 text-center max-w-md">
            <FaHeart className="text-6xl text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>
            <p className="text-gray-400 mb-6">Sign in to save and access your favorite tracks</p>
            <button
              onClick={() => login('google')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              Sign In
            </button>
          </GlassCard>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>My Favorites | VEYNOVA Music Player</title>
      </Head>

      <div className="min-h-screen px-4 py-20 pb-32">
        <div className="container mx-auto max-w-6xl">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-black uppercase text-primary dark:text-primary-dark mb-4">
              My Favorites
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your collection of liked tracks
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <GlassCard className="p-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                
                {/* Search */}
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search favorites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-red-400 transition-colors"
                  />
                </div>

                {/* Sort */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FaSort className="text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-red-400 transition-colors"
                    >
                      <option value="recent">Recently Added</option>
                      <option value="title">Title (A-Z)</option>
                      <option value="artist">Artist (A-Z)</option>
                    </select>
                  </div>

                  {/* Play All Button */}
                  <motion.button
                    onClick={playAllFavorites}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={filteredFavorites.length === 0}
                  >
                    <FaPlay />
                    Play All
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Results Count */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <p className="text-gray-400">
                {filteredFavorites.length} favorite{filteredFavorites.length !== 1 ? 's' : ''}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </motion.div>
          )}

          {/* Favorites List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <GlassCard className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-white/10 rounded mb-2"></div>
                        <div className="h-3 bg-white/10 rounded w-2/3"></div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>
          ) : filteredFavorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FaHeart className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? 'No favorites found' : 'No favorites yet'}
              </h3>
              <p className="text-gray-400">
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Start liking tracks to build your favorites collection'
                }
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {filteredFavorites.map((track, index) => (
                <motion.div
                  key={`${track.source}-${track.sid}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * (index % 20) }}
                >
                  <GlassCard className="p-4 group hover:scale-[1.02] transition-all">
                    <div className="flex items-center gap-4">
                      
                      {/* Track Image */}
                      <div className="relative">
                        {track.thumbnailUrl ? (
                          <img 
                            src={track.thumbnailUrl} 
                            alt={track.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                            <FaHeart className="text-red-400" />
                          </div>
                        )}
                        
                        {/* Play Button Overlay */}
                        <motion.button
                          onClick={() => playTrack(track, index)}
                          className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaPlay className="text-white text-sm" />
                        </motion.button>
                      </div>

                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate group-hover:text-red-400 transition-colors">
                          {track.title}
                        </h3>
                        <p className="text-sm text-gray-400 truncate">
                          {track.artist}
                          {track.album && ` • ${track.album}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full capitalize">
                            {track.source}
                          </span>
                          <span className="text-xs text-gray-500">
                            Added {formatDate(track.addedAt)}
                          </span>
                        </div>
                      </div>

                      {/* Duration */}
                      {track.duration && (
                        <div className="text-sm text-gray-400 hidden md:block">
                          {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          onClick={() => removeFavorite(track)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Remove from favorites"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          )}

        </div>

        <PlayerBar />
      </div>
    </>
  );
}