/**
 * Source Badge Component
 * Shows music source with appropriate styling
 */

import { FaYoutube, FaSpotify, FaSoundcloud, FaRadio } from 'react-icons/fa';

const sourceConfig = {
  youtube: {
    name: 'YouTube',
    icon: FaYoutube,
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30'
  },
  ytmusic: {
    name: 'YT Music',
    icon: FaYoutube,
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30'
  },
  spotify: {
    name: 'Spotify',
    icon: FaSpotify,
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/30'
  },
  soundcloud: {
    name: 'SoundCloud',
    icon: FaSoundcloud,
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/30'
  },
  deezer: {
    name: 'Deezer',
    icon: () => <div className="w-3 h-3 bg-current rounded-full" />,
    bgColor: 'bg-pink-500/20',
    textColor: 'text-pink-400',
    borderColor: 'border-pink-500/30'
  },
  radio: {
    name: 'Radio',
    icon: FaRadio,
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30'
  }
};

export default function SourceBadge({ source, showIcon = true, showText = true, size = 'sm' }) {
  const config = sourceConfig[source] || sourceConfig.radio;
  const IconComponent = config.icon;

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span 
      className={`
        inline-flex items-center gap-1 rounded-full border font-medium
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${sizeClasses[size]}
      `}
    >
      {showIcon && <IconComponent className="flex-shrink-0" />}
      {showText && config.name}
    </span>
  );
}