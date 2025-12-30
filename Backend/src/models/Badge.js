const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  badgeType: {
    type: String,
    enum: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'SPECIAL'],
    required: [true, 'Badge type is required'],
  },
  badgeName: {
    type: String,
    required: [true, 'Badge name is required'],
    trim: true,
  },
  icon: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    trim: true,
  },
  criteria: {
    type: String,
    trim: true,
  },
  earnedAt: {
    type: Date,
    default: Date.now,
  },
});

badgeSchema.index({ userId: 1, earnedAt: -1 });
badgeSchema.index({ userId: 1, badgeType: 1 });

module.exports = mongoose.model('Badge', badgeSchema);

