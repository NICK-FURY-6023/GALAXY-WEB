/**
 * Individual Playlist API endpoint
 */

import connectDB from '../../../../lib/db.js';
import User from '../../../../models/User.js';
import Track from '../../../../models/Track.js';
import Playlist from '../../../../models/Playlist.js';
import { getUserFromRequest } from '../../../../lib/auth.js';
import { handleApiError, AuthError, ValidationError, NotFoundError } from '../../../../lib/errors.js';
import { rateLimit } from '../../../../lib/rateLimit.js';

export default async function handler(req, res) {
  try {
    await connectDB();

    // Rate limiting
    rateLimit(`playlist_${req.ip}`, { maxTokens: 60, refillRate: 1 });

    const tokenData = getUserFromRequest(req);
    if (!tokenData) {
      throw new AuthError();
    }

    const user = await User.findById(tokenData.userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    const { id: playlistId } = req.query;

    if (req.method === 'GET') {
      // Get specific playlist
      const playlist = await Playlist.findOne({ 
        _id: playlistId, 
        userId: user._id 
      }).populate('tracks.trackId');

      if (!playlist) {
        throw new NotFoundError('Playlist not found');
      }

      const formattedPlaylist = {
        _id: playlist._id,
        name: playlist.name,
        description: playlist.description,
        coverUrl: playlist.coverUrl,
        isPublic: playlist.isPublic,
        trackCount: playlist.tracks.length,
        totalDuration: playlist.tracks.reduce((sum, track) => 
          sum + (track.trackId?.duration || 0), 0
        ),
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt,
        tracks: playlist.tracks.map(item => ({
          ...item.trackId?.toObject(),
          addedAt: item.addedAt
        }))
      };

      res.status(200).json({ playlist: formattedPlaylist });

    } else if (req.method === 'PUT') {
      // Update playlist
      const playlist = await Playlist.findOne({ 
        _id: playlistId, 
        userId: user._id 
      });

      if (!playlist) {
        throw new NotFoundError('Playlist not found');
      }

      const { name, description, isPublic, coverUrl } = req.body;

      if (name !== undefined) {
        if (!name?.trim()) {
          throw new ValidationError('Playlist name cannot be empty');
        }
        if (name.length > 100) {
          throw new ValidationError('Playlist name must be 100 characters or less');
        }
        playlist.name = name.trim();
      }

      if (description !== undefined) {
        playlist.description = description?.trim() || '';
      }

      if (isPublic !== undefined) {
        playlist.isPublic = Boolean(isPublic);
      }

      if (coverUrl !== undefined) {
        playlist.coverUrl = coverUrl || null;
      }

      await playlist.save();

      res.status(200).json({
        playlist: {
          _id: playlist._id,
          name: playlist.name,
          description: playlist.description,
          coverUrl: playlist.coverUrl,
          isPublic: playlist.isPublic,
          trackCount: playlist.tracks.length,
          totalDuration: playlist.tracks.reduce((sum, track) => 
            sum + (track.trackId?.duration || 0), 0
          ),
          createdAt: playlist.createdAt,
          updatedAt: playlist.updatedAt
        },
        message: 'Playlist updated successfully'
      });

    } else if (req.method === 'DELETE') {
      // Delete playlist
      const playlist = await Playlist.findOneAndDelete({ 
        _id: playlistId, 
        userId: user._id 
      });

      if (!playlist) {
        throw new NotFoundError('Playlist not found');
      }

      res.status(200).json({
        message: 'Playlist deleted successfully'
      });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    return handleApiError(error, res);
  }
}