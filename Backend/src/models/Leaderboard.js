const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true,
  },
  role: {
    type: String,
    enum: ['DONOR', 'NGO', 'VOLUNTEER'],
    required: [true, 'Role is required'],
  },
  totalPoints: {
    type: Number,
    default: 0,
    required: true,
  },
  rank: {
    type: Number,
    default: 0,
  },
  donationsCount: {
    type: Number,
    default: 0,
  },
  pickupsCount: {
    type: Number,
    default: 0,
  },
  achievementsCount: {
    type: Number,
    default: 0,
  },
  badgesCount: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

leaderboardSchema.index({ role: 1, totalPoints: -1 });
leaderboardSchema.index({ userId: 1 });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);

