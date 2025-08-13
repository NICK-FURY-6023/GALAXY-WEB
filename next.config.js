/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Saare possible domains ki complete list
    domains: [
      // Discord Related
      'cdn.discordapp.com',
      'media.discordapp.net',
      
      // Developer Platforms
      'avatars.githubusercontent.com', // GitHub Avatars
      'raw.githubusercontent.com',
      'cdn2.steamgriddb.com',
      
      // Music & Video Services
      'i.scdn.co',                  // Spotify Album Art
      'i.ytimg.com',                  // YouTube Thumbnails
      'i1.sndcdn.com',                // SoundCloud
      'is1-ssl.mzstatic.com',         // Apple Music
      'is2-ssl.mzstatic.com',         // Apple Music
      'is3-ssl.mzstatic.com',         // Apple Music
      'is4-ssl.mzstatic.com',         // Apple Music
      'is5-ssl.mzstatic.com',         // Apple Music
      'e-cdns-images.dzcdn.net',      // Deezer
      'resources.tidal.com',        // Tidal
      'f4.bcbits.com',                // Bandcamp

      // Other Common Services
      'pbs.twimg.com',                // Twitter / X
      'static-cdn.jtvnw.net',         // Twitch
      'lh3.googleusercontent.com',    // Google User Content
    ],
  },
}

module.exports = nextConfig