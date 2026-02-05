const mongoose = require('mongoose');

const foodDonationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Donor ID is required'],
  },
  foodType: {
    type: String,
    required: [true, 'Food type is required'],
    trim: true,
  },
  quantity: {
    type: String,
    required: [true, 'Quantity is required'],
    trim: true,
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Expiry date must be in the future',
    },
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  status: {
    type: String,
    enum: ['CREATED', 'ACCEPTED', 'ASSIGNED', 'IN_TRANSIT','DELIVERED', 'CANCELLED','EXPIRED'],
    default: 'CREATED',
  },
  location: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
    address: String,
  },
  images: [{
    type: String,
  }],
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for location-based queries
foodDonationSchema.index({ location: '2dsphere' });
foodDonationSchema.index({ donorId: 1, createdAt: -1 });
foodDonationSchema.index({ status: 1 });

module.exports = mongoose.model('FoodDonation', foodDonationSchema);

