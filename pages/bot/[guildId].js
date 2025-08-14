/**
 * Individual Guild Music Control Dashboard
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { 
  FaPlay, FaPause, FaStop, FaStepForward, FaStepBackward,
  FaVolumeUp, FaVolumeMute, FaRandom, FaRedoAlt, FaList,
  FaArrowLeft, FaUsers, FaCog, FaHistory, FaMicrophone,
  FaHeadphones, FaFilter, FaClock, FaTrash, FaPlus
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import GlassCard from '../../components/ui/GlassCard';

export default function GuildDashboard() {
  const router = useRouter();
  const { guildId } = router.query;
  const { user } = useAuth();
  
  const [guild, setGuild] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [queue, setQueue] = useState([]);
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // off, one, all
  const [shuffle, setShuffle] = useState(false);
  const [filters, setFilters] = useState({
    bassboost: 0,
    nightcore: false,
    vaporwave: false,
    karaoke: false,
    speed: 1.0,
    pitch: 1.0
  });
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [listeningMembers, setListeningMembers] = useState([]);

  useEffect(() => {
    if (guildId && user?.hasDiscordAccess) {
      loadGuildData();
      // TODO: Set up WebSocket connection for real-time updates
    }
  }, [guildId, user]);

  const loadGuildData = async () => {
    try {
      // Load guild info (mock data for now)
      const mockGuild = {
        id: guildId,
        name: 'Sample Discord Server',
        icon: null,
        memberCount: 1247,
        textChannels: [
          { id: '1', name: 'general' },
          { id: '2', name: 'music' },
          { id: '3', name: 'bot-commands' }
        ],
        voiceChannels: [
          { id: '1', name: 'General Voice', members: 5 },
          { id: '2', name: 'Music Voice', members: 12 },
          { id: '3', name: 'AFK', members: 0 }
        ],
        botSettings: {
          textChannelId: '2',
          voiceChannelId: '2',
          djRoleIds: ['123', '456'],
          defaultVolume: 50,
          autoplay: true,
          announceSongs: true
        }
      };

      setGuild(mockGuild);

      // Mock now playing data
      if (Math.random() > 0.3) {
        setNowPlaying({
          title: 'Bohemian Rhapsody',
          artist: 'Queen',
          album: 'A Night at the Opera',
          duration: 355,
          position: 127,
          thumbnailUrl: 'https://i.scdn.co/image/ab67616d00001e02ce4f1737bc8a646c8c4bd25a',
          source: 'youtube',
          requestedBy: {
            username: 'MusicLover42',
            avatarUrl: null
          }
        });
        setIsPlaying(Math.random() > 0.3);
      }

      // Mock queue data
      setQueue([
        {
          id: '1',
          title: 'Hotel California',
          artist: 'Eagles',
          duration: 391,
          thumbnailUrl: 'https://i.scdn.co/image/ab67616d00001e024637341b9f507521afa9a778',
          requestedBy: { username: 'RockFan23', avatarUrl: null }
        },
        {
          id: '2', 
          title: 'Stairway to Heaven',
          artist: 'Led Zeppelin',
          duration: 482,
          thumbnailUrl: 'https://i.scdn.co/image/ab67616d00001e025b7bb788cd68718bd63e1e52',
          requestedBy: { username: 'ClassicRock99', avatarUrl: null }
        }
      ]);

      // Mock logs
      setLogs([
        { time: new Date(Date.now() - 300000), user: 'MusicLover42', action: 'Started playing Bohemian Rhapsody' },
        { time: new Date(Date.now() - 600000), user: 'RockFan23', action: 'Added Hotel California to queue' },
        { time: new Date(Date.now() - 900000), user: 'DJ_Master', action: 'Set volume to 60%' },
        { time: new Date(Date.now() - 1200000), user: 'Bot', action: 'Connected to Music Voice channel' }
      ]);

      // Mock listening members
      setListeningMembers([
        { username: 'MusicLover42', avatarUrl: null },
        { username: 'RockFan23', avatarUrl: null },
        { username: 'ClassicRock99', avatarUrl: null },
        { username: 'DJ_Master', avatarUrl: null }
      ]);

    } catch (error) {
      console.error('Failed to load guild data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Send command to bot
  };

  const handleStop = () => {
    setIsPlaying(false);
    setNowPlaying(null);
    // TODO: Send command to bot
  };

  const handleNext = () => {
    // TODO: Send command to bot
  };

  const handlePrevious = () => {
    // TODO: Send command to bot
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    // TODO: Send command to bot
  };

  const handleSeek = (direction) => {
    // TODO: Send seek command to bot
    console.log(`Seeking ${direction}`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user || !user.hasDiscordAccess) {
    return (
      <>
        <Head>
          <title>Guild Dashboard | VEYNOVA</title>
        </Head>
        <div className="min-h-screen px-4 py-20 flex items-center justify-center">
          <GlassCard className="p-8 text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-400 mb-6">Discord authentication required</p>
            <Link
              href="/bot"
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
            >
              Back to Dashboard
            </Link>
          </GlassCard>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading... | VEYNOVA</title>
        </Head>
        <div className="min-h-screen px-4 py-20">
          <div className="container mx-auto max-w-6xl">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-white/10 rounded w-1/3"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-64 bg-white/10 rounded-xl"></div>
                  <div className="h-48 bg-white/10 rounded-xl"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-32 bg-white/10 rounded-xl"></div>
                  <div className="h-48 bg-white/10 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{guild?.name} | VEYNOVA Bot Dashboard</title>
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
              href="/bot/servers"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4"
            >
              <FaArrowLeft />
              Back to Servers
            </Link>
            
            <div className="flex items-center gap-4 mb-4">
              {guild?.icon ? (
                <img
                  src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64`}
                  alt={guild.name}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-[#5865f2] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {guild?.name?.charAt(0) || 'S'}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">{guild?.name}</h1>
                <p className="text-gray-400 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <FaUsers />
                    {guild?.memberCount} members
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Bot Online
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Control Panel */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Now Playing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard className="p-6">
                  <h2 className="text-xl font-bold mb-4">Now Playing</h2>
                  
                  {nowPlaying ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={nowPlaying.thumbnailUrl}
                          alt={nowPlaying.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{nowPlaying.title}</h3>
                          <p className="text-gray-400 truncate">{nowPlaying.artist}</p>
                          <p className="text-sm text-purple-400">
                            Requested by {nowPlaying.requestedBy.username}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">
                            {formatTime(nowPlaying.position)} / {formatTime(nowPlaying.duration)}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-purple-400 h-2 rounded-full transition-all"
                          style={{ width: `${(nowPlaying.position / nowPlaying.duration) * 100}%` }}
                        />
                      </div>

                      {/* Transport Controls */}
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => setShuffle(!shuffle)}
                          className={`p-2 rounded-lg transition-colors ${
                            shuffle ? 'text-purple-400 bg-purple-400/20' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <FaRandom />
                        </button>

                        <button
                          onClick={handlePrevious}
                          className="p-3 text-gray-400 hover:text-white transition-colors"
                        >
                          <FaStepBackward />
                        </button>

                        <button
                          onClick={() => handleSeek(-10)}
                          className="p-2 text-gray-400 hover:text-white transition-colors text-sm"
                        >
                          -10s
                        </button>

                        <button
                          onClick={handlePlayPause}
                          className="p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition-colors"
                        >
                          {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} className="ml-1" />}
                        </button>

                        <button
                          onClick={() => handleSeek(10)}
                          className="p-2 text-gray-400 hover:text-white transition-colors text-sm"
                        >
                          +10s
                        </button>

                        <button
                          onClick={handleNext}
                          className="p-3 text-gray-400 hover:text-white transition-colors"
                        >
                          <FaStepForward />
                        </button>

                        <button
                          onClick={() => {
                            const modes = ['off', 'one', 'all'];
                            const currentIndex = modes.indexOf(repeatMode);
                            const nextMode = modes[(currentIndex + 1) % modes.length];
                            setRepeatMode(nextMode);
                          }}
                          className={`p-2 rounded-lg transition-colors relative ${
                            repeatMode !== 'off' ? 'text-purple-400 bg-purple-400/20' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <FaRedoAlt />
                          {repeatMode === 'one' && (
                            <span className="absolute -top-1 -right-1 text-xs bg-purple-400 text-white rounded-full w-4 h-4 flex items-center justify-center">
                              1
                            </span>
                          )}
                        </button>

                        <button
                          onClick={handleStop}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FaStop />
                        </button>
                      </div>

                      {/* Volume Control */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleVolumeChange(volume === 0 ? 50 : 0)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                        </button>
                        <div className="flex-1">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                            className="w-full accent-purple-400"
                          />
                        </div>
                        <span className="text-sm text-gray-400 min-w-[3rem]">{volume}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaMusic className="text-4xl text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">Nothing playing right now</p>
                      <p className="text-sm text-gray-500 mt-1">Use Discord commands to start playing music</p>
                    </div>
                  )}
                </GlassCard>
              </motion.div>

              {/* Queue */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <FaList />
                      Queue ({queue.length})
                    </h2>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <FaRandom title="Shuffle Queue" />
                      </button>
                      <button className="p-2 text-red-400 hover:text-red-300 transition-colors">
                        <FaTrash title="Clear Queue" />
                      </button>
                    </div>
                  </div>

                  {queue.length > 0 ? (
                    <div className="space-y-3">
                      {queue.map((track, index) => (
                        <div key={track.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <span className="text-sm text-gray-400 min-w-[1.5rem]">{index + 1}</span>
                          <img
                            src={track.thumbnailUrl}
                            alt={track.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{track.title}</p>
                            <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                            <p className="text-xs text-gray-500">
                              {formatTime(track.duration)} • {track.requestedBy.username}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button className="p-1 text-gray-400 hover:text-green-400 transition-colors">
                              <FaPlay size={12} title="Play Now" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                              <FaTrash size={12} title="Remove" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaList className="text-4xl text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">Queue is empty</p>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard className="p-6">
                  <h3 className="font-bold mb-4">Server Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400">Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Members:</span>
                      <span>{guild?.memberCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Listening:</span>
                      <span className="text-purple-400">{listeningMembers.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Queue:</span>
                      <span>{queue.length} tracks</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Currently Listening */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <FaHeadphones />
                    Listening ({listeningMembers.length})
                  </h3>
                  <div className="space-y-2">
                    {listeningMembers.map((member, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#5865f2] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {member.username.charAt(0)}
                        </div>
                        <span className="text-sm">{member.username}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard className="p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <FaHistory />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {logs.slice(0, 5).map((log, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <FaClock size={10} />
                          <span>{log.time.toLocaleTimeString()}</span>
                        </div>
                        <p className="mt-1">
                          <span className="text-purple-400">{log.user}</span> {log.action}
                        </p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}