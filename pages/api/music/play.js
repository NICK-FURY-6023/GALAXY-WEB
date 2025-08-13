/**
 * Music playback resolution endpoint
 */

import connectDB from '../../../lib/db.js';
import Track from '../../../models/Track.js';
import { rateLimit } from '../../../lib/rateLimit.js';
import { handleApiError, ValidationError } from '../../../lib/errors.js';
import { resolveYouTubePlayback } from '../../../lib/sources/youtube.js';
import { resolveSoundCloudPlayback } from '../../../lib/sources/soundcloud.js';
import { resolveSpotifyPlayback } from '../../../lib/sources/spotify.js';
import { resolveDeezerPlayback } from '../../../lib/sources/deezer.js';
import { resolveRadioPlayback } from '../../../lib/sources/radio.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    // Rate limiting
    rateLimit(`play_${req.ip}`, { maxTokens: 60, refillRate: 1 });

    const { source, sid } = req.body;

    if (!source || !sid) {
      throw new ValidationError('Source and sid are required');
    }

    // Find or create track in database
    let track = await Track.findOne({ source, sid });
    
    if (!track) {
      // We need track details to create it, but for now return error
      throw new ValidationError('Track not found. Please search for the track first.');
    }

    // Resolve playback based on source
    let playable;
    
    try {
      switch (source) {
        case 'youtube':
        case 'ytmusic':
          playable = await resolveYouTubePlayback(sid);
          break;
        case 'soundcloud':
          playable = await resolveSoundCloudPlayback(sid);
          break;
        case 'spotify':
          playable = await resolveSpotifyPlayback(sid);
          break;
        case 'deezer':
          playable = await resolveDeezerPlayback(sid);
          break;
        case 'radio':
          playable = await resolveRadioPlayback(sid);
          break;
        default:
          throw new ValidationError('Unsupported source');
      }
    } catch (sourceError) {
      console.error(`${source} playback error:`, sourceError);
      playable = {
        kind: 'external',
        externalUrl: track.url,
        message: `Unable to stream - opens in ${source}`
      };
    }

    res.status(200).json({
      track: {
        source: track.source,
        sid: track.sid,
        title: track.title,
        artist: track.artist,
        album: track.album,
        thumbnailUrl: track.thumbnailUrl,
        duration: track.duration,
        url: track.url,
        explicit: track.explicit,
      },
      playable
    });

  } catch (error) {
    return handleApiError(error, res);
  }
}