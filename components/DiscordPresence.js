// components/DiscordPresence.js

import { useState, useEffect } from 'react';
import {
  FaSpotify,
  FaGamepad,
  FaYoutube,
  FaCode,
  FaTwitch,
  FaTerminal,
  FaQuestionCircle,
  FaMusic
} from 'react-icons/fa';
import Image from 'next/image';

const STATUS_MAP = {
  online: { color: 'bg-green-500', label: 'Online' },
  idle: { color: 'bg-yellow-500', label: 'Idle' },
  dnd: { color: 'bg-red-500', label: 'Do Not Disturb' },
  offline: { color: 'bg-gray-500', label: 'Offline' },
};

const ACTIVITY_TYPE_MAP = {
  0: 'Playing',
  1: 'Streaming',
  2: 'Listening to',
  3: 'Watching',
  4: 'Custom Status',
  5: 'Competing in',
};

const ElapsedTime = ({ start }) => {
  const [elapsed, setElapsed] = useState(Date.now() - start);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 1000);
    return () => clearInterval(interval);
  }, [start]);

  const minutes = Math.floor(elapsed / 1000 / 60).toString().padStart(2, '0');
  const seconds = Math.floor((elapsed / 1000) % 60).toString().padStart(2, '0');

  return <span>{minutes}:{seconds} elapsed</span>;
};

const RealtimeProgressBar = ({ start, end }) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const elapsedMs = now - start;
  const totalMs = end - start;
  const progress = Math.min((elapsedMs / totalMs) * 100, 100);

  const formatTime = (ms) => {
    if (!ms || ms < 0) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const getGradientColor = (progress) => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-yellow-500';
    if (progress < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full mt-2">
      <div className="w-full bg-gray-600 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${getGradientColor(progress)}`} style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{formatTime(elapsedMs)}</span>
        <span>{formatTime(totalMs)}</span>
      </div>
    </div>
  );
};

const getActivityImage = (activity) => {
  if (activity.assets?.large_image) {
    if (activity.name === 'Spotify') {
      return activity.assets.large_image.replace('spotify:', 'https://i.scdn.co/image/');
    } else if (activity.assets.large_image.startsWith('mp:')) {
      return `https://media.discordapp.net/${activity.assets.large_image.replace('mp:', '')}`;
    } else {
      return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
    }
  }
  return null;
};

const getIconAndColor = (activity) => {
  const name = activity.name?.toLowerCase() || '';

  if (name.includes('spotify')) return { icon: <FaSpotify className="text-green-400 text-4xl" />, bg: 'bg-green-900/50', label: 'Spotify' };
  if (name.includes('youtube')) return { icon: <FaYoutube className="text-red-400 text-4xl" />, bg: 'bg-red-900/50', label: 'YouTube' };
  if (name.includes('soundcloud')) return { icon: <FaMusic className="text-orange-400 text-4xl" />, bg: 'bg-orange-900/50', label: 'SoundCloud' };
  if (name.includes('twitch')) return { icon: <FaTwitch className="text-purple-400 text-4xl" />, bg: 'bg-purple-900/50', label: 'Twitch' };
  if (name.includes('visual studio') || name.includes('code')) return { icon: <FaCode className="text-blue-400 text-4xl" />, bg: 'bg-blue-900/50', label: 'VS Code' };

  if (name.includes('bgmi') || name.includes('battlegrounds') || name.includes('pubg')) {
    return {
      icon: <FaGamepad className="text-yellow-400 text-4xl" />,
      bg: 'bg-yellow-900/50',
      label: 'BGMI / PUBG'
    };
  }

  if (activity.type === 0) {
    return {
      icon: <FaGamepad className="text-purple-400 text-4xl" />,
      bg: 'bg-purple-900/50',
      label: activity.name
    };
  }

  return {
    icon: <FaQuestionCircle className="text-white text-4xl" />,
    bg: 'bg-gray-800/50',
    label: activity.name
  };
};

const ActivityCard = ({ activity }) => {
  const [imageErrored, setImageErrored] = useState(false);
  const { icon, bg } = getIconAndColor(activity);

  const activityPrefix = ACTIVITY_TYPE_MAP[activity.type] || 'Using';
  const activityTitle = `${activityPrefix} ${activity.name}`;
  const imageUrl = !imageErrored ? getActivityImage(activity) : null;

  return (
    <div className={`p-3 rounded-lg ${bg} space-y-2 relative overflow-hidden`}>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={activity.name}
              width={64}
              height={64}
              className="rounded-md object-cover"
              unoptimized
              onError={() => setImageErrored(true)}
            />
          ) : (
            icon
          )}
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-sm truncate">{activityTitle}</p>
          {activity.details && !activity.details.includes('{{') && (
            <p className="text-xs text-gray-200 truncate">{activity.details}</p>
          )}
          {!activity.timestamps?.start && activity.state && (
            <p className="text-xs text-gray-400 truncate">{activity.state}</p>
          )}
        </div>
      </div>

      {activity.timestamps?.start && (
        <RealtimeProgressBar start={activity.timestamps.start} end={activity.timestamps.end} />
      )}

      {activity.timestamps?.start && (
        <p className="text-xs text-gray-400 font-mono pt-2 border-t border-white/10 text-center">
          <ElapsedTime start={activity.timestamps.start} />
        </p>
      )}
    </div>
  );
};

export default function DiscordPresence({ presence }) {
  if (!presence || !presence.discord_status) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm animate-pulse">
        Connecting to Discord...
      </div>
    );
  }

  const statusInfo = STATUS_MAP[presence.discord_status] || STATUS_MAP.offline;
  const mainActivity = presence.activities.find(a => a.type === 0 || a.name.toLowerCase().includes('spotify'));

  return (
    <div className="mt-4 pt-4 border-t border-gray-700">
      <div className="flex items-center mb-3">
        <span className={`w-3 h-3 rounded-full mr-2 flex-shrink-0 ${statusInfo.color}`}></span>
        <p className="text-sm font-semibold">{statusInfo.label}</p>
        {presence.custom_status && (
          <p className="text-sm text-gray-400 ml-2 truncate">
            | {presence.custom_status.emoji?.name} {presence.custom_status.text}
          </p>
        )}
      </div>
      {mainActivity ? (
        <ActivityCard activity={mainActivity} />
      ) : (
        <p className="text-xs text-gray-500">No current activity to show.</p>
      )}
    </div>
  );
}
