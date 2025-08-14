/**
 * Playlists Page
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  FaList, FaPlus, FaPlay, FaEdit, FaTrash, FaLock, FaGlobe, 
  FaMusic, FaClock, FaSearch 
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { usePlayer } from '../../hooks/usePlayer';
import GlassCard from '../../components/ui/GlassCard';
import PlayerBar from '../../components/music/PlayerBar';

export default function PlaylistsPage() {
  const { user, login } = useAuth();
  const { setQueue, play } = usePlayer();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    if (user) {
      loadPlaylists();
    }
  }, [user]);

  const loadPlaylists = async () => {
    try {
      const response = await fetch('/api/music/playlists', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setPlaylists(data.playlists || []);
      }
    } catch (error) {
      console.error('Failed to load playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async (playlistData) => {
    try {
      const response = await fetch('/api/music/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(playlistData)
      });

      if (response.ok) {
        const data = await response.json();
        setPlaylists([data.playlist, ...playlists]);
        setShowCreateModal(false);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create playlist');
      }
    } catch (error) {
      console.error('Failed to create playlist:', error);
      alert('Failed to create playlist');
    }
  };

  const updatePlaylist = async (playlistId, updateData) => {
    try {
      const response = await fetch(`/api/music/playlists/${playlistId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const data = await response.json();
        setPlaylists(playlists.map(p => 
          p._id === playlistId ? { ...p, ...data.playlist } : p
        ));
        setEditingPlaylist(null);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update playlist');
      }
    } catch (error) {
      console.error('Failed to update playlist:', error);
      alert('Failed to update playlist');
    }
  };

  const deletePlaylist = async (playlistId) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;

    try {
      const response = await fetch(`/api/music/playlists/${playlistId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setPlaylists(playlists.filter(p => p._id !== playlistId));
        if (selectedPlaylist?._id === playlistId) {
          setSelectedPlaylist(null);
        }
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete playlist');
      }
    } catch (error) {
      console.error('Failed to delete playlist:', error);
      alert('Failed to delete playlist');
    }
  };

  const playPlaylist = (playlist) => {
    if (playlist.tracks && playlist.tracks.length > 0) {
      setQueue(playlist.tracks, 0);
      play();
    }
  };

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:00` : `${minutes}:00`;
  };

  if (!user) {
    return (
      <>
        <Head>
          <title>Playlists | VEYNOVA Music Player</title>
        </Head>
        <div className="min-h-screen px-4 py-20 flex items-center justify-center">
          <GlassCard className="p-8 text-center max-w-md">
            <FaList className="text-6xl text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your Playlists</h1>
            <p className="text-gray-400 mb-6">Sign in to create and manage your music playlists</p>
            <button
              onClick={() => login('google')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
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
        <title>My Playlists | VEYNOVA Music Player</title>
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
              My Playlists
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Create and organize your music collections
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
                    placeholder="Search playlists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green-400 transition-colors"
                  />
                </div>

                {/* Create Button */}
                <motion.button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlus />
                  Create Playlist
                </motion.button>
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
                {filteredPlaylists.length} playlist{filteredPlaylists.length !== 1 ? 's' : ''}
              </p>
            </motion.div>
          )}

          {/* Playlists Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <GlassCard className="p-6">
                    <div className="h-4 bg-white/10 rounded mb-3"></div>
                    <div className="h-3 bg-white/10 rounded mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-2/3"></div>
                  </GlassCard>
                </div>
              ))}
            </div>
          ) : filteredPlaylists.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FaList className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? 'No playlists found' : 'No playlists yet'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Create your first playlist to get started'
                }
              </p>
              {!searchQuery && (
                <motion.button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create First Playlist
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPlaylists.map((playlist, index) => (
                <motion.div
                  key={playlist._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index % 12) }}
                >
                  <GlassCard className="p-6 group hover:scale-105 transition-all">
                    
                    {/* Cover Image */}
                    <div className="aspect-square bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      {playlist.coverUrl ? (
                        <img 
                          src={playlist.coverUrl} 
                          alt={playlist.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaMusic className="text-4xl text-green-400 opacity-60" />
                      )}
                      
                      {/* Play Button Overlay */}
                      <motion.button
                        onClick={() => playPlaylist(playlist)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaPlay className="text-3xl text-white" />
                      </motion.button>
                    </div>

                    {/* Playlist Info */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold line-clamp-2 flex-1">
                          {playlist.name}
                        </h3>
                        <div className="flex items-center gap-1 ml-2">
                          {playlist.isPublic ? (
                            <FaGlobe className="text-blue-400 text-sm" title="Public" />
                          ) : (
                            <FaLock className="text-gray-400 text-sm" title="Private" />
                          )}
                        </div>
                      </div>
                      
                      {playlist.description && (
                        <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                          {playlist.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{playlist.trackCount} track{playlist.trackCount !== 1 ? 's' : ''}</span>
                        <span className="flex items-center gap-1">
                          <FaClock />
                          {formatDuration(playlist.totalDuration)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => playPlaylist(playlist)}
                        className="flex-1 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={playlist.trackCount === 0}
                      >
                        Play All
                      </motion.button>
                      
                      <motion.button
                        onClick={() => setEditingPlaylist(playlist)}
                        className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaEdit />
                      </motion.button>
                      
                      <motion.button
                        onClick={() => deletePlaylist(playlist._id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          )}

        </div>

        <PlayerBar />
      </div>

      {/* Create/Edit Playlist Modal */}
      {(showCreateModal || editingPlaylist) && (
        <PlaylistModal
          playlist={editingPlaylist}
          onClose={() => {
            setShowCreateModal(false);
            setEditingPlaylist(null);
          }}
          onSave={editingPlaylist ? 
            (data) => updatePlaylist(editingPlaylist._id, data) : 
            createPlaylist
          }
        />
      )}
    </>
  );
}

// Playlist Create/Edit Modal Component
function PlaylistModal({ playlist, onClose, onSave }) {
  const [name, setName] = useState(playlist?.name || '');
  const [description, setDescription] = useState(playlist?.description || '');
  const [isPublic, setIsPublic] = useState(playlist?.isPublic || false);
  const [coverUrl, setCoverUrl] = useState(playlist?.coverUrl || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        isPublic,
        coverUrl: coverUrl.trim() || null
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {playlist ? 'Edit Playlist' : 'Create Playlist'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green-400 transition-colors"
                placeholder="Enter playlist name"
                required
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green-400 transition-colors"
                placeholder="Enter playlist description"
                rows={3}
                maxLength={500}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cover Image URL</label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-green-400 transition-colors"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-green-500 focus:ring-green-400"
              />
              <label htmlFor="isPublic" className="text-sm">
                Make this playlist public
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-white/20 text-gray-300 rounded-lg hover:bg-white/5 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                disabled={loading || !name.trim()}
              >
                {loading ? 'Saving...' : (playlist ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}