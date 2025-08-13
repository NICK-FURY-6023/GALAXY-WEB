/**
 * SoundCloud integration for VEYNOVA Music Player
 */

const SOUNDCLOUD_CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID;
const SOUNDCLOUD_API_BASE = 'https://api.soundcloud.com';

/**
 * Search SoundCloud for music tracks
 * @param {string} query - Search query
 * @param {number} limit - Maximum results to return
 * @returns {Promise<Array>} Array of track objects
 */
export async function searchSoundCloud(query, limit = 20) {
  if (!SOUNDCLOUD_CLIENT_ID) {
    console.warn('SoundCloud client ID not configured');
    return [];
  }

  try {
    const url = `${SOUNDCLOUD_API_BASE}/tracks?` +
      `q=${encodeURIComponent(query)}&` +
      `limit=${limit}&` +
      `client_id=${SOUNDCLOUD_CLIENT_ID}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`SoundCloud API error: ${response.status}`);
    }

    const tracks = await response.json();
    
    return tracks.map(track => ({
      source: 'soundcloud',
      sid: track.id.toString(),
      title: track.title,
      artist: track.user?.username || 'Unknown Artist',
      album: track.album_title,
      thumbnailUrl: track.artwork_url?.replace('-large', '-t300x300') || track.user?.avatar_url,
      duration: track.duration ? Math.floor(track.duration / 1000) : undefined,
      url: track.permalink_url,
      explicit: false, // SoundCloud doesn't provide explicit flag
      metadata: {
        genre: track.genre,
        description: track.description,
        playbackCount: track.playback_count,
        likesCount: track.likes_count,
        createdAt: track.created_at,
      },
    }));

  } catch (error) {
    console.error('SoundCloud search error:', error);
    return [];
  }
}

/**
 * Get SoundCloud track details
 * @param {string} trackId - SoundCloud track ID
 * @returns {Promise<Object>} Track object with details
 */
export async function getSoundCloudTrackDetails(trackId) {
  if (!SOUNDCLOUD_CLIENT_ID) {
    throw new Error('SoundCloud client ID not configured');
  }

  try {
    const url = `${SOUNDCLOUD_API_BASE}/tracks/${trackId}?client_id=${SOUNDCLOUD_CLIENT_ID}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`SoundCloud API error: ${response.status}`);
    }

    const track = await response.json();
    
    return {
      source: 'soundcloud',
      sid: track.id.toString(),
      title: track.title,
      artist: track.user?.username || 'Unknown Artist',
      album: track.album_title,
      thumbnailUrl: track.artwork_url?.replace('-large', '-t300x300') || track.user?.avatar_url,
      duration: track.duration ? Math.floor(track.duration / 1000) : undefined,
      url: track.permalink_url,
      explicit: false,
      metadata: {
        genre: track.genre,
        description: track.description,
        playbackCount: track.playback_count,
        likesCount: track.likes_count,
        createdAt: track.created_at,
        downloadable: track.downloadable,
        streamable: track.streamable,
      },
    };

  } catch (error) {
    console.error('SoundCloud track details error:', error);
    throw error;
  }
}

/**
 * Resolve SoundCloud track for playback
 * @param {string} trackId - SoundCloud track ID
 * @returns {Promise<Object>} Playback information
 */
export async function resolveSoundCloudPlayback(trackId) {
  if (!SOUNDCLOUD_CLIENT_ID) {
    throw new Error('SoundCloud client ID not configured');
  }

  try {
    // First get track details to check if streamable
    const track = await getSoundCloudTrackDetails(trackId);
    
    if (!track.metadata.streamable) {
      return {
        kind: 'external',
        externalUrl: track.url,
        message: 'Track not streamable - opens in SoundCloud'
      };
    }

    // Try to get stream URL
    const streamUrl = `${SOUNDCLOUD_API_BASE}/tracks/${trackId}/stream?client_id=${SOUNDCLOUD_CLIENT_ID}`;
    
    // Test if stream URL is accessible
    const streamResponse = await fetch(streamUrl, { method: 'HEAD' });
    
    if (streamResponse.ok) {
      return {
        kind: 'direct',
        streamUrl: streamUrl,
        expires: Date.now() + 3600000, // 1 hour
      };
    } else {
      return {
        kind: 'external',
        externalUrl: track.url,
        message: 'Stream not available - opens in SoundCloud'
      };
    }

  } catch (error) {
    console.error('SoundCloud playback resolution error:', error);
    throw new Error('Unable to resolve playback for this track');
  }
}

/**
 * Get SoundCloud user's tracks (for artist exploration)
 * @param {string} username - SoundCloud username
 * @param {number} limit - Maximum results
 * @returns {Promise<Array>} Array of track objects
 */
export async function getSoundCloudUserTracks(username, limit = 10) {
  if (!SOUNDCLOUD_CLIENT_ID) {
    return [];
  }

  try {
    // First resolve username to user ID
    const userUrl = `${SOUNDCLOUD_API_BASE}/resolve?url=https://soundcloud.com/${username}&client_id=${SOUNDCLOUD_CLIENT_ID}`;
    const userResponse = await fetch(userUrl);
    
    if (!userResponse.ok) return [];
    
    const user = await userResponse.json();
    
    // Get user's tracks
    const tracksUrl = `${SOUNDCLOUD_API_BASE}/users/${user.id}/tracks?limit=${limit}&client_id=${SOUNDCLOUD_CLIENT_ID}`;
    const tracksResponse = await fetch(tracksUrl);
    
    if (!tracksResponse.ok) return [];
    
    const tracks = await tracksResponse.json();
    
    return tracks.map(track => ({
      source: 'soundcloud',
      sid: track.id.toString(),
      title: track.title,
      artist: track.user?.username || username,
      thumbnailUrl: track.artwork_url?.replace('-large', '-t300x300'),
      duration: track.duration ? Math.floor(track.duration / 1000) : undefined,
      url: track.permalink_url,
    }));

  } catch (error) {
    console.error('SoundCloud user tracks error:', error);
    return [];
  }
}