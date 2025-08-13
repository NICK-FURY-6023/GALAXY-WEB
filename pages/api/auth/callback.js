/**
 * OAuth callback handler for both Google and Discord
 */

import connectDB from '../../../lib/db.js';
import User from '../../../models/User.js';
import { generateToken, getCookieOptions } from '../../../lib/auth.js';
import { handleApiError } from '../../../lib/errors.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { code, state, error } = req.query;

    if (error) {
      return res.redirect(302, `/music?auth_error=${encodeURIComponent(error)}`);
    }

    if (!code || !state) {
      return res.redirect(302, '/music?auth_error=missing_code');
    }

    // Parse provider from state
    const [provider] = state.split(':');
    
    if (provider !== 'google' && provider !== 'discord') {
      return res.redirect(302, '/music?auth_error=invalid_provider');
    }

    let userData;
    
    if (provider === 'google') {
      userData = await handleGoogleCallback(code);
    } else if (provider === 'discord') {
      userData = await handleDiscordCallback(code);
    }

    if (!userData) {
      return res.redirect(302, '/music?auth_error=callback_failed');
    }

    // Find or create user
    let user = await User.findOne({ email: userData.email });
    
    if (user) {
      // Update provider ID if not already set
      if (!user.providerIds[provider]) {
        user.providerIds[provider] = userData.id;
        user.lastActive = new Date();
        await user.save();
      }
    } else {
      // Create new user
      let username = userData.username || userData.email.split('@')[0];
      
      // Ensure username is unique
      let counter = 1;
      while (await User.findOne({ username })) {
        username = `${userData.username || userData.email.split('@')[0]}_${counter}`;
        counter++;
      }

      user = new User({
        email: userData.email,
        username,
        displayName: userData.name,
        avatarUrl: userData.picture,
        providerIds: {
          [provider]: userData.id,
        },
      });
      
      await user.save();
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      username: user.username,
    });

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', [
      `vyn_sess=${token}; ${Object.entries(getCookieOptions())
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`
    ]);

    // Redirect to music dashboard
    res.redirect(302, '/music');

  } catch (error) {
    console.error('OAuth callback error:', error);
    return res.redirect(302, '/music?auth_error=server_error');
  }
}

async function handleGoogleCallback(code) {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error('Google OAuth credentials not configured');
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${BASE_URL}/api/auth/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const tokens = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const googleUser = await userResponse.json();

    return {
      id: googleUser.id,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      username: googleUser.email.split('@')[0],
    };

  } catch (error) {
    console.error('Google callback error:', error);
    return null;
  }
}

async function handleDiscordCallback(code) {
  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
    throw new Error('Discord OAuth credentials not configured');
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${BASE_URL}/api/auth/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const tokens = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const discordUser = await userResponse.json();

    return {
      id: discordUser.id,
      email: discordUser.email,
      name: discordUser.global_name || discordUser.username,
      picture: discordUser.avatar 
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
        : null,
      username: discordUser.username,
    };

  } catch (error) {
    console.error('Discord callback error:', error);
    return null;
  }
}