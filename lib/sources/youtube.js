/**
 * YouTube integration for VEYNOVA Music Player
 * Handles YouTube and YouTube Music searches with graceful fallbacks
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
    // Return empty array with info about missing key
    console.warn('YouTube API key not provided - returning empty results');
    return [];
  }

  try {
    const searchUrl = `${YOUTUBE_API_BASE}/search?part=snippet&type=video&videoCategoryId=10&maxResults=${limit}&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      if (response.status === 403) {
        console.error('YouTube API quota exceeded or invalid key');
        return [];
      }
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Get video details for duration
    const videoIds = data.items?.map(item => item.id.videoId).join(',');
    
    if (!videoIds) {
      return [];
    }

    const detailsUrl = `${YOUTUBE_API_BASE}/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = detailsResponse.ok ? await detailsResponse.json() : null;

    return data.items?.map((item, index) => {
      const details = detailsData?.items?.[index];
      const duration = details ? parseDuration(details.contentDetails.duration) : null;
      
      return {
        source: 'youtube',
        sid: item.id.videoId,
        title: cleanTitle(item.snippet.title),
        artist: item.snippet.channelTitle,
        album: null,
        thumbnailUrl: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
        duration: duration,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        explicit: false,
        metadata: {
          description: item.snippet.description,
          publishedAt: item.snippet.publishedAt,
          viewCount: details?.statistics?.viewCount,
          channelId: item.snippet.channelId,
        },
      };
    }) || [];

  } catch (error) {
    console.error('YouTube search error:', error);
    return [];
  }
}

/**
 * Get YouTube track details
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object>} Track object with details
 */
export async function getYouTubeTrackDetails(videoId) {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key not configured');
  }

  try {
    const url = `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    const video = data.items?.[0];
    
    if (!video) {
      throw new Error('Video not found');
    }

    const duration = parseDuration(video.contentDetails.duration);
    
    return {
      source: 'youtube',
      sid: video.id,
      title: cleanTitle(video.snippet.title),
      artist: video.snippet.channelTitle,
      album: null,
      thumbnailUrl: video.snippet.thumbnails?.medium?.url,
      duration: duration,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      explicit: false,
      metadata: {
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        viewCount: video.statistics?.viewCount,
        likeCount: video.statistics?.likeCount,
        channelId: video.snippet.channelId,
      },
    };

  } catch (error) {
    console.error('YouTube track details error:', error);
    throw error;
  }
}

/**
 * Resolve YouTube track for playback
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object>} Playback information
 */
export async function resolveYouTubePlayback(videoId) {
  try {
    // YouTube tracks cannot be directly streamed due to terms of service
    // We redirect to YouTube for playback
    return {
      kind: 'external',
      externalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      message: 'Opens in YouTube - Direct streaming not available due to YouTube Terms of Service'
    };

  } catch (error) {
    console.error('YouTube playback resolution error:', error);
    throw new Error('Unable to resolve playback for this track');
  }
}

/**
 * Clean YouTube video title (remove common patterns)
 * @param {string} title - Raw title
 * @returns {string} Cleaned title
 */
function cleanTitle(title) {
  return title
    .replace(/\(Official\s*(Music\s*)?Video\)/gi, '')
    .replace(/\(Official\s*Audio\)/gi, '')
    .replace(/\(Lyric\s*Video\)/gi, '')
    .replace(/\[Official\s*(Music\s*)?Video\]/gi, '')
    .replace(/\[Official\s*Audio\]/gi, '')
    .replace(/\[Lyric\s*Video\]/gi, '')
    .replace(/\s*-\s*YouTube$/, '')
    .replace(/\s*\|\s*YouTube$/, '')
    .trim();
}

/**
 * Parse ISO 8601 duration to seconds
 * @param {string} isoDuration - ISO 8601 duration (PT4M20S)
 * @returns {number} Duration in seconds
 */
function parseDuration(isoDuration) {
  if (!isoDuration) return null;
  
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Get trending music videos
 * @param {number} limit - Maximum results
 * @returns {Promise<Array>} Array of trending track objects
 */
export async function getYouTubeTrending(limit = 50) {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not provided - returning empty trending results');
    return [];
  }

  try {
    const url = `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails&chart=mostPopular&videoCategoryId=10&maxResults=${limit}&regionCode=US&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.items?.map(video => {
      const duration = parseDuration(video.contentDetails.duration);
      
      return {
        source: 'youtube',
        sid: video.id,
        title: cleanTitle(video.snippet.title),
        artist: video.snippet.channelTitle,
        album: null,
        thumbnailUrl: video.snippet.thumbnails?.medium?.url,
        duration: duration,
        url: `https://www.youtube.com/watch?v=${video.id}`,
        explicit: false,
        metadata: {
          trending: true,
          publishedAt: video.snippet.publishedAt,
          channelId: video.snippet.channelId,
        },
      };
    }) || [];

  } catch (error) {
    console.error('YouTube trending error:', error);
    return [];
  }
}