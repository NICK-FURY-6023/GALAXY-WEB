/**
 * History model for VEYNOVA Music Player
 */

import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  trackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    required: true,
  },
  playedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// Indexes for efficient queries
historySchema.index({ userId: 1, playedAt: -1 });
historySchema.index({ userId: 1, trackId: 1 });

export default mongoose.models.History || mongoose.model('History', historySchema);