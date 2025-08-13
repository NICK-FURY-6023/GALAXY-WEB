/**
 * Radio Stations Page
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaPlay, FaRadio, FaSearch, FaGlobe, FaMusic } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { usePlayer } from '../../hooks/usePlayer';
import GlassCard from '../../components/ui/GlassCard';
import PlayerBar from '../../components/music/PlayerBar';

export default function RadioPage() {
  const { user, login } = useAuth();
  const { setCurrent, play } = usePlayer();
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    loadRadioStations();
  }, []);

  useEffect(() => {
    filterStations();
  }, [searchQuery, selectedGenre, stations]);

  const loadRadioStations = async () => {
    try {
      const response = await fetch('/api/music/radio');
      if (response.ok) {
        const data = await response.json();
        setStations(data.stations || []);
      }
    } catch (error) {
      console.error('Failed to load radio stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStations = () => {
    let filtered = stations;

    if (searchQuery.trim()) {
      filtered = filtered.filter(station =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre !== 'All') {
      filtered = filtered.filter(station => station.genre === selectedGenre);
    }

    setFilteredStations(filtered);
  };

  const playRadioStation = (station) => {
    const radioTrack = {
      source: 'radio',
      sid: btoa(station.url),
      title: station.name,
      artist: station.genre,
      album: station.country,
      thumbnailUrl: station.thumbnailUrl || '/galaxy-logo.png',
      url: station.url,
      streamUrl: station.url,
      metadata: {
        genre: station.genre,
        country: station.country,
        bitrate: station.bitrate,
        description: station.description,
        isLive: true,
      },
    };

    setCurrent(radioTrack);
    play();
  };

  const genres = ['All', ...new Set(stations.map(s => s.genre))];

  if (!user) {
    return (
      <>
        <Head>
          <title>Radio Stations | VEYNOVA Music Player</title>
        </Head>
        <div className="min-h-screen px-4 py-20 flex items-center justify-center">
          <GlassCard className="p-8 text-center max-w-md">
            <FaRadio className="text-6xl text-blue-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Radio Stations</h1>
            <p className="text-gray-400 mb-6">Sign in to access live radio stations</p>
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
        <title>Radio Stations | VEYNOVA Music Player</title>
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
              Radio Stations
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover live radio stations from around the world
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
              <div className="flex flex-col md:flex-row gap-4">
                
                {/* Search */}
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search stations by name, genre, or country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>

                {/* Genre Filter */}
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-blue-400 transition-colors"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
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
                {filteredStations.length} station{filteredStations.length !== 1 ? 's' : ''} found
              </p>
            </motion.div>
          )}

          {/* Stations Grid */}
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
          ) : filteredStations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FaRadio className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No stations found</h3>
              <p className="text-gray-400">
                {searchQuery || selectedGenre !== 'All' 
                  ? 'Try adjusting your filters' 
                  : 'No radio stations available'
                }
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredStations.map((station, index) => (
                <motion.div
                  key={`${station.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index % 12) }}
                >
                  <GlassCard className="p-6 group hover:scale-105 transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                          {station.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                          <FaMusic className="text-blue-400" />
                          <span>{station.genre}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <FaGlobe className="text-green-400" />
                          <span>{station.country}</span>
                        </div>
                      </div>
                      
                      <motion.button
                        onClick={() => playRadioStation(station)}
                        className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaPlay />
                      </motion.button>
                    </div>

                    {station.description && (
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {station.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      {station.bitrate && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                          {station.bitrate} kbps
                        </span>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-400">LIVE</span>
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