/**
 * Queue management API endpoint
 */

import connectDB from '../../../lib/db.js';
import User from '../../../models/User.js';
import Track from '../../../models/Track.js';
import Queue from '../../../models/Queue.js';
import { getUserFromRequest } from '../../../lib/auth.js';
import { handleApiError, AuthError, ValidationError } from '../../../lib/errors.js';
import { rateLimit } from '../../../lib/rateLimit.js';

export default async function handler(req, res) {
  try {
    await connectDB();

    // Rate limiting
    rateLimit(`queue_${req.ip}`, { maxTokens: 100, refillRate: 2 });

    const tokenData = getUserFromRequest(req);
    if (!tokenData) {
      throw new AuthError();
    }

    const user = await User.findById(tokenData.userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    if (req.method === 'GET') {
      // Get user's queue
      const queue = await Queue.findOne({ userId: user._id })
        .populate('tracks.trackId');

      if (!queue) {
        return res.status(200).json({
          queue: [],
          currentIndex: -1,
          total: 0
        });
      }

      const formattedQueue = queue.tracks.map(item => ({
        ...item.trackId?.toObject(),
        addedAt: item.addedAt
      }));

      res.status(200).json({
        queue: formattedQueue,
        currentIndex: queue.currentIndex,
        total: formattedQueue.length
      });

    } else if (req.method === 'POST') {
      // Manage queue
      const { action, track, tracks, index, position = 'end' } = req.body;

      if (!action) {
        throw new ValidationError('Action is required');
      }

      // Find or create user's queue
      let queue = await Queue.findOne({ userId: user._id });
      if (!queue) {
        queue = new Queue({
          userId: user._id,
          tracks: [],
          currentIndex: -1
        });
      }

      switch (action) {
        case 'add':
          if (!track) {
            throw new ValidationError('Track data is required for add action');
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

          const trackItem = {
            trackId: dbTrack._id,
            addedAt: new Date()
          };

          if (position === 'next') {
            // Add after current track
            const insertIndex = Math.max(0, queue.currentIndex + 1);
            queue.tracks.splice(insertIndex, 0, trackItem);
          } else {
            // Add to end
            queue.tracks.push(trackItem);
          }

          // If queue was empty, set as current
          if (queue.currentIndex === -1 && queue.tracks.length === 1) {
            queue.currentIndex = 0;
          }

          break;

        case 'remove':
          if (index === undefined) {
            throw new ValidationError('Index is required for remove action');
          }

          if (index < 0 || index >= queue.tracks.length) {
            throw new ValidationError('Invalid index');
          }

          queue.tracks.splice(index, 1);

          // Adjust current index
          if (index < queue.currentIndex) {
            queue.currentIndex = Math.max(0, queue.currentIndex - 1);
          } else if (index === queue.currentIndex) {
            // If removing current track, stay at same index (next track)
            queue.currentIndex = Math.min(queue.currentIndex, queue.tracks.length - 1);
          }

          // If queue is empty, reset current index
          if (queue.tracks.length === 0) {
            queue.currentIndex = -1;
          }

          break;

        case 'clear':
          queue.tracks = [];
          queue.currentIndex = -1;
          break;

        case 'set':
          if (!Array.isArray(tracks)) {
            throw new ValidationError('Tracks array is required for set action');
          }

          // Find or create all tracks
          const trackItems = [];
          for (const trackData of tracks) {
            let dbTrack = await Track.findOne({ 
              source: trackData.source, 
              sid: trackData.sid 
            });

            if (!dbTrack) {
              dbTrack = new Track({
                source: trackData.source,
                sid: trackData.sid,
                title: trackData.title || 'Unknown Title',
                artist: trackData.artist || 'Unknown Artist',
                album: trackData.album,
                thumbnailUrl: trackData.thumbnailUrl,
                duration: trackData.duration,
                url: trackData.url,
                explicit: trackData.explicit || false,
              });
              await dbTrack.save();
            }

            trackItems.push({
              trackId: dbTrack._id,
              addedAt: new Date()
            });
          }

          queue.tracks = trackItems;
          queue.currentIndex = Math.min(index || 0, trackItems.length - 1);

          if (trackItems.length === 0) {
            queue.currentIndex = -1;
          }

          break;

        case 'reorder':
          const { from, to } = req.body;
          
          if (from === undefined || to === undefined) {
            throw new ValidationError('From and to indices are required for reorder action');
          }

          if (from < 0 || from >= queue.tracks.length || to < 0 || to >= queue.tracks.length) {
            throw new ValidationError('Invalid indices');
          }

          // Move track from one position to another
          const [movedTrack] = queue.tracks.splice(from, 1);
          queue.tracks.splice(to, 0, movedTrack);

          // Adjust current index
          if (from === queue.currentIndex) {
            queue.currentIndex = to;
          } else if (from < queue.currentIndex && to >= queue.currentIndex) {
            queue.currentIndex--;
          } else if (from > queue.currentIndex && to <= queue.currentIndex) {
            queue.currentIndex++;
          }

          break;

        case 'setIndex':
          if (index === undefined) {
            throw new ValidationError('Index is required for setIndex action');
          }

          if (queue.tracks.length === 0) {
            queue.currentIndex = -1;
          } else {
            queue.currentIndex = Math.max(0, Math.min(index, queue.tracks.length - 1));
          }

          break;

        default:
          throw new ValidationError('Invalid action');
      }

      await queue.save();

      // Return updated queue
      const updatedQueue = await Queue.findById(queue._id)
        .populate('tracks.trackId');

      const formattedQueue = updatedQueue.tracks.map(item => ({
        ...item.trackId?.toObject(),
        addedAt: item.addedAt
      }));

      res.status(200).json({
        queue: formattedQueue,
        currentIndex: updatedQueue.currentIndex,
        total: formattedQueue.length,
        action: action,
        message: `Queue ${action} completed`
      });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    return handleApiError(error, res);
  }
}