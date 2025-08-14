/**
 * SoundCloud integration for VEYNOVA Music Player
 * Handles SoundCloud searches with graceful fallbacks
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
    // Return empty array with info about missing client ID
    console.warn('SoundCloud client ID not provided - returning empty results');
    return [];
  }

  try {
    const url = `${SOUNDCLOUD_API_BASE}/tracks?q=${encodeURIComponent(query)}&limit=${limit}&client_id=${SOUNDCLOUD_CLIENT_ID}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('SoundCloud client ID is invalid');
        return [];
      }
      throw new Error(`SoundCloud API error: ${response.status}`);
    }

    const tracks = await response.json();
    
    return tracks?.map(track => ({
      source: 'soundcloud',
      sid: track.id.toString(),
      title: track.title,
      artist: track.user?.username || 'Unknown Artist',
      album: null,
      thumbnailUrl: track.artwork_url ? track.artwork_url.replace('large', 't300x300') : null,
      duration: track.duration ? Math.floor(track.duration / 1000) : null,
      url: track.permalink_url,
      explicit: false, // SoundCloud doesn't have explicit flags in API
      metadata: {
        waveformUrl: track.waveform_url,
        streamable: track.streamable,
        downloadable: track.downloadable,
        playbackCount: track.playback_count,
        favoritingsCount: track.favoritings_count,
        commentCount: track.comment_count,
        createdAt: track.created_at,
        genre: track.genre,
        tagList: track.tag_list,
        description: track.description,
        userId: track.user?.id,
      },
    })) || [];

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
      album: null,
      thumbnailUrl: track.artwork_url ? track.artwork_url.replace('large', 't300x300') : null,
      duration: track.duration ? Math.floor(track.duration / 1000) : null,
      url: track.permalink_url,
      explicit: false,
      metadata: {
        waveformUrl: track.waveform_url,
        streamable: track.streamable,
        downloadable: track.downloadable,
        playbackCount: track.playback_count,
        favoritingsCount: track.favoritings_count,
        commentCount: track.comment_count,
        createdAt: track.created_at,
        genre: track.genre,
        tagList: track.tag_list,
        description: track.description,
        bpm: track.bpm,
        keySignature: track.key_signature,
        userId: track.user?.id,
        userAvatarUrl: track.user?.avatar_url,
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
  try {
    const track = await getSoundCloudTrackDetails(trackId);
    
    // Check if track is streamable
    if (!track.metadata.streamable) {
      return {
        kind: 'external',
        externalUrl: track.url,
        message: 'Track is not streamable - opens in SoundCloud'
      };
    }

    // SoundCloud requires special streaming setup and authentication
    // For now, redirect to SoundCloud for playback
    return {
      kind: 'external',
      externalUrl: track.url,
      message: 'Opens in SoundCloud - Direct streaming requires SoundCloud Pro API access'
    };

  } catch (error) {
    console.error('SoundCloud playback resolution error:', error);
    throw new Error('Unable to resolve playback for this track');
  }
}

/**
 * Get SoundCloud user's tracks
 * @param {string} userId - SoundCloud user ID
 * @param {number} limit - Maximum results
 * @returns {Promise<Array>} Array of track objects
 */
export async function getSoundCloudUserTracks(userId, limit = 20) {
  if (!SOUNDCLOUD_CLIENT_ID) {
    throw new Error('SoundCloud client ID not configured');
  }

  try {
    const url = `${SOUNDCLOUD_API_BASE}/users/${userId}/tracks?limit=${limit}&client_id=${SOUNDCLOUD_CLIENT_ID}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`SoundCloud API error: ${response.status}`);
    }

    const tracks = await response.json();
    
    return tracks?.map(track => ({
      source: 'soundcloud',
      sid: track.id.toString(),
      title: track.title,
      artist: track.user?.username || 'Unknown Artist',
      album: null,
      thumbnailUrl: track.artwork_url ? track.artwork_url.replace('large', 't300x300') : null,
      duration: track.duration ? Math.floor(track.duration / 1000) : null,
      url: track.permalink_url,
      explicit: false,
      metadata: {
        playbackCount: track.playback_count,
        favoritingsCount: track.favoritings_count,
        createdAt: track.created_at,
        genre: track.genre,
      },
    })) || [];

  } catch (error) {
    console.error('SoundCloud user tracks error:', error);
    return [];
  }
}

/**
 * Get SoundCloud playlist tracks
 * @param {string} playlistId - SoundCloud playlist ID
 * @returns {Promise<Array>} Array of track objects
 */
export async function getSoundCloudPlaylistTracks(playlistId) {
  if (!SOUNDCLOUD_CLIENT_ID) {
    throw new Error('SoundCloud client ID not configured');
  }

  try {
    const url = `${SOUNDCLOUD_API_BASE}/playlists/${playlistId}?client_id=${SOUNDCLOUD_CLIENT_ID}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`SoundCloud API error: ${response.status}`);
    }

    const playlist = await response.json();
    
    return playlist.tracks?.map(track => ({
      source: 'soundcloud',
      sid: track.id.toString(),
      title: track.title,
      artist: track.user?.username || 'Unknown Artist',
      album: null,
      thumbnailUrl: track.artwork_url ? track.artwork_url.replace('large', 't300x300') : null,
      duration: track.duration ? Math.floor(track.duration / 1000) : null,
      url: track.permalink_url,
      explicit: false,
      metadata: {
        playbackCount: track.playback_count,
        genre: track.genre,
      },
    })) || [];

  } catch (error) {
    console.error('SoundCloud playlist tracks error:', error);
    return [];
  }
}