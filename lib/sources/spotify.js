/**
 * Spotify integration for VEYNOVA Music Player
 * Handles Spotify searches with graceful fallbacks
 */

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

let accessToken = null;
let tokenExpires = 0;

/**
 * Get Spotify access token using client credentials flow
 * @returns {Promise<string>} Access token
 */
async function getSpotifyAccessToken() {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error('Spotify credentials not configured');
  }

  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpires) {
    return accessToken;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`Spotify auth error: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpires = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 minute early

    return accessToken;

  } catch (error) {
    console.error('Spotify token error:', error);
    throw error;
  }
}

/**
 * Search Spotify for music tracks
 * @param {string} query - Search query
 * @param {number} limit - Maximum results to return
 * @returns {Promise<Array>} Array of track objects
 */
export async function searchSpotify(query, limit = 20) {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    // Return empty array with info about missing credentials
    console.warn('Spotify credentials not provided - returning empty results');
    return [];
  }

  try {
    const token = await getSpotifyAccessToken();
    
    const url = `${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}&market=US`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, clear it
        accessToken = null;
        tokenExpires = 0;
      }
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.tracks?.items?.map(track => ({
      source: 'spotify',
      sid: track.id,
      title: track.name,
      artist: track.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
      album: track.album?.name,
      thumbnailUrl: track.album?.images?.[1]?.url || track.album?.images?.[0]?.url,
      duration: Math.floor(track.duration_ms / 1000),
      url: track.external_urls?.spotify,
      explicit: track.explicit,
      metadata: {
        isrc: track.external_ids?.isrc,
        popularity: track.popularity,
        previewUrl: track.preview_url,
        albumId: track.album?.id,
        artistIds: track.artists?.map(a => a.id),
        releaseDate: track.album?.release_date,
        trackNumber: track.track_number,
        discNumber: track.disc_number,
      },
    })) || [];

  } catch (error) {
    console.error('Spotify search error:', error);
    return [];
  }
}

/**
 * Get Spotify track details
 * @param {string} trackId - Spotify track ID
 * @returns {Promise<Object>} Track object with details
 */
export async function getSpotifyTrackDetails(trackId) {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error('Spotify credentials not configured');
  }

  try {
    const token = await getSpotifyAccessToken();
    
    const url = `${SPOTIFY_API_BASE}/tracks/${trackId}?market=US`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const track = await response.json();
    
    return {
      source: 'spotify',
      sid: track.id,
      title: track.name,
      artist: track.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
      album: track.album?.name,
      thumbnailUrl: track.album?.images?.[1]?.url || track.album?.images?.[0]?.url,
      duration: Math.floor(track.duration_ms / 1000),
      url: track.external_urls?.spotify,
      explicit: track.explicit,
      metadata: {
        isrc: track.external_ids?.isrc,
        popularity: track.popularity,
        previewUrl: track.preview_url,
        albumId: track.album?.id,
        artistIds: track.artists?.map(a => a.id),
        releaseDate: track.album?.release_date,
        trackNumber: track.track_number,
        discNumber: track.disc_number,
        audioFeatures: null, // Can be fetched separately if needed
      },
    };

  } catch (error) {
    console.error('Spotify track details error:', error);
    throw error;
  }
}

/**
 * Resolve Spotify track for playback
 * @param {string} trackId - Spotify track ID
 * @returns {Promise<Object>} Playback information
 */
export async function resolveSpotifyPlayback(trackId) {
  try {
    const track = await getSpotifyTrackDetails(trackId);
    
    // Check if preview is available
    if (track.metadata.previewUrl) {
      return {
        kind: 'preview',
        streamUrl: track.metadata.previewUrl,
        duration: 30,
        message: '30-second preview - Full track requires Spotify Premium & Web Playback SDK'
      };
    }

    // No preview available - redirect to Spotify
    return {
      kind: 'external',
      externalUrl: track.url,
      message: 'Full track available on Spotify - Premium subscription required for full playback'
    };

  } catch (error) {
    console.error('Spotify playback resolution error:', error);
    throw new Error('Unable to resolve playback for this track');
  }
}

/**
 * Get Spotify album tracks
 * @param {string} albumId - Spotify album ID
 * @returns {Promise<Array>} Array of track objects
 */
export async function getSpotifyAlbumTracks(albumId) {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error('Spotify credentials not configured');
  }

  try {
    const token = await getSpotifyAccessToken();
    
    const url = `${SPOTIFY_API_BASE}/albums/${albumId}/tracks?market=US&limit=50`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.items?.map(track => ({
      source: 'spotify',
      sid: track.id,
      title: track.name,
      artist: track.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
      duration: Math.floor(track.duration_ms / 1000),
      url: track.external_urls?.spotify,
      explicit: track.explicit,
      metadata: {
        trackNumber: track.track_number,
        discNumber: track.disc_number,
        previewUrl: track.preview_url,
      },
    })) || [];

  } catch (error) {
    console.error('Spotify album tracks error:', error);
    return [];
  }
}

/**
 * Get Spotify artist's top tracks
 * @param {string} artistId - Spotify artist ID
 * @param {number} limit - Maximum results (max 10 for Spotify)
 * @returns {Promise<Array>} Array of track objects
 */
export async function getSpotifyArtistTopTracks(artistId, limit = 10) {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error('Spotify credentials not configured');
  }

  try {
    const token = await getSpotifyAccessToken();
    
    const url = `${SPOTIFY_API_BASE}/artists/${artistId}/top-tracks?market=US`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.tracks?.slice(0, limit).map(track => ({
      source: 'spotify',
      sid: track.id,
      title: track.name,
      artist: track.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
      album: track.album?.name,
      thumbnailUrl: track.album?.images?.[1]?.url,
      duration: Math.floor(track.duration_ms / 1000),
      url: track.external_urls?.spotify,
      explicit: track.explicit,
      metadata: {
        popularity: track.popularity,
        previewUrl: track.preview_url,
      },
    })) || [];

  } catch (error) {
    console.error('Spotify artist top tracks error:', error);
    return [];
  }
}