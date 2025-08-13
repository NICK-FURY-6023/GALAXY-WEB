/**
 * Track model for VEYNOVA Music Player
 */

import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
  // Normalized identity across sources
  source: {
    type: String,
    required: true,
    enum: ['youtube', 'ytmusic', 'soundcloud', 'spotify', 'deezer', 'radio'],
  },
  sid: {
    type: String,
    required: true,
  },
  
  // Track metadata
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  artist: {
    type: String,
    required: true,
    maxlength: 200,
  },
  album: {
    type: String,
    maxlength: 200,
  },
  thumbnailUrl: String,
  duration: Number, // seconds
  url: String, // canonical page URL
  streamUrl: String, // direct stream URL (if available)
  explicit: {
    type: Boolean,
    default: false,
  },
  
  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index on source + sid
trackSchema.index({ source: 1, sid: 1 }, { unique: true });
trackSchema.index({ title: 'text', artist: 'text', album: 'text' });

export default mongoose.models.Track || mongoose.model('Track', trackSchema);