/**
 * User model for VEYNOVA Music Player
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 50,
    match: /^[a-zA-Z0-9_-]+$/,
  },
  displayName: {
    type: String,
    required: true,
    maxlength: 100,
  },
  avatarUrl: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    maxlength: 500,
    default: '',
  },
  providerIds: {
    google: String,
    discord: String,
  },
  settings: {
    volume: {
      type: Number,
      default: 0.8,
      min: 0,
      max: 1,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark',
    },
    keepHistory: {
      type: Boolean,
      default: true,
    },
    showGlobalPlayerOutsideMusic: {
      type: Boolean,
      default: false,
    },
  },
  favorites: {
    tracks: [{
      trackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track',
        required: true,
      },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'providerIds.google': 1 });
userSchema.index({ 'providerIds.discord': 1 });

// Update lastActive on save
userSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastActive = new Date();
  }
  next();
});

export default mongoose.models.User || mongoose.model('User', userSchema);