/**
 * Get Current User Endpoint
 */

import connectDB from '../../../lib/db.js';
import User from '../../../models/User.js';
import { getUserFromRequest } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const tokenData = getUserFromRequest(req);
    if (!tokenData) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await User.findById(tokenData.userId).select('-discordTokens');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user data with Discord info from token
    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        settings: user.settings,
        lastActive: user.lastActive,
        createdAt: user.createdAt,
        hasDiscordAccess: !!tokenData.hasDiscordAccess,
        discordId: tokenData.discordId,
        guilds: tokenData.guilds || []
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}