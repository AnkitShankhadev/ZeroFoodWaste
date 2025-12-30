const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['DONATION_ACCEPTED', 'VOLUNTEER_ASSIGNED', 'BADGE_EARNED', 'POINTS_EARNED', 'DONATION_COMPLETED', 'SYSTEM', 'ADMIN'],
    required: [true, 'Notification type is required'],
  },
  readStatus: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    // Can reference FoodDonation, PickupAssignment, Achievement, Badge, etc.
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

notificationSchema.index({ userId: 1, readStatus: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

