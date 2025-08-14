/**
 * Bot Dashboard Overview Page
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaRobot, FaDiscord, FaMusic, FaUsers, FaServer, 
  FaClock, FaPlay, FaPause, FaVolumeUp 
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../../components/ui/GlassCard';

export default function BotDashboard() {
  const { user, login } = useAuth();
  const [botStats, setBotStats] = useState(null);
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.hasDiscordAccess) {
      loadBotData();
    }
  }, [user]);

  const loadBotData = async () => {
    try {
      // Load bot stats (mock data for now)
      setBotStats({
        status: 'online',
        uptime: '3d 12h 45m',
        ping: '87ms',
        guilds: 157,
        users: 45234,
        tracksPlayed: 12847,
        activeConnections: 23
      });

      // Load user's guilds
      const guildsResponse = await fetch('/api/bot/guilds', {
        credentials: 'include'
      });
      
      if (guildsResponse.ok) {
        const data = await guildsResponse.json();
        setGuilds(data.guilds || []);
      }
    } catch (error) {
      console.error('Failed to load bot data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <Head>
          <title>Bot Dashboard | VEYNOVA</title>
        </Head>
        <div className="min-h-screen px-4 py-20 flex items-center justify-center">
          <GlassCard className="p-8 text-center max-w-md">
            <FaRobot className="text-6xl text-purple-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Bot Dashboard</h1>
            <p className="text-gray-400 mb-6">Sign in with Discord to manage your music bot across servers</p>
            <button
              onClick={() => login('discord')}
              className="px-6 py-3 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
            >
              <FaDiscord />
              Sign in with Discord
            </button>
          </GlassCard>
        </div>
      </>
    );
  }

  if (!user.hasDiscordAccess) {
    return (
      <>
        <Head>
          <title>Bot Dashboard | VEYNOVA</title>
        </Head>
        <div className="min-h-screen px-4 py-20 flex items-center justify-center">
          <GlassCard className="p-8 text-center max-w-md">
            <FaDiscord className="text-6xl text-[#5865f2] mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Discord Access Required</h1>
            <p className="text-gray-400 mb-6">Connect your Discord account to access the bot dashboard</p>
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
        <title>Bot Dashboard | VEYNOVA</title>
      </Head>

      <div className="min-h-screen px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black uppercase text-primary dark:text-primary-dark mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
                Bot Dashboard
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Control your VEYNOVA music bot across Discord servers
            </p>
          </motion.div>

          {/* Bot Status */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <GlassCard className="p-6">
                    <div className="h-12 bg-white/10 rounded mb-4"></div>
                    <div className="h-6 bg-white/10 rounded mb-2"></div>
                    <div className="h-4 bg-white/10 rounded w-2/3"></div>
                  </GlassCard>
                </div>
              ))}
            </div>
          ) : botStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {/* Bot Status */}
              <GlassCard className="p-6 text-center">
                <div className={`text-4xl mb-4 ${botStats.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                  <FaRobot className="mx-auto" />
                </div>
                <h3 className="text-xl font-bold mb-2">Bot Status</h3>
                <p className={`capitalize font-semibold ${botStats.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                  {botStats.status}
                </p>
                <p className="text-sm text-gray-400 mt-1">Ping: {botStats.ping}</p>
              </GlassCard>

              {/* Servers */}
              <GlassCard className="p-6 text-center">
                <FaServer className="text-4xl text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Servers</h3>
                <p className="text-2xl font-bold text-blue-400">{botStats.guilds}</p>
                <p className="text-sm text-gray-400 mt-1">Total servers</p>
              </GlassCard>

              {/* Users */}
              <GlassCard className="p-6 text-center">
                <FaUsers className="text-4xl text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Users</h3>
                <p className="text-2xl font-bold text-purple-400">{botStats.users.toLocaleString()}</p>
                <p className="text-sm text-gray-400 mt-1">Total users</p>
              </GlassCard>

              {/* Tracks Played */}
              <GlassCard className="p-6 text-center">
                <FaMusic className="text-4xl text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Tracks Played</h3>
                <p className="text-2xl font-bold text-green-400">{botStats.tracksPlayed.toLocaleString()}</p>
                <p className="text-sm text-gray-400 mt-1">Total tracks</p>
              </GlassCard>
            </motion.div>
          )}

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          >
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaClock className="text-blue-400" />
                Uptime & Performance
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Uptime:</span>
                  <span className="font-semibold">{botStats?.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ping:</span>
                  <span className="text-green-400 font-semibold">{botStats?.ping}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Connections:</span>
                  <span className="text-purple-400 font-semibold">{botStats?.activeConnections}</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaMusic className="text-green-400" />
                Music Activity
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Currently Playing:</span>
                  <span className="text-green-400 font-semibold">
                    {guilds.filter(g => g.musicStatus?.playing).length} servers
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Queue Items:</span>
                  <span className="font-semibold">
                    {guilds.reduce((sum, g) => sum + (g.musicStatus?.queueLength || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Your Servers:</span>
                  <span className="text-blue-400 font-semibold">{guilds.length}</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Your Servers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Servers</h2>
              <Link 
                href="/bot/servers"
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                View All Servers →
              </Link>
            </div>

            {guilds.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <FaServer className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Servers Found</h3>
                <p className="text-gray-400 mb-4">
                  The bot needs to be added to your Discord servers first
                </p>
                <a
                  href="https://discord.com/api/oauth2/authorize?client_id=1044596050859663401&permissions=41375902330737&redirect_uri=https%3A%2F%2Fdiscord.gg%2FU4kN6ZJyMt&response_type=code&scope=bot%20applications.commands%20guilds.join%20identify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                >
                  <FaDiscord />
                  Invite Bot to Server
                </a>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guilds.slice(0, 6).map((guild) => (
                  <GlassCard key={guild.id} className="p-6 hover:scale-105 transition-transform">
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
                        <h3 className="font-semibold truncate">{guild.name}</h3>
                        <p className="text-sm text-gray-400">{guild.memberCount} members</p>
                      </div>
                    </div>

                    {/* Music Status */}
                    {guild.musicStatus?.playing ? (
                      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center gap-2 text-green-400 text-sm font-semibold mb-1">
                          <FaPlay />
                          Now Playing
                        </div>
                        <p className="font-medium text-sm">{guild.musicStatus.currentTrack.title}</p>
                        <p className="text-xs text-gray-400">{guild.musicStatus.currentTrack.artist}</p>
                      </div>
                    ) : (
                      <div className="mb-4 p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <FaPause />
                          Not Playing
                        </div>
                      </div>
                    )}

                    <Link
                      href={`/bot/${guild.id}`}
                      className="block w-full py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white text-center rounded-lg font-semibold transition-colors"
                    >
                      Manage Server
                    </Link>
                  </GlassCard>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}