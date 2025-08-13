/**
 * Playlist model for VEYNOVA Music Player
 */

import mongoose from 'mongoose';

const playlistTrackSchema = new mongoose.Schema({
  trackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const playlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 500,
    default: '',
  },
  coverUrl: String,
  isPublic: {
    type: Boolean,
    default: false,
  },
  tracks: [playlistTrackSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
playlistSchema.index({ userId: 1 });
playlistSchema.index({ userId: 1, name: 1 });
playlistSchema.index({ isPublic: 1 });

// Update updatedAt on save
playlistSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

export default mongoose.models.Playlist || mongoose.model('Playlist', playlistSchema);