/**
 * Playlist tracks management API endpoint
 */

import connectDB from '../../../../../lib/db.js';
import User from '../../../../../models/User.js';
import Track from '../../../../../models/Track.js';
import Playlist from '../../../../../models/Playlist.js';
import { getUserFromRequest } from '../../../../../lib/auth.js';
import { handleApiError, AuthError, ValidationError, NotFoundError } from '../../../../../lib/errors.js';
import { rateLimit } from '../../../../../lib/rateLimit.js';

export default async function handler(req, res) {
  try {
    await connectDB();

    // Rate limiting
    rateLimit(`playlist_tracks_${req.ip}`, { maxTokens: 100, refillRate: 2 });

    const tokenData = getUserFromRequest(req);
    if (!tokenData) {
      throw new AuthError();
    }

    const user = await User.findById(tokenData.userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    const { id: playlistId } = req.query;

    const playlist = await Playlist.findOne({ 
      _id: playlistId, 
      userId: user._id 
    });

    if (!playlist) {
      throw new NotFoundError('Playlist not found');
    }

    if (req.method === 'POST') {
      // Add track to playlist
      const { track, position = 'end' } = req.body;

      if (!track) {
        throw new ValidationError('Track data is required');
      }

      // Find or create track
      let dbTrack = await Track.findOne({ 
        source: track.source, 
        sid: track.sid 
      });

      if (!dbTrack) {
        dbTrack = new Track({
          source: track.source,
          sid: track.sid,
          title: track.title || 'Unknown Title',
          artist: track.artist || 'Unknown Artist',
          album: track.album,
          thumbnailUrl: track.thumbnailUrl,
          duration: track.duration,
          url: track.url,
          explicit: track.explicit || false,
        });
        await dbTrack.save();
      }

      // Check if track is already in playlist
      const trackExists = playlist.tracks.some(
        item => item.trackId.toString() === dbTrack._id.toString()
      );

      if (trackExists) {
        throw new ValidationError('Track is already in this playlist');
      }

      // Add track to playlist
      const trackItem = {
        trackId: dbTrack._id,
        addedAt: new Date()
      };

      if (position === 'start') {
        playlist.tracks.unshift(trackItem);
      } else {
        playlist.tracks.push(trackItem);
      }

      await playlist.save();

      // Return updated playlist
      const updatedPlaylist = await Playlist.findById(playlist._id)
        .populate('tracks.trackId');

      res.status(200).json({
        playlist: {
          _id: updatedPlaylist._id,
          name: updatedPlaylist.name,
          trackCount: updatedPlaylist.tracks.length,
          tracks: updatedPlaylist.tracks.map(item => ({
            ...item.trackId.toObject(),
            addedAt: item.addedAt
          }))
        },
        message: 'Track added to playlist'
      });

    } else if (req.method === 'DELETE') {
      // Remove track from playlist
      const { trackId } = req.body;

      if (!trackId) {
        throw new ValidationError('Track ID is required');
      }

      // Remove track from playlist
      playlist.tracks = playlist.tracks.filter(
        item => item.trackId.toString() !== trackId
      );

      await playlist.save();

      // Return updated playlist
      const updatedPlaylist = await Playlist.findById(playlist._id)
        .populate('tracks.trackId');

      res.status(200).json({
        playlist: {
          _id: updatedPlaylist._id,
          name: updatedPlaylist.name,
          trackCount: updatedPlaylist.tracks.length,
          tracks: updatedPlaylist.tracks.map(item => ({
            ...item.trackId.toObject(),
            addedAt: item.addedAt
          }))
        },
        message: 'Track removed from playlist'
      });

    } else if (req.method === 'PUT') {
      // Reorder tracks in playlist
      const { trackIds } = req.body;

      if (!Array.isArray(trackIds)) {
        throw new ValidationError('trackIds must be an array');
      }

      // Validate all track IDs exist in playlist
      const playlistTrackIds = playlist.tracks.map(item => item.trackId.toString());
      const allTracksValid = trackIds.every(id => playlistTrackIds.includes(id));

      if (!allTracksValid) {
        throw new ValidationError('Some track IDs are not in this playlist');
      }

      // Reorder tracks
      const reorderedTracks = trackIds.map(trackId => {
        const existingTrack = playlist.tracks.find(
          item => item.trackId.toString() === trackId
        );
        return existingTrack;
      }).filter(Boolean);

      playlist.tracks = reorderedTracks;
      await playlist.save();

      // Return updated playlist
      const updatedPlaylist = await Playlist.findById(playlist._id)
        .populate('tracks.trackId');

      res.status(200).json({
        playlist: {
          _id: updatedPlaylist._id,
          name: updatedPlaylist.name,
          trackCount: updatedPlaylist.tracks.length,
          tracks: updatedPlaylist.tracks.map(item => ({
            ...item.trackId.toObject(),
            addedAt: item.addedAt
          }))
        },
        message: 'Playlist tracks reordered'
      });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    return handleApiError(error, res);
  }
}