/**
 * Discord OAuth2 Login Endpoint
 */

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const discordClientId = process.env.DISCORD_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  if (!discordClientId) {
    return res.status(500).json({ error: 'Discord client ID not configured' });
  }

  // Discord OAuth2 scopes
  const scopes = ['identify', 'guilds'].join('%20');
  
  // Redirect URL
  const redirectUri = encodeURIComponent(`${baseUrl}/api/auth/discord/callback`);
  
  // Discord OAuth2 authorization URL
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`;

  // Redirect to Discord
  res.redirect(discordAuthUrl);
}