/**
 * Spotify integration for VEYNOVA Music Player
 */

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// In-memory token cache (use Redis in production)
let spotifyToken = null;
let tokenExpiry = 0;

/**
 * Get Spotify access token using client credentials
 * @returns {Promise<string>} Access token
 */
async function getSpotifyAccessToken() {
  if (spotifyToken && Date.now() < tokenExpiry) {
    return spotifyToken;
  }

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error('Spotify client credentials not configured');
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`Spotify auth error: ${response.status}`);
    }

    const data = await response.json();
    spotifyToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // Refresh 1 minute early

    return spotifyToken;

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
  try {
    const token = await getSpotifyAccessToken();
    
    const url = `${SPOTIFY_API_BASE}/search?` +
      `q=${encodeURIComponent(query)}&` +
      `type=track&` +
      `limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
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
      duration: track.duration_ms ? Math.floor(track.duration_ms / 1000) : undefined,
      url: track.external_urls?.spotify,
      explicit: track.explicit,
      metadata: {
        popularity: track.popularity,
        previewUrl: track.preview_url,
        albumId: track.album?.id,
        artistIds: track.artists?.map(a => a.id),
        isrc: track.external_ids?.isrc,
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
  try {
    const token = await getSpotifyAccessToken();
    
    const url = `${SPOTIFY_API_BASE}/tracks/${trackId}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
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
      duration: track.duration_ms ? Math.floor(track.duration_ms / 1000) : undefined,
      url: track.external_urls?.spotify,
      explicit: track.explicit,
      metadata: {
        popularity: track.popularity,
        previewUrl: track.preview_url,
        albumId: track.album?.id,
        artistIds: track.artists?.map(a => a.id),
        isrc: track.external_ids?.isrc,
        releaseDate: track.album?.release_date,
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
    
    // Spotify requires Web Playbook SDK for full tracks
    // Preview is available for 30 seconds
    if (track.metadata.previewUrl) {
      return {
        kind: 'preview',
        streamUrl: track.metadata.previewUrl,
        duration: 30,
        message: '30-second preview - Full playback requires Spotify Premium & Web Playbook SDK'
      };
    }

    // No preview available - redirect to Spotify
    return {
      kind: 'external',
      externalUrl: track.url,
      message: 'Full track available on Spotify'
    };

  } catch (error) {
    console.error('Spotify playback resolution error:', error);
    throw new Error('Unable to resolve playback for this track');
  }
}

/**
 * Get Spotify user's playlists (requires user OAuth token)
 * @param {string} userToken - User's Spotify access token
 * @returns {Promise<Array>} Array of playlist objects
 */
export async function getSpotifyUserPlaylists(userToken) {
  try {
    const url = `${SPOTIFY_API_BASE}/me/playlists`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.items?.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      imageUrl: playlist.images?.[0]?.url,
      tracksCount: playlist.tracks?.total,
      public: playlist.public,
      url: playlist.external_urls?.spotify,
    })) || [];

  } catch (error) {
    console.error('Spotify playlists error:', error);
    throw error;
  }
}

/**
 * Get featured playlists (public)
 * @param {number} limit - Maximum results
 * @returns {Promise<Array>} Array of featured playlists
 */
export async function getSpotifyFeaturedPlaylists(limit = 20) {
  try {
    const token = await getSpotifyAccessToken();
    
    const url = `${SPOTIFY_API_BASE}/browse/featured-playlists?limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.playlists?.items?.map(playlist => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      imageUrl: playlist.images?.[0]?.url,
      tracksCount: playlist.tracks?.total,
      url: playlist.external_urls?.spotify,
    })) || [];

  } catch (error) {
    console.error('Spotify featured playlists error:', error);
    return [];
  }
}