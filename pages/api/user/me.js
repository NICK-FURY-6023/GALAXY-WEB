/**
 * Get current user endpoint
 */

import connectDB from '../../../lib/db.js';
import User from '../../../models/User.js';
import { getUserFromRequest } from '../../../lib/auth.js';
import { handleApiError, AuthError } from '../../../lib/errors.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Return user data (exclude sensitive info)
    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        settings: user.settings,
        createdAt: user.createdAt,
        lastActive: user.lastActive,
      },
    });

  } catch (error) {
    return handleApiError(error, res);
  }
}