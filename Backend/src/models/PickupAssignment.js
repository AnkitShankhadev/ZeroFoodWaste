const mongoose = require("mongoose");

const pickupAssignmentSchema = new mongoose.Schema(
  {
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodDonation",
      required: true,
    },
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    pickedUpAt: {
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
    },
    // Optional: Add proof of delivery
    proofOfDelivery: {
      imageUrl: String,
      signature: String,
      timestamp: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
pickupAssignmentSchema.index({ volunteerId: 1, status: 1 });
pickupAssignmentSchema.index({ donationId: 1 });
pickupAssignmentSchema.index({ status: 1 });

// Virtual for delivery duration
pickupAssignmentSchema.virtual("deliveryDuration").get(function () {
  if (this.completedAt && this.assignedAt) {
    return Math.floor((this.completedAt - this.assignedAt) / (1000 * 60)); // in minutes
  }
  return null;
});

module.exports = mongoose.model("Assignment", pickupAssignmentSchema);
