# 🚀 GALAXY Bot - Official Website + VEYNOVA Music Player

Welcome to the official source code for the GALAXY Discord Music Bot's website, now featuring the **VEYNOVA Music Player** - a comprehensive music streaming platform that integrates multiple sources into one seamless experience.

**Live Demo:** [https://galaxy-bot-me.vercel.app/](https://galaxy-bot-me.vercel.app/)

![GALAXY Website + VEYNOVA Music Player](https://media.discordapp.net/attachments/997575905541107872/1391905133356515490/Screenshot_2025-07-08-03-42-50-509_com.android.chrome-edit.jpg?ex=686d982c&is=686c46ac&hm=081848f6ace8725f595a2d593fac466b10917f35c964e7d43e217a1e158856b1&)

---

## ✨ Features

### 🎵 VEYNOVA Music Player (NEW)
* **Multi-Source Streaming:** YouTube, Spotify, SoundCloud, Deezer, and Radio stations
* **Advanced Queue Management:** Drag-and-drop reordering, repeat modes, shuffle
* **Smart Playlists:** Create, edit, and share custom playlists with cover art
* **Favorites System:** Like tracks and create your personal collection
* **Listening History:** Track your music journey with detailed playback history
* **Live Radio:** Curated radio stations across multiple genres
* **Real-Time Sync:** WebSocket integration for multi-device synchronization
* **User Profiles:** Customizable profiles with avatar upload and preferences
* **OAuth Authentication:** Secure login with Google and Discord
* **Responsive Design:** Seamless experience across desktop and mobile

### 🌟 Original Galaxy Website Features
* **Futuristic UI/UX:** Dark-themed design with glassmorphism effects and smooth animations
* **High-Performance Background:** Lightweight 2D canvas-based animated starfield
* **Fully Responsive:** Works perfectly on all devices
* **Live GitHub Updates:** Real-time commit tracking from repositories
* **Comprehensive Command Explorer:** Interactive command documentation
* **Dynamic Components:** Live bot statistics and status indicators

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** [Next.js](https://nextjs.org/) (Pages Router)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
* **Icons:** [React Icons](https://react-icons.github.io/react-icons/)
* **HTTP Client:** [Axios](https://axios-http.com/)
* **Data Fetching:** [SWR](https://swr.vercel.app/)

### Backend
* **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
* **Authentication:** JWT with HTTP-only cookies
* **APIs:** Next.js API Routes
* **Real-Time:** [Socket.IO](https://socket.io/)
* **Validation:** [Zod](https://zod.dev/)
* **File Uploads:** [Multer](https://github.com/expressjs/multer)

### Music Integration
* **YouTube:** YouTube Data API v3 + play-dl
* **Spotify:** Web API + Web Playback SDK
* **SoundCloud:** REST API
* **Deezer:** Public API
* **Radio:** Custom station management

---

## 📂 Project Structure

```
.
├── components/
│   ├── layout/           # Layout components (Header, Footer, Layout)
│   ├── music/            # Music player components
│   └── ui/               # Reusable UI components
├── context/              # React contexts (Auth, Player)
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── sources/          # Music source integrations
│   ├── db.js             # Database connection
│   ├── auth.js           # Authentication utilities
│   └── ...               # Other utilities
├── models/               # Mongoose schemas
├── pages/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── music/        # Music API endpoints
│   │   └── user/         # User management endpoints
│   ├── music/            # Music player pages
│   └── ...               # Other pages
├── public/               # Static assets
├── styles/               # Global styles
├── .env.local.example    # Environment variables template
└── package.json          # Dependencies and scripts
```

---

## ⚙️ Setup and Installation

### Prerequisites
* Node.js 18+ and npm/yarn
* MongoDB (local installation or Atlas cloud)
* API credentials for music services (optional but recommended)

### 1. Clone and Install

```bash
git clone https://github.com/NICK-FURY-6023/GALAXY-WEBD.git
cd GALAXY-WEBD
yarn install
```

### 2. Environment Configuration

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Required
NEXT_PUBLIC_BASE_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/veynova
JWT_SECRET=your-super-secure-jwt-secret-key-here

# OAuth (Required for user authentication)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret

# Music APIs (Optional - fallback to external links without these)
YOUTUBE_API_KEY=your-youtube-api-key
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
SOUNDCLOUD_CLIENT_ID=your-soundcloud-client-id
DEEZER_APP_ID=your-deezer-app-id
DEEZER_APP_SECRET=your-deezer-app-secret

# Optional
REDIS_URL=redis://localhost:6379
```

### 3. Database Setup

#### MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create new cluster and database
3. Get connection string and update `MONGODB_URI`

#### Local MongoDB
```bash
# Install MongoDB locally
brew install mongodb-community@7.0  # macOS
# or
apt-get install mongodb-community    # Ubuntu

# Start MongoDB
brew services start mongodb-community@7.0  # macOS
# or
systemctl start mongod                      # Ubuntu
```

### 4. OAuth Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create new project or select existing
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback`
6. Copy Client ID and Secret to `.env.local`

#### Discord OAuth
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create new application
3. Go to OAuth2 settings
4. Add redirect URI: `http://localhost:3000/api/auth/callback`
5. Copy Client ID and Secret to `.env.local`

### 5. Music API Keys (Optional)

#### YouTube Data API
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Enable "YouTube Data API v3"
3. Create API key and copy to `.env.local`

#### Spotify Web API
1. Go to [Spotify for Developers](https://developer.spotify.com/dashboard/)
2. Create new app
3. Copy Client ID and Secret

#### SoundCloud API
1. Go to [SoundCloud for Developers](https://developers.soundcloud.com/)
2. Register new application
3. Copy Client ID

#### Deezer API
1. Go to [Deezer for Developers](https://developers.deezer.com/)
2. Create new application
3. Copy Application ID and Secret

### 6. Run Development Server

```bash
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Prepare for Deployment**
   ```bash
   yarn build
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

3. **Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Update `NEXT_PUBLIC_BASE_URL` to your production domain
   - Update OAuth redirect URIs to production URLs

### Manual Deployment

```bash
yarn build
yarn start
```

---

## 🎵 Music Player Usage

### Basic Features
1. **Sign In:** Use Google or Discord OAuth
2. **Search:** Use the search bar to find music across all sources
3. **Play:** Click any track to start playing
4. **Queue:** Tracks are automatically added to your queue
5. **Controls:** Use play/pause, next/previous, volume controls

### Advanced Features
1. **Playlists:** Create and manage custom playlists
2. **Favorites:** Like tracks to save them to your favorites
3. **History:** View your listening history and replay tracks
4. **Radio:** Explore curated radio stations
5. **Profile:** Customize your profile and preferences

### Keyboard Shortcuts
* `Space` - Play/Pause
* `J` - Previous track
* `K` - Next track
* `L` - Seek forward 5s
* `H` - Seek backward 5s
* `M` - Mute/Unmute
* `↑/↓` - Volume control

---

## 🔧 API Endpoints

### Authentication
* `GET /api/auth/google` - Initiate Google OAuth
* `GET /api/auth/discord` - Initiate Discord OAuth
* `GET /api/auth/callback` - Handle OAuth callbacks
* `POST /api/auth/logout` - Logout user

### User Management
* `GET /api/user/me` - Get current user
* `PUT /api/user/profile` - Update user profile
* `POST /api/user/avatar` - Upload avatar
* `PUT /api/user/settings` - Update user settings

### Music
* `GET /api/music/search` - Search across music sources
* `POST /api/music/play` - Resolve track for playback
* `GET /api/music/queue` - Get user's queue
* `POST /api/music/queue` - Modify queue
* `GET /api/music/playlists` - Get user playlists
* `POST /api/music/playlists` - Manage playlists
* `GET /api/music/favorites` - Get favorites
* `POST /api/music/favorites` - Manage favorites
* `GET /api/music/history` - Get listening history
* `GET /api/music/radio` - Get radio stations

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Important Notes

### Music Source Compliance
* **YouTube:** Uses YouTube Data API for metadata. Streaming requires compliance with YouTube's Terms of Service
* **Spotify:** Provides 30-second previews. Full playback requires Spotify Premium + Web Playback SDK
* **SoundCloud:** Uses official API for tracks marked as streamable
* **Deezer:** Provides 30-second previews for most tracks
* **Radio:** Direct streaming from provided station URLs

### Rate Limits
* API endpoints implement rate limiting to prevent abuse
* Music source APIs have their own rate limits
* Consider implementing Redis for production caching

### Privacy & Data
* User data is stored securely in MongoDB
* Only necessary user information is collected
* Authentication uses secure HTTP-only cookies
* Users can control their data through profile settings

---

**Developed by NICK FURY with ❤️**

For support, join our [Discord Server](https://discord.gg/U4kN6ZJyMt)
