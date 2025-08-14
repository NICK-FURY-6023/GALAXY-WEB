/**
 * Bot Servers List Page
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaServer, FaDiscord, FaMusic, FaUsers, FaSearch, 
  FaPlay, FaPause, FaCrown, FaVolumeUp, FaArrowLeft 
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../../components/ui/GlassCard';

export default function BotServers() {
  const { user } = useAuth();
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, members, activity

  useEffect(() => {
    if (user && user.hasDiscordAccess) {
      loadGuilds();
    }
  }, [user]);

  const loadGuilds = async () => {
    try {
      const response = await fetch('/api/bot/guilds', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setGuilds(data.guilds || []);
      }
    } catch (error) {
      console.error('Failed to load guilds:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort guilds
  const filteredGuilds = guilds
    .filter(guild =>
      guild.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'members':
          return b.memberCount - a.memberCount;
        case 'activity':
          const aActivity = a.musicStatus?.playing ? 1 : 0;
          const bActivity = b.musicStatus?.playing ? 1 : 0;
          return bActivity - aActivity;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (!user || !user.hasDiscordAccess) {
    return (
      <>
        <Head>
          <title>Bot Servers | VEYNOVA</title>
        </Head>
        <div className="min-h-screen px-4 py-20 flex items-center justify-center">
          <GlassCard className="p-8 text-center max-w-md">
            <FaDiscord className="text-6xl text-[#5865f2] mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Discord Access Required</h1>
            <p className="text-gray-400 mb-6">Connect your Discord account to view your servers</p>
            <button
              onClick={() => window.location.href = '/api/auth/discord'}
              className="px-6 py-3 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
            >
              <FaDiscord />
              Connect Discord
            </button>
          </GlassCard>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>My Servers | VEYNOVA Bot Dashboard</title>
      </Head>

      <div className="min-h-screen px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link 
              href="/bot"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-black uppercase text-primary dark:text-primary-dark mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
                My Servers
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Manage VEYNOVA music bot across your Discord servers
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
                    placeholder="Search servers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>

                {/* Sort */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-400">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 transition-colors"
                    >
                      <option value="name">Name (A-Z)</option>
                      <option value="members">Members (High-Low)</option>
                      <option value="activity">Activity</option>
                    </select>
                  </div>

                  {/* Invite Bot Button */}
                  <a
                    href="https://discord.com/api/oauth2/authorize?client_id=1044596050859663401&permissions=41375902330737&redirect_uri=https%3A%2F%2Fdiscord.gg%2FU4kN6ZJyMt&response_type=code&scope=bot%20applications.commands%20guilds.join%20identify"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <FaDiscord />
                    Invite Bot
                  </a>
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
                {filteredGuilds.length} server{filteredGuilds.length !== 1 ? 's' : ''}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </motion.div>
          )}

          {/* Servers Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <GlassCard className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-white/10 rounded mb-2"></div>
                        <div className="h-3 bg-white/10 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="h-16 bg-white/10 rounded mb-4"></div>
                    <div className="h-10 bg-white/10 rounded"></div>
                  </GlassCard>
                </div>
              ))}
            </div>
          ) : filteredGuilds.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FaServer className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? 'No servers found' : 'No servers yet'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Add the VEYNOVA bot to your Discord servers to get started'
                }
              </p>
              {!searchQuery && (
                <a
                  href="https://discord.com/api/oauth2/authorize?client_id=1044596050859663401&permissions=41375902330737&redirect_uri=https%3A%2F%2Fdiscord.gg%2FU4kN6ZJyMt&response_type=code&scope=bot%20applications.commands%20guilds.join%20identify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                >
                  <FaDiscord />
                  Invite Bot to Server
                </a>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredGuilds.map((guild, index) => (
                <motion.div
                  key={guild.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index % 12) }}
                >
                  <GlassCard className="p-6 group hover:scale-105 transition-all">
                    
                    {/* Server Header */}
                    <div className="flex items-center gap-4 mb-4">
                      {guild.icon ? (
                        <img
                          src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64`}
                          alt={guild.name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-[#5865f2] rounded-full flex items-center justify-center text-white font-bold">
                          {guild.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{guild.name}</h3>
                          {guild.owner && (
                            <FaCrown className="text-yellow-400 text-sm" title="You own this server" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <FaUsers />
                            {guild.memberCount}
                          </span>
                          <span className={`flex items-center gap-1 ${guild.botStatus === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                            <div className={`w-2 h-2 rounded-full ${guild.botStatus === 'online' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                            {guild.botStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Music Status */}
                    <div className="mb-4">
                      {guild.musicStatus?.playing ? (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <div className="flex items-center gap-2 text-green-400 text-sm font-semibold mb-2">
                            <FaPlay />
                            Now Playing
                          </div>
                          <p className="font-medium text-sm mb-1">{guild.musicStatus.currentTrack.title}</p>
                          <p className="text-xs text-gray-400 mb-2">{guild.musicStatus.currentTrack.artist}</p>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>Queue: {guild.musicStatus.queueLength} tracks</span>
                            <span>{Math.floor(guild.musicStatus.currentTrack.duration / 60)}:{(guild.musicStatus.currentTrack.duration % 60).toString().padStart(2, '0')}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <FaPause />
                            Not Playing
                          </div>
                          {guild.musicStatus?.queueLength > 0 && (
                            <p className="text-xs text-gray-400 mt-1">
                              Queue: {guild.musicStatus.queueLength} tracks waiting
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Link
                        href={`/bot/${guild.id}`}
                        className="block w-full py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white text-center rounded-lg font-semibold transition-colors"
                      >
                        Manage Server
                      </Link>
                      
                      {guild.musicStatus?.playing && (
                        <div className="flex gap-2">
                          <button className="flex-1 py-2 px-3 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-lg text-sm transition-colors">
                            <FaPause className="mx-auto" />
                          </button>
                          <button className="flex-1 py-2 px-3 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-lg text-sm transition-colors">
                            <FaVolumeUp className="mx-auto" />
                          </button>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          )}

        </div>
      </div>
    </>
  );
}