/**
 * Main Music Hub Page
 * Central dashboard for VEYNOVA Music Player
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaSearch, FaPlay, FaHeart, FaList, FaHistory, FaRadio } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { usePlayer } from '../../hooks/usePlayer';
import { useDebounce } from '../../hooks/useDebounce';

// We'll create these components next
import GlassCard from '../../components/ui/GlassCard';
import TrackCard from '../../components/music/TrackCard';
import PlayerBar from '../../components/music/PlayerBar';
// import SearchResults from '../../components/music/SearchResults';
// import PlayerBar from '../../components/music/PlayerBar';

export default function MusicHub() {
  const { user, login } = useAuth();
  const { current, isPlaying } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedQuery = useDebounce(searchQuery, 500);

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setSearchResults(null);
    }
  }, [debouncedQuery]);

  const performSearch = async (query) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/music/search?q=${encodeURIComponent(query)}&sources=yt,sc,sp,dz,radio&limit=10`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error('Search failed:', response.statusText);
        setSearchResults(null);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  // If user is not logged in, show login options
  if (!user) {
    return (
      <>
        <Head>
          <title>VEYNOVA Music Player | GALAXY</title>
          <meta name="description" content="Stream music from YouTube, Spotify, SoundCloud, Deezer, and radio stations" />
        </Head>

        <div className="min-h-screen px-4 py-20">
          <div className="container mx-auto max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-black uppercase text-primary dark:text-primary-dark mb-6">
                VEYNOVA Music
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
                Stream high-quality music from multiple sources. 
                <span className="font-bold text-purple-400"> YouTube</span>,
                <span className="font-bold text-green-500"> Spotify</span>,
                <span className="font-bold text-orange-500"> SoundCloud</span>,
                <span className="font-bold text-pink-500"> Deezer</span>, and 
                <span className="font-bold text-blue-400"> Radio</span> all in one place.
              </p>

              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-primary dark:text-primary-dark">
                  Sign In to Continue
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Choose your preferred sign-in method to access your music library, playlists, and personalized experience.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    onClick={() => login('google')}
                    className="flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </motion.button>

                  <motion.button
                    onClick={() => login('discord')}
                    className="flex items-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                    </svg>
                    Continue with Discord
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  // Main music hub interface for logged-in users
  return (
    <>
      <Head>
        <title>VEYNOVA Music Player | GALAXY</title>
        <meta name="description" content="Stream music from YouTube, Spotify, SoundCloud, Deezer, and radio stations" />
      </Head>

      <div className="min-h-screen px-4 py-20 pb-32"> {/* Extra bottom padding for player bar */}
        <div className="container mx-auto max-w-6xl">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black uppercase text-primary dark:text-primary-dark mb-4">
              Welcome back, {user.displayName}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover and stream music from your favorite sources
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <GlassCard className="p-6">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
                <input
                  type="text"
                  placeholder="Search for songs, artists, albums, or radio stations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent border-2 border-white/20 rounded-xl text-lg focus:outline-none focus:border-purple-400 transition-colors"
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Search Results */}
          {searchResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-primary dark:text-primary-dark">
                  Search Results for "{searchResults.query}"
                </h2>
                
                {/* Source Results */}
                {['deezer', 'youtube', 'spotify', 'soundcloud', 'radio'].map(source => {
                  const tracks = searchResults.results[source] || [];
                  const hasApiKey = checkApiKeyAvailable(source);
                  
                  return (
                    <div key={source} className="mb-8">
                      <h3 className="font-semibold text-xl mb-4 capitalize flex items-center gap-2">
                        <span className={getSourceColor(source)}>
                          {getSourceDisplayName(source)}
                        </span>
                        {tracks.length > 0 && (
                          <span className="text-gray-400">({tracks.length} results)</span>
                        )}
                      </h3>
                      
                      {!hasApiKey && source !== 'deezer' && source !== 'radio' ? (
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                          <div className="text-4xl text-gray-600 mb-3">🔑</div>
                          <h4 className="font-semibold text-gray-300 mb-2">
                            {getSourceDisplayName(source)} API Key Required
                          </h4>
                          <p className="text-gray-400 text-sm mb-4">
                            Add your {getSourceDisplayName(source)} API credentials to enable search results from this source.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                              Add API Key
                            </button>
                            <button 
                              onClick={() => showMockResults(source)}
                              className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors text-sm"
                            >
                              Show Demo Results
                            </button>
                          </div>
                        </div>
                      ) : tracks.length > 0 ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {tracks.slice(0, 6).map((track, index) => (
                              <TrackCard 
                                key={`${source}-${track.sid || index}`} 
                                track={track} 
                                variant="compact" 
                              />
                            ))}
                          </div>
                          {tracks.length > 6 && (
                            <button className="mt-3 text-purple-400 hover:text-purple-300 text-sm">
                              Show {tracks.length - 6} more {source} results
                            </button>
                          )}
                        </>
                      ) : hasApiKey ? (
                        <div className="text-center py-4">
                          <p className="text-gray-500 text-sm">No {source} results found</p>
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                {searchResults.totalResults === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-lg">No results found for "{searchResults.query}"</p>
                    <p className="text-gray-500 text-sm mt-2">Try different keywords or add more API keys for additional sources</p>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}

          {/* Quick Access Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <GlassCard className="p-6 text-center hover:scale-105 transition-transform cursor-pointer">
              <FaHeart className="text-4xl text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Favorites</h3>
              <p className="text-gray-400">Your liked songs</p>
            </GlassCard>

            <GlassCard className="p-6 text-center hover:scale-105 transition-transform cursor-pointer">
              <FaList className="text-4xl text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Playlists</h3>
              <p className="text-gray-400">Custom collections</p>
            </GlassCard>

            <GlassCard className="p-6 text-center hover:scale-105 transition-transform cursor-pointer">
              <FaHistory className="text-4xl text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">History</h3>
              <p className="text-gray-400">Recently played</p>
            </GlassCard>

            <GlassCard className="p-6 text-center hover:scale-105 transition-transform cursor-pointer">
              <FaRadio className="text-4xl text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Radio</h3>
              <p className="text-gray-400">Live stations</p>
            </GlassCard>
          </motion.div>

          {/* Currently Playing Section (if any) */}
          {current && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-primary dark:text-primary-dark">
                  Now Playing
                </h2>
                <div className="flex items-center gap-4">
                  {current.thumbnailUrl && (
                    <img 
                      src={current.thumbnailUrl} 
                      alt={current.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{current.title}</h3>
                    <p className="text-gray-400">{current.artist}</p>
                    <p className="text-sm text-purple-400 capitalize">Playing from {current.source}</p>
                  </div>
                  <div className="ml-auto">
                    {isPlaying && (
                      <div className="flex space-x-1">
                        <div className="w-1 h-8 bg-purple-400 animate-wave"></div>
                        <div className="w-1 h-6 bg-purple-400 animate-wave" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-10 bg-purple-400 animate-wave" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-4 bg-purple-400 animate-wave" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

        </div>

        {/* Global Player Bar */}
        <PlayerBar />
      </div>
    </>
  );
}