/**
 * Listening History API endpoint
 */

import connectDB from '../../../lib/db.js';
import User from '../../../models/User.js';
import Track from '../../../models/Track.js';
import History from '../../../models/History.js';
import { getUserFromRequest } from '../../../lib/auth.js';
import { handleApiError, AuthError, ValidationError } from '../../../lib/errors.js';
import { rateLimit } from '../../../lib/rateLimit.js';

export default async function handler(req, res) {
  try {
    await connectDB();

    // Rate limiting
    rateLimit(`history_${req.ip}`, { maxTokens: 100, refillRate: 2 });

    const tokenData = getUserFromRequest(req);
    if (!tokenData) {
      throw new AuthError();
    }

    const user = await User.findById(tokenData.userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    if (req.method === 'GET') {
      // Get user's listening history
      const { range = 'all', unique = 'false', limit = 100, page = 1 } = req.query;

      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(parseInt(limit) || 100, 200);
      const skip = (pageNum - 1) * limitNum;

      // Build date filter
      let dateFilter = {};
      const now = new Date();

      switch (range) {
        case '7d':
          dateFilter = { playedAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
          break;
        case '30d':
          dateFilter = { playedAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
          break;
        case '1y':
          dateFilter = { playedAt: { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) } };
          break;
        default:
          // 'all' - no date filter
          break;
      }

      if (unique === 'true') {
        // Get unique tracks with latest play time
        const pipeline = [
          { $match: { userId: user._id, ...dateFilter } },
          { $sort: { playedAt: -1 } },
          { 
            $group: {
              _id: '$trackId',
              playedAt: { $first: '$playedAt' },
              playCount: { $sum: 1 }
            }
          },
          { $sort: { playedAt: -1 } },
          { $skip: skip },
          { $limit: limitNum },
          { 
            $lookup: {
              from: 'tracks',
              localField: '_id',
              foreignField: '_id',
              as: 'track'
            }
          },
          { $unwind: '$track' }
        ];

        const results = await History.aggregate(pipeline);
        
        const historyItems = results.map(item => ({
          ...item.track,
          playedAt: item.playedAt,
          playCount: item.playCount
        }));

        // Get total count for pagination
        const totalPipeline = [
          { $match: { userId: user._id, ...dateFilter } },
          { 
            $group: {
              _id: '$trackId'
            }
          },
          { $count: 'total' }
        ];

        const totalResult = await History.aggregate(totalPipeline);
        const total = totalResult[0]?.total || 0;

        res.status(200).json({
          history: historyItems,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: total,
            pages: Math.ceil(total / limitNum)
          },
          unique: true,
          range
        });

      } else {
        // Get all history entries
        const historyItems = await History.find({ userId: user._id, ...dateFilter })
          .populate('trackId')
          .sort({ playedAt: -1 })
          .skip(skip)
          .limit(limitNum);

        const total = await History.countDocuments({ userId: user._id, ...dateFilter });

        const formattedHistory = historyItems.map(item => ({
          ...item.trackId?.toObject(),
          playedAt: item.playedAt,
          _historyId: item._id
        }));

        res.status(200).json({
          history: formattedHistory,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: total,
            pages: Math.ceil(total / limitNum)
          },
          unique: false,
          range
        });
      }

    } else if (req.method === 'POST') {
      // Add track to history
      const { track } = req.body;

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

      // Add to history
      const historyEntry = new History({
        userId: user._id,
        trackId: dbTrack._id,
        playedAt: new Date()
      });

      await historyEntry.save();

      res.status(201).json({
        message: 'Track added to history',
        track: dbTrack.toObject()
      });

    } else if (req.method === 'DELETE') {
      // Clear history
      const { scope = 'all' } = req.body;

      let dateFilter = {};
      const now = new Date();

      switch (scope) {
        case '7d':
          dateFilter = { playedAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
          break;
        case '30d':
          dateFilter = { playedAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
          break;
        default:
          // 'all' - no date filter (delete everything)
          break;
      }

      const deleteResult = await History.deleteMany({ 
        userId: user._id, 
        ...dateFilter 
      });

      res.status(200).json({
        message: `History cleared (${scope})`,
        deletedCount: deleteResult.deletedCount
      });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    return handleApiError(error, res);
  }
}