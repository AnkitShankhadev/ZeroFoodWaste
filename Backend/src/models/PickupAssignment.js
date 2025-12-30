const mongoose = require('mongoose');

const pickupAssignmentSchema = new mongoose.Schema({
  donationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodDonation',
    required: [true, 'Donation ID is required'],
    unique: true,
  },
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Volunteer ID is required'],
  },
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING',
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  cancelledAt: {
    type: Date,
  },
  cancellationReason: {
    type: String,
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
    maxlength: [500, 'Feedback cannot exceed 500 characters'],
  },
});

pickupAssignmentSchema.index({ volunteerId: 1, status: 1 });
pickupAssignmentSchema.index({ donationId: 1 });

module.exports = mongoose.model('PickupAssignment', pickupAssignmentSchema);

