const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  type: {
    type: String,
    enum: ["DONATION", "PICKUP", "STREAK", "MILESTONE", "SPECIAL"],
    required: [true, "Achievement type is required"],
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  icon: {
    type: String,
    default: "🏅",
  },
  pointsAwarded: {
    type: Number,
    default: 0,
  },
  metadata: {
    donationCount: Number,
    pickupCount: Number,
    streakDays: Number,
    milestoneValue: Number,
  },
  earnedAt: {
    type: Date,
    default: Date.now,
  },
});

achievementSchema.index({ userId: 1, earnedAt: -1 });
achievementSchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model("Achievement", achievementSchema);
