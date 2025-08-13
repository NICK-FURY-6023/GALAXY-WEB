/**
 * Queue model for VEYNOVA Music Player
 */

import mongoose from 'mongoose';

const queueItemSchema = new mongoose.Schema({
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

const queueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [queueItemSchema],
  currentIndex: {
    type: Number,
    default: -1,
  },
  shuffle: {
    type: Boolean,
    default: false,
  },
  repeatMode: {
    type: String,
    enum: ['off', 'one', 'all'],
    default: 'off',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
queueSchema.index({ userId: 1 });

// Update updatedAt on save
queueSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Queue || mongoose.model('Queue', queueSchema);