/**
 * Deezer integration for VEYNOVA Music Player
 */

const DEEZER_APP_ID = process.env.DEEZER_APP_ID;
const DEEZER_APP_SECRET = process.env.DEEZER_APP_SECRET;
const DEEZER_API_BASE = 'https://api.deezer.com';

/**
 * Search Deezer for music tracks
 * @param {string} query - Search query
 * @param {number} limit - Maximum results to return
 * @returns {Promise<Array>} Array of track objects
 */
export async function searchDeezer(query, limit = 20) {
  try {
    const url = `${DEEZER_API_BASE}/search?q=${encodeURIComponent(query)}&limit=${limit}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.data?.map(track => ({
      source: 'deezer',
      sid: track.id.toString(),
      title: track.title,
      artist: track.artist?.name || 'Unknown Artist',
      album: track.album?.title,
      thumbnailUrl: track.album?.cover_medium || track.album?.cover_small,
      duration: track.duration,
      url: track.link,
      explicit: track.explicit_lyrics,
      metadata: {
        rank: track.rank,
        previewUrl: track.preview,
        albumId: track.album?.id,
        artistId: track.artist?.id,
        releaseDate: track.album?.release_date,
      },
    })) || [];

  } catch (error) {
    console.error('Deezer search error:', error);
    return [];
  }
}

/**
 * Get Deezer track details
 * @param {string} trackId - Deezer track ID
 * @returns {Promise<Object>} Track object with details
 */
export async function getDeezerTrackDetails(trackId) {
  try {
    const url = `${DEEZER_API_BASE}/track/${trackId}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }

    const track = await response.json();
    
    return {
      source: 'deezer',
      sid: track.id.toString(),
      title: track.title,
      artist: track.artist?.name || 'Unknown Artist',
      album: track.album?.title,
      thumbnailUrl: track.album?.cover_medium || track.album?.cover_small,
      duration: track.duration,
      url: track.link,
      explicit: track.explicit_lyrics,
      metadata: {
        rank: track.rank,
        previewUrl: track.preview,
        bpm: track.bpm,
        gain: track.gain,
        albumId: track.album?.id,
        artistId: track.artist?.id,
        releaseDate: track.release_date,
        isrc: track.isrc,
      },
    };

  } catch (error) {
    console.error('Deezer track details error:', error);
    throw error;
  }
}

/**
 * Resolve Deezer track for playback
 * @param {string} trackId - Deezer track ID
 * @returns {Promise<Object>} Playback information
 */
export async function resolveDeezerPlayback(trackId) {
  try {
    const track = await getDeezerTrackDetails(trackId);
    
    // Deezer provides 30-second previews
    if (track.metadata.previewUrl) {
      return {
        kind: 'preview',
        streamUrl: track.metadata.previewUrl,
        duration: 30,
        message: '30-second preview - Full track available on Deezer'
      };
    }

    // No preview - redirect to Deezer
    return {
      kind: 'external',
      externalUrl: track.url,
      message: 'Full track available on Deezer'
    };

  } catch (error) {
    console.error('Deezer playback resolution error:', error);
    throw new Error('Unable to resolve playback for this track');
  }
}

/**
 * Get Deezer album tracks
 * @param {string} albumId - Deezer album ID
 * @returns {Promise<Array>} Array of track objects
 */
export async function getDeezerAlbumTracks(albumId) {
  try {
    const url = `${DEEZER_API_BASE}/album/${albumId}/tracks`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.data?.map(track => ({
      source: 'deezer',
      sid: track.id.toString(),
      title: track.title,
      artist: track.artist?.name || 'Unknown Artist',
      duration: track.duration,
      url: track.link,
      explicit: track.explicit_lyrics,
      metadata: {
        trackPosition: track.track_position,
        diskNumber: track.disk_number,
        rank: track.rank,
        previewUrl: track.preview,
      },
    })) || [];

  } catch (error) {
    console.error('Deezer album tracks error:', error);
    return [];
  }
}

/**
 * Get Deezer artist's top tracks
 * @param {string} artistId - Deezer artist ID
 * @param {number} limit - Maximum results
 * @returns {Promise<Array>} Array of track objects
 */
export async function getDeezerArtistTopTracks(artistId, limit = 10) {
  try {
    const url = `${DEEZER_API_BASE}/artist/${artistId}/top?limit=${limit}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.data?.map(track => ({
      source: 'deezer',
      sid: track.id.toString(),
      title: track.title,
      artist: track.artist?.name || 'Unknown Artist',
      album: track.album?.title,
      thumbnailUrl: track.album?.cover_medium,
      duration: track.duration,
      url: track.link,
      explicit: track.explicit_lyrics,
      metadata: {
        rank: track.rank,
        previewUrl: track.preview,
      },
    })) || [];

  } catch (error) {
    console.error('Deezer artist top tracks error:', error);
    return [];
  }
}

/**
 * Get Deezer charts
 * @param {number} limit - Maximum results
 * @returns {Promise<Array>} Array of popular track objects
 */
export async function getDeezerCharts(limit = 50) {
  try {
    const url = `${DEEZER_API_BASE}/chart/0/tracks?limit=${limit}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Deezer API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.data?.map((track, index) => ({
      source: 'deezer',
      sid: track.id.toString(),
      title: track.title,
      artist: track.artist?.name || 'Unknown Artist',
      album: track.album?.title,
      thumbnailUrl: track.album?.cover_medium,
      duration: track.duration,
      url: track.link,
      explicit: track.explicit_lyrics,
      metadata: {
        chartPosition: index + 1,
        rank: track.rank,
        previewUrl: track.preview,
      },
    })) || [];

  } catch (error) {
    console.error('Deezer charts error:', error);
    return [];
  }
}