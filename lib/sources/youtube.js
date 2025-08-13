/**
 * YouTube integration for VEYNOVA Music Player
 */

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * Search YouTube for music tracks
 * @param {string} query - Search query
 * @param {number} limit - Maximum results to return
 * @returns {Promise<Array>} Array of track objects
 */
export async function searchYouTube(query, limit = 20) {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured');
    return [];
  }

  try {
    const url = `${YOUTUBE_API_BASE}/search?` +
      `part=snippet&type=video&videoCategoryId=10&` +
      `q=${encodeURIComponent(query)}&` +
      `maxResults=${limit}&` +
      `key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.items?.map(item => ({
      source: 'youtube',
      sid: item.id.videoId,
      title: cleanTitle(item.snippet.title),
      artist: item.snippet.channelTitle || 'Unknown Artist',
      thumbnailUrl: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      metadata: {
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
      },
    })) || [];

  } catch (error) {
    console.error('YouTube search error:', error);
    return [];
  }
}

/**
 * Get YouTube video details
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object>} Track object with details
 */
export async function getYouTubeTrackDetails(videoId) {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key not configured');
  }

  try {
    const url = `${YOUTUBE_API_BASE}/videos?` +
      `part=snippet,contentDetails&` +
      `id=${videoId}&` +
      `key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    const video = data.items?.[0];
    
    if (!video) {
      throw new Error('Video not found');
    }

    return {
      source: 'youtube',
      sid: video.id,
      title: cleanTitle(video.snippet.title),
      artist: video.snippet.channelTitle || 'Unknown Artist',
      thumbnailUrl: video.snippet.thumbnails?.medium?.url,
      duration: parseDuration(video.contentDetails.duration),
      url: `https://www.youtube.com/watch?v=${video.id}`,
      explicit: false, // YouTube doesn't provide explicit flag via API
      metadata: {
        publishedAt: video.snippet.publishedAt,
        description: video.snippet.description,
        tags: video.snippet.tags,
      },
    };

  } catch (error) {
    console.error('YouTube track details error:', error);
    throw error;
  }
}

/**
 * Resolve YouTube track for playback (placeholder - requires careful implementation)
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object>} Playback information
 */
export async function resolveYouTubePlayback(videoId) {
  // Note: Direct YouTube stream extraction requires careful legal compliance
  // This is a placeholder implementation
  
  try {
    // Option 1: Return external link (safest)
    return {
      kind: 'external',
      externalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      message: 'Opens in YouTube'
    };

    // Option 2: If using ytdl-core or play-dl (only if legally compliant)
    /*
    const ytdl = require('ytdl-core');
    if (ytdl.validateURL(`https://www.youtube.com/watch?v=${videoId}`)) {
      const info = await ytdl.getInfo(videoId);
      const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
      
      if (audioFormats.length > 0) {
        return {
          kind: 'direct',
          streamUrl: audioFormats[0].url,
          expires: Date.now() + 3600000, // 1 hour
        };
      }
    }
    */

  } catch (error) {
    console.error('YouTube playback resolution error:', error);
    throw new Error('Unable to resolve playback for this track');
  }
}

/**
 * Clean YouTube title (remove common suffixes like "Official Music Video")
 * @param {string} title - Raw title
 * @returns {string} Cleaned title
 */
function cleanTitle(title) {
  return title
    .replace(/\s*\(.*?Official.*?\)/gi, '')
    .replace(/\s*\[.*?Official.*?\]/gi, '')
    .replace(/\s*-\s*Official.*$/gi, '')
    .replace(/\s*\|.*$/gi, '')
    .trim();
}

/**
 * Parse ISO 8601 duration to seconds
 * @param {string} duration - ISO 8601 duration (e.g., "PT4M13S")
 * @returns {number} Duration in seconds
 */
function parseDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1]?.replace('H', '') || '0');
  const minutes = parseInt(match[2]?.replace('M', '') || '0');
  const seconds = parseInt(match[3]?.replace('S', '') || '0');

  return hours * 3600 + minutes * 60 + seconds;
}