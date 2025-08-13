/**
 * Discord OAuth initiation endpoint
 */

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!DISCORD_CLIENT_ID) {
    return res.status(500).json({ 
      error: 'Discord OAuth not configured. Please set DISCORD_CLIENT_ID in environment variables.' 
    });
  }

  const redirectUri = `${BASE_URL}/api/auth/callback`;
  const scope = 'identify email';
  const state = `discord:${Date.now()}`;

  const discordAuthUrl = 
    `https://discord.com/api/oauth2/authorize?` +
    `client_id=${DISCORD_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(scope)}&` +
    `state=${state}`;

  res.redirect(302, discordAuthUrl);
}