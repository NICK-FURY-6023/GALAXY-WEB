/**
 * Music search endpoint
 * Searches across multiple music sources
 */

import { rateLimit } from '../../../lib/rateLimit.js';
import { handleApiError, ValidationError } from '../../../lib/errors.js';
import { searchYouTube } from '../../../lib/sources/youtube.js';
import { searchSoundCloud } from '../../../lib/sources/soundcloud.js';
import { searchSpotify } from '../../../lib/sources/spotify.js';
import { searchDeezer } from '../../../lib/sources/deezer.js';
import { getRadioStations, searchRadioStations, radioToTrack } from '../../../lib/sources/radio.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting
    rateLimit(`search_${req.ip}`, { maxTokens: 30, refillRate: 0.5 });

    const { q: query, sources = 'yt,sc,sp,dz,radio', limit = 20 } = req.query;

    if (!query?.trim()) {
      throw new ValidationError('Search query is required', 'q');
    }

    const searchLimit = Math.min(parseInt(limit) || 20, 50);
    const sourcesToSearch = sources.split(',').map(s => s.trim().toLowerCase());

    const results = {};

    // Search each enabled source concurrently
    const searchPromises = [];

    if (sourcesToSearch.includes('yt') || sourcesToSearch.includes('youtube')) {
      searchPromises.push(
        searchYouTube(query, searchLimit)
          .then(tracks => ({ source: 'youtube', tracks }))
          .catch(err => ({ source: 'youtube', tracks: [], error: err.message }))
      );
    }

    if (sourcesToSearch.includes('sc') || sourcesToSearch.includes('soundcloud')) {
      searchPromises.push(
        searchSoundCloud(query, searchLimit)
          .then(tracks => ({ source: 'soundcloud', tracks }))
          .catch(err => ({ source: 'soundcloud', tracks: [], error: err.message }))
      );
    }

    if (sourcesToSearch.includes('sp') || sourcesToSearch.includes('spotify')) {
      searchPromises.push(
        searchSpotify(query, searchLimit)
          .then(tracks => ({ source: 'spotify', tracks }))
          .catch(err => ({ source: 'spotify', tracks: [], error: err.message }))
      );
    }

    if (sourcesToSearch.includes('dz') || sourcesToSearch.includes('deezer')) {
      searchPromises.push(
        searchDeezer(query, searchLimit)
          .then(tracks => ({ source: 'deezer', tracks }))
          .catch(err => ({ source: 'deezer', tracks: [], error: err.message }))
      );
    }

    if (sourcesToSearch.includes('radio')) {
      searchPromises.push(
        getRadioStations()
          .then(stations => searchRadioStations(query, stations))
          .then(stations => stations.map(radioToTrack).slice(0, searchLimit))
          .then(tracks => ({ source: 'radio', tracks }))
          .catch(err => ({ source: 'radio', tracks: [], error: err.message }))
      );
    }

    // Wait for all searches to complete
    const searchResults = await Promise.all(searchPromises);

    // Organize results by source
    searchResults.forEach(({ source, tracks, error }) => {
      results[source] = tracks;
      if (error) {
        console.warn(`${source} search error:`, error);
      }
    });

    res.status(200).json({
      query,
      results,
      totalResults: Object.values(results).reduce((sum, tracks) => sum + tracks.length, 0),
    });

  } catch (error) {
    return handleApiError(error, res);
  }
}