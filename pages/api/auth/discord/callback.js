/**
 * Discord OAuth2 Callback Endpoint
 */

import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/db.js';
import User from '../../../../models/User.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, error } = req.query;

  if (error) {
    console.error('Discord OAuth error:', error);
    return res.redirect('/?error=discord_auth_failed');
  }

  if (!code) {
    return res.redirect('/?error=no_auth_code');
  }

  try {
    await connectDB();

    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/discord/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokens = await tokenResponse.json();

    // Get user info from Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const discordUser = await userResponse.json();

    // Get user's guilds
    const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const guilds = guildsResponse.ok ? await guildsResponse.json() : [];

    // Find or create user in database
    let user = await User.findOne({ 
      $or: [
        { 'providerIds.discord': discordUser.id },
        { email: discordUser.email }
      ]
    });

    if (user) {
      // Update existing user
      user.providerIds = user.providerIds || {};
      user.providerIds.discord = discordUser.id;
      user.username = discordUser.username;
      user.displayName = discordUser.global_name || discordUser.username;
      user.avatarUrl = discordUser.avatar 
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256`
        : null;
      user.lastActive = new Date();
      
      if (discordUser.email && !user.email) {
        user.email = discordUser.email;
      }
    } else {
      // Create new user
      user = new User({
        username: discordUser.username,
        displayName: discordUser.global_name || discordUser.username,
        email: discordUser.email,
        avatarUrl: discordUser.avatar 
          ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256`
          : null,
        providerIds: {
          discord: discordUser.id
        },
        settings: {
          volume: 0.8,
          autoplay: true,
          theme: 'dark',
          keepHistory: true
        },
        lastActive: new Date()
      });
    }

    await user.save();

    // Store Discord tokens temporarily (for guild access)
    // In production, consider encrypting these
    user.discordTokens = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + (tokens.expires_in * 1000),
      scope: tokens.scope
    };

    // Create JWT session token
    const sessionToken = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        discordId: discordUser.id,
        provider: 'discord',
        hasDiscordAccess: true,
        guilds: guilds.map(g => ({
          id: g.id,
          name: g.name,
          icon: g.icon,
          permissions: g.permissions,
          owner: g.owner
        }))
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', [
      `galaxy_sess=${sessionToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
    ]);

    // Redirect to bot dashboard or music hub
    res.redirect('/bot');

  } catch (error) {
    console.error('Discord OAuth callback error:', error);
    res.redirect('/?error=auth_failed');
  }
}