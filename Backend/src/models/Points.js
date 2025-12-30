const mongoose = require('mongoose');

const pointsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  points: {
    type: Number,
    required: [true, 'Points value is required'],
  },
  source: {
    type: String,
    enum: ['DONATION', 'PICKUP', 'ACHIEVEMENT', 'BADGE', 'ADMIN_ADJUSTMENT'],
    required: [true, 'Points source is required'],
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    // Can reference FoodDonation, PickupAssignment, Achievement, Badge, etc.
  },
  description: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['DONOR', 'NGO', 'VOLUNTEER'],
    required: [true, 'Role is required'],
  },
  earnedAt: {
    type: Date,
    default: Date.now,
  },
});

pointsSchema.index({ userId: 1, earnedAt: -1 });
pointsSchema.index({ userId: 1, source: 1 });
pointsSchema.index({ sourceId: 1 });

// Prevent duplicate points for same source
pointsSchema.index({ userId: 1, source: 1, sourceId: 1 }, { unique: true });

module.exports = mongoose.model('Points', pointsSchema);

