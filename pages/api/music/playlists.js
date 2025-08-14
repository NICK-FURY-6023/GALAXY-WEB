/**
 * Playlists API endpoint
 */

import connectDB from '../../../lib/db.js';
import User from '../../../models/User.js';
import Track from '../../../models/Track.js';
import Playlist from '../../../models/Playlist.js';
import { getUserFromRequest } from '../../../lib/auth.js';
import { handleApiError, AuthError, ValidationError } from '../../../lib/errors.js';
import { rateLimit } from '../../../lib/rateLimit.js';

export default async function handler(req, res) {
  try {
    await connectDB();

    // Rate limiting
    rateLimit(`playlists_${req.ip}`, { maxTokens: 100, refillRate: 2 });

    const tokenData = getUserFromRequest(req);
    if (!tokenData) {
      throw new AuthError();
    }

    const user = await User.findById(tokenData.userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    if (req.method === 'GET') {
      // Get user's playlists
      const playlists = await Playlist.find({ userId: user._id })
        .populate('tracks.trackId')
        .sort({ updatedAt: -1 });

      const formattedPlaylists = playlists.map(playlist => ({
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
      }));

      res.status(200).json({
        playlists: formattedPlaylists,
        total: formattedPlaylists.length
      });

    } else if (req.method === 'POST') {
      // Create new playlist
      const { name, description, isPublic = false, coverUrl } = req.body;

      if (!name?.trim()) {
        throw new ValidationError('Playlist name is required');
      }

      if (name.length > 100) {
        throw new ValidationError('Playlist name must be 100 characters or less');
      }

      // Check if user already has a playlist with this name
      const existingPlaylist = await Playlist.findOne({ 
        userId: user._id, 
        name: name.trim() 
      });

      if (existingPlaylist) {
        throw new ValidationError('You already have a playlist with this name');
      }

      const playlist = new Playlist({
        userId: user._id,
        name: name.trim(),
        description: description?.trim() || '',
        isPublic: Boolean(isPublic),
        coverUrl: coverUrl || null,
        tracks: []
      });

      await playlist.save();

      res.status(201).json({
        playlist: {
          _id: playlist._id,
          name: playlist.name,
          description: playlist.description,
          coverUrl: playlist.coverUrl,
          isPublic: playlist.isPublic,
          trackCount: 0,
          totalDuration: 0,
          createdAt: playlist.createdAt,
          updatedAt: playlist.updatedAt,
          tracks: []
        },
        message: 'Playlist created successfully'
      });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    return handleApiError(error, res);
  }
}