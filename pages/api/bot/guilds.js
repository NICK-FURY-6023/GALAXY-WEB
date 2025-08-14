/**
 * Bot Guilds Management Endpoint
 * Fetches user's mutual guilds where the bot is present
 */

import connectDB from '../../../lib/db.js';
import User from '../../../models/User.js';
import { getUserFromRequest } from '../../../lib/auth.js';

const BOT_ID = process.env.DISCORD_BOT_ID || '1044596050859663401'; // Your bot's Discord ID

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const tokenData = getUserFromRequest(req);
    if (!tokenData || !tokenData.hasDiscordAccess) {
      return res.status(401).json({ error: 'Discord authentication required' });
    }

    // Get user's guilds from token (stored during login)
    let userGuilds = tokenData.guilds || [];

    // If no guilds in token, try to fetch from database
    if (userGuilds.length === 0) {
      const user = await User.findById(tokenData.userId);
      if (user && user.discordTokens && user.discordTokens.expires_at > Date.now()) {
        try {
          const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: {
              Authorization: `Bearer ${user.discordTokens.access_token}`,
            },
          });

          if (guildsResponse.ok) {
            const guilds = await guildsResponse.json();
            userGuilds = guilds.map(g => ({
              id: g.id,
              name: g.name,
              icon: g.icon,
              permissions: g.permissions,
              owner: g.owner
            }));
          }
        } catch (error) {
          console.error('Error fetching guilds from Discord:', error);
        }
      }
    }

    // TODO: Filter guilds where bot is present
    // For now, we'll simulate this by marking all guilds as having the bot
    // In production, you'd check against your bot's guild list
    const mutualGuilds = userGuilds.map(guild => ({
      ...guild,
      hasBotPermissions: true, // Simulate bot presence
      botStatus: 'online', // Mock status
      memberCount: Math.floor(Math.random() * 1000) + 50, // Mock member count
      musicStatus: {
        playing: Math.random() > 0.7,
        currentTrack: Math.random() > 0.5 ? {
          title: 'Sample Track',
          artist: 'Sample Artist',
          duration: 180
        } : null,
        queueLength: Math.floor(Math.random() * 10)
      }
    }));

    // Sort by name
    mutualGuilds.sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json({
      guilds: mutualGuilds,
      total: mutualGuilds.length
    });

  } catch (error) {
    console.error('Guilds fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch guilds' });
  }
}