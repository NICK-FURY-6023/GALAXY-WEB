/**
 * Listening History Page
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  FaHistory, FaPlay, FaTrash, FaSearch, FaCalendarAlt, 
  FaFilter, FaEye 
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { usePlayer } from '../../hooks/usePlayer';
import GlassCard from '../../components/ui/GlassCard';
import PlayerBar from '../../components/music/PlayerBar';

export default function HistoryPage() {
  const { user, login } = useAuth();
  const { setQueue, play } = usePlayer();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('all'); // all, 7d, 30d, 1y
  const [showUnique, setShowUnique] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, pages: 0 });

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, timeRange, showUnique, pagination.page]);

  const loadHistory = async () => {
    try {
      const params = new URLSearchParams({
        range: timeRange,
        unique: showUnique.toString(),
        limit: pagination.limit.toString(),
        page: pagination.page.toString()
      });

      const response = await fetch(`/api/music/history?${params}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
        setPagination(prev => ({ ...prev, ...data.pagination }));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async (scope = 'all') => {
    const confirmMessage = scope === 'all' 
      ? 'Are you sure you want to clear all your listening history?' 
      : `Are you sure you want to clear history from the last ${scope}?`;
    
    if (!confirm(confirmMessage)) return;

    try {
      const response = await fetch('/api/music/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ scope })
      });

      if (response.ok) {
        loadHistory(); // Reload to show updated data
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to clear history');
      }
    } catch (error) {
      console.error('Failed to clear history:', error);
      alert('Failed to clear history');
    }
  };

  const playFromHistory = (track, index) => {
    // Create a queue from filtered history
    setQueue(filteredHistory, index);
    play();
  };

  // Filter history based on search
  const filteredHistory = history.filter(track =>
    track.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (track.album && track.album.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  const formatDetailedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <>
        <Head>
          <title>History | VEYNOVA Music Player</title>
        </Head>
        <div className="min-h-screen px-4 py-20 flex items-center justify-center">
          <GlassCard className="p-8 text-center max-w-md">
            <FaHistory className="text-6xl text-blue-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Listening History</h1>
            <p className="text-gray-400 mb-6">Sign in to view your music listening history</p>
            <button
              onClick={() => login('google')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
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
        <title>My History | VEYNOVA Music Player</title>
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
              Listening History
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your music journey over time
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
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                
                {/* Search */}
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 flex-wrap">
                  
                  {/* Time Range */}
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400" />
                    <select
                      value={timeRange}
                      onChange={(e) => {
                        setTimeRange(e.target.value);
                        setPagination(prev => ({ ...prev, page: 1 }));
                      }}
                      className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                    >
                      <option value="all">All Time</option>
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="1y">Last Year</option>
                    </select>
                  </div>

                  {/* Unique Toggle */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showUnique"
                      checked={showUnique}
                      onChange={(e) => {
                        setShowUnique(e.target.checked);
                        setPagination(prev => ({ ...prev, page: 1 }));
                      }}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-400"
                    />
                    <label htmlFor="showUnique" className="text-sm flex items-center gap-1">
                      <FaEye className="text-blue-400" />
                      Unique tracks only
                    </label>
                  </div>

                  {/* Clear History */}
                  <div className="relative group">
                    <motion.button
                      className="flex items-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaTrash />
                      Clear
                    </motion.button>
                    
                    {/* Clear Options Dropdown */}
                    <div className="absolute right-0 top-full mt-1 bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      <button
                        onClick={() => clearHistory('7d')}
                        className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-sm transition-colors"
                      >
                        Clear last 7 days
                      </button>
                      <button
                        onClick={() => clearHistory('30d')}
                        className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-sm transition-colors"
                      >
                        Clear last 30 days
                      </button>
                      <button
                        onClick={() => clearHistory('all')}
                        className="w-full text-left px-3 py-2 hover:bg-red-500/20 rounded text-sm text-red-400 transition-colors"
                      >
                        Clear all history
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Results Info */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 flex justify-between items-center"
            >
              <p className="text-gray-400">
                {filteredHistory.length} track{filteredHistory.length !== 1 ? 's' : ''}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
              
              {pagination.pages > 1 && (
                <p className="text-gray-400 text-sm">
                  Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                </p>
              )}
            </motion.div>
          )}

          {/* History List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
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
          ) : filteredHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FaHistory className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? 'No history found' : 'No listening history'}
              </h3>
              <p className="text-gray-400">
                {searchQuery 
                  ? 'Try adjusting your search terms or filters' 
                  : 'Start playing music to build your listening history'
                }
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                {filteredHistory.map((track, index) => (
                  <motion.div
                    key={`${track.source}-${track.sid}-${track.playedAt || index}`}
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
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                              <FaHistory className="text-blue-400" />
                            </div>
                          )}
                          
                          {/* Play Button Overlay */}
                          <motion.button
                            onClick={() => playFromHistory(track, index)}
                            className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaPlay className="text-white text-sm" />
                          </motion.button>
                        </div>

                        {/* Track Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate group-hover:text-blue-400 transition-colors">
                            {track.title}
                          </h3>
                          <p className="text-sm text-gray-400 truncate">
                            {track.artist}
                            {track.album && ` • ${track.album}`}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full capitalize">
                              {track.source}
                            </span>
                            {showUnique && track.playCount && track.playCount > 1 && (
                              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                                {track.playCount} plays
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Duration */}
                        {track.duration && (
                          <div className="text-sm text-gray-400 hidden md:block">
                            {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                          </div>
                        )}

                        {/* Play Time */}
                        <div className="text-right min-w-0">
                          <div className="text-sm text-gray-400">
                            {formatDate(track.playedAt)}
                          </div>
                          <div className="text-xs text-gray-500 hidden md:block">
                            {formatDetailedDate(track.playedAt)}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 flex justify-center"
                >
                  <GlassCard className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500/30 transition-colors"
                      >
                        Previous
                      </button>
                      
                      <span className="px-4 py-2 text-gray-400">
                        {pagination.page} / {pagination.pages}
                      </span>
                      
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                        disabled={pagination.page === pagination.pages}
                        className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500/30 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </>
          )}

        </div>

        <PlayerBar />
      </div>
    </>
  );
}