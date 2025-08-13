/**
 * Favorites API endpoint
 */

import connectDB from '../../../lib/db.js';
import User from '../../../models/User.js';
import Track from '../../../models/Track.js';
import { getUserFromRequest } from '../../../lib/auth.js';
import { handleApiError, AuthError, ValidationError } from '../../../lib/errors.js';
import { validateBody, schemas } from '../../../lib/validate.js';

export default async function handler(req, res) {
  try {
    await connectDB();

    const tokenData = getUserFromRequest(req);
    if (!tokenData) {
      throw new AuthError();
    }

    const user = await User.findById(tokenData.userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    if (req.method === 'GET') {
      // Get user's favorites
      const favorites = await User.findById(user._id)
        .populate('favorites.tracks.trackId')
        .select('favorites');

      const favoriteTracks = favorites?.favorites?.tracks?.map(item => ({
        ...item.trackId.toObject(),
        addedAt: item.addedAt
      })) || [];

      res.status(200).json({
        tracks: favoriteTracks,
        total: favoriteTracks.length
      });

    } else if (req.method === 'POST') {
      // Add or remove favorites
      const { action, track, trackId } = req.body;

      if (!action || (action !== 'add' && action !== 'remove')) {
        throw new ValidationError('Action must be "add" or "remove"');
      }

      let targetTrackId = trackId;

      if (action === 'add') {
        if (!track) {
          throw new ValidationError('Track data required for add action');
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

        targetTrackId = dbTrack._id;

        // Check if already in favorites
        if (!user.favorites) {
          user.favorites = { tracks: [] };
        }

        const alreadyFavorited = user.favorites.tracks.some(
          item => item.trackId.toString() === targetTrackId.toString()
        );

        if (!alreadyFavorited) {
          user.favorites.tracks.push({
            trackId: targetTrackId,
            addedAt: new Date()
          });
          await user.save();
        }

      } else if (action === 'remove') {
        if (!trackId && !track) {
          throw new ValidationError('Track ID or track data required for remove action');
        }

        if (track && !trackId) {
          const dbTrack = await Track.findOne({ 
            source: track.source, 
            sid: track.sid 
          });
          targetTrackId = dbTrack?._id;
        }

        if (targetTrackId && user.favorites?.tracks) {
          user.favorites.tracks = user.favorites.tracks.filter(
            item => item.trackId.toString() !== targetTrackId.toString()
          );
          await user.save();
        }
      }

      // Return updated favorites
      const updatedUser = await User.findById(user._id)
        .populate('favorites.tracks.trackId')
        .select('favorites');

      const favoriteTracks = updatedUser?.favorites?.tracks?.map(item => ({
        ...item.trackId.toObject(),
        addedAt: item.addedAt
      })) || [];

      res.status(200).json({
        tracks: favoriteTracks,
        total: favoriteTracks.length,
        action: action,
        success: true
      });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    return handleApiError(error, res);
  }
}