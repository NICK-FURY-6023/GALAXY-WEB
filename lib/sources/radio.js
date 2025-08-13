/**
 * Radio stations integration for VEYNOVA Music Player
 */

/**
 * Default radio stations (will be loaded from JSON file)
 */
const defaultStations = [
  {
    name: "Lofi Hip Hop Radio",
    url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    genre: "Lo-Fi",
    country: "International",
    description: "24/7 chill beats to relax/study to",
  },
  {
    name: "Jazz FM",
    url: "https://jazz-icy.ice.infomaniak.ch/jazz-icy.mp3",
    genre: "Jazz",
    country: "International",
    bitrate: 128,
  },
  {
    name: "Chillhop Radio",
    url: "https://streams.fluxfm.de/Chillhop/mp3-320/streams.fluxfm.de/",
    genre: "Chillhop",
    country: "International",
    bitrate: 320,
  },
  {
    name: "Electronic Dance Music",
    url: "https://streams.ilovemusic.de/iloveradio104.mp3",
    genre: "Electronic",
    country: "Germany",
    bitrate: 128,
  },
  {
    name: "Classic Rock",
    url: "https://streams.radiobob.de/bob-classicrock/mp3-192/streams.radiobob.de/",
    genre: "Rock",
    country: "Germany",
    bitrate: 192,
  },
];

/**
 * Load radio stations from JSON file or database
 * @returns {Promise<Array>} Array of radio station objects
 */
export async function getRadioStations() {
  try {
    // Try to load from public JSON file first
    if (typeof window !== 'undefined') {
      const response = await fetch('/radio-stations.json');
      if (response.ok) {
        const stations = await response.json();
        return stations;
      }
    }
    
    // Fallback to default stations
    return defaultStations;
    
  } catch (error) {
    console.error('Error loading radio stations:', error);
    return defaultStations;
  }
}

/**
 * Search radio stations by genre or name
 * @param {string} query - Search query
 * @param {Array} stations - Array of stations to search
 * @returns {Array} Filtered stations
 */
export function searchRadioStations(query, stations) {
  if (!query.trim()) return stations;
  
  const searchTerm = query.toLowerCase();
  
  return stations.filter(station => 
    station.name.toLowerCase().includes(searchTerm) ||
    station.genre.toLowerCase().includes(searchTerm) ||
    station.country.toLowerCase().includes(searchTerm) ||
    (station.description && station.description.toLowerCase().includes(searchTerm))
  );
}

/**
 * Get radio stations by genre
 * @param {string} genre - Genre to filter by
 * @param {Array} stations - Array of stations
 * @returns {Array} Stations of the specified genre
 */
export function getRadioStationsByGenre(genre, stations) {
  return stations.filter(station => 
    station.genre.toLowerCase() === genre.toLowerCase()
  );
}

/**
 * Validate radio station URL
 * @param {string} url - Radio station URL
 * @returns {Promise<boolean>} True if URL is accessible
 */
export async function validateRadioUrl(url) {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      timeout: 5000,
    });
    return response.ok;
  } catch (error) {
    console.error('Radio URL validation error:', error);
    return false;
  }
}

/**
 * Convert radio station to track format
 * @param {Object} station - Radio station object
 * @returns {Object} Track-formatted object
 */
export function radioToTrack(station) {
  return {
    source: 'radio',
    sid: btoa(station.url), // Base64 encode URL as ID
    title: station.name,
    artist: station.genre,
    album: station.country,
    thumbnailUrl: station.thumbnailUrl || '/galaxy-logo.png',
    url: station.url,
    streamUrl: station.url,
    metadata: {
      genre: station.genre,
      country: station.country,
      bitrate: station.bitrate,
      description: station.description,
      isLive: true,
    },
  };
}

/**
 * Get popular genres from stations
 * @param {Array} stations - Array of stations
 * @returns {Array} Array of unique genres
 */
export function getRadioGenres(stations) {
  const genres = [...new Set(stations.map(s => s.genre))];
  return genres.sort();
}

/**
 * Get stations by country
 * @param {string} country - Country to filter by
 * @param {Array} stations - Array of stations
 * @returns {Array} Stations from the specified country
 */
export function getRadioStationsByCountry(country, stations) {
  return stations.filter(station => 
    station.country.toLowerCase() === country.toLowerCase()
  );
}

/**
 * Resolve radio playback (always direct stream)
 * @param {string} stationUrl - Radio station URL
 * @returns {Promise<Object>} Playback information
 */
export async function resolveRadioPlayback(stationUrl) {
  try {
    // Decode base64 URL
    const url = atob(stationUrl);
    
    // Validate URL is accessible
    const isValid = await validateRadioUrl(url);
    
    if (!isValid) {
      throw new Error('Radio station is not accessible');
    }
    
    return {
      kind: 'direct',
      streamUrl: url,
      isLive: true,
      message: 'Live radio stream'
    };
    
  } catch (error) {
    console.error('Radio playback resolution error:', error);
    throw new Error('Unable to resolve radio stream');
  }
}