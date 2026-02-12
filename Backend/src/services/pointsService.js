const Points = require("../models/Points");
const User = require("../models/User");
const Leaderboard = require("../models/Leaderboard");
const Achievement = require("../models/Achievement");
const Badge = require("../models/Badge");
const notificationService = require("./notificationService");

/**
 * Award points to a user
 * @param {string} userId - User ID
 * @param {number} points - Points to award
 * @param {string} source - Source of points (DONATION, PICKUP, ACHIEVEMENT, BADGE, ADMIN_ADJUSTMENT)
 * @param {string} role - User role
 * @param {string} sourceId - ID of the source (donation, pickup, etc.)
 * @param {string} description - Description of points
 * @returns {Promise<Object>} Points record
 */
const awardPoints = async (
  userId,
  points,
  source,
  role,
  sourceId = null,
  description = "",
) => {
  try {
    // Check if points already awarded for this source
    if (sourceId) {
      const existingPoints = await Points.findOne({
        userId,
        source,
        sourceId,
      });

      if (existingPoints) {
        return existingPoints; // Prevent duplicate points
      }
    }

    // Create points record
    const pointsRecord = await Points.create({
      userId,
      points,
      source,
      sourceId,
      description,
      role,
    });

    // Update user's total points
    await User.findByIdAndUpdate(userId, {
      $inc: { totalPoints: points },
    });

    // Update leaderboard
    await updateLeaderboard(userId, role);

    // Send notification
    await notificationService.createNotification(
      userId,
      `You earned ${points} points! ${description}`,
      "POINTS_EARNED",
      sourceId,
    );

    return pointsRecord;
  } catch (error) {
    throw new Error(`Error awarding points: ${error.message}`);
  }
};

/**
 * Calculate points based on action and role
 * @param {string} action - Action type (DONATION, PICKUP, etc.)
 * @param {string} role - User role
 * @param {object} metadata - Additional metadata
 * @returns {number} Points to award
 */
const calculatePoints = (action, role, metadata = {}) => {
  const pointValues = {
    DONATION: {
      DONOR: 10,
      DEFAULT: 5,
    },
    PICKUP: {
      VOLUNTEER: 15,
      DEFAULT: 10,
    },
    COMPLETION: {
      DONOR: 20,
      VOLUNTEER: 25,
      NGO: 15,
      DEFAULT: 10,
    },
    STREAK: {
      DEFAULT: 5, // Per day
    },
    MILESTONE: {
      DEFAULT: 50,
    },
  };

  const actionPoints = pointValues[action] || {};
  return actionPoints[role] || actionPoints.DEFAULT || 0;
};

/**
 * Update leaderboard for a user
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {Promise<void>}
 */
const updateLeaderboard = async (userId, role) => {
  try {
    const user = await User.findById(userId);
    if (!user || !["DONOR", "NGO", "VOLUNTEER"].includes(role)) {
      return;
    }

    // Get user stats
    const donationsCount = await Points.countDocuments({
      userId,
      source: "DONATION",
    });
    const pickupsCount = await Points.countDocuments({
      userId,
      source: "PICKUP",
    });
    const achievementsCount = await Achievement.countDocuments({ userId });
    const badgesCount = await Badge.countDocuments({ userId });

    // Prepare update data based on role
    const updateData = {
      userId,
      role,
      totalPoints: user.totalPoints,
      achievementsCount,
      badgesCount,
      lastUpdated: new Date(),
    };

    // Set role-specific counts
    if (role === "DONOR") {
      updateData.donationsCount = donationsCount;
      updateData.collectionsCount = 0;
      updateData.pickupsCount = 0;
    } else if (role === "NGO") {
      updateData.donationsCount = 0;
      updateData.collectionsCount = pickupsCount; // NGOs collect donations
      updateData.pickupsCount = 0;
    } else if (role === "VOLUNTEER") {
      updateData.donationsCount = 0;
      updateData.collectionsCount = 0;
      updateData.pickupsCount = pickupsCount;
    }

    // Update or create leaderboard entry
    await Leaderboard.findOneAndUpdate({ userId }, updateData, {
      upsert: true,
      new: true,
    });

    // Recalculate ranks for this role
    await recalculateRanks(role);
  } catch (error) {
    throw new Error(`Error updating leaderboard: ${error.message}`);
  }
};

/**
 * Recalculate ranks for a specific role
 * @param {string} role - User role
 * @returns {Promise<void>}
 */
const recalculateRanks = async (role) => {
  try {
    const leaderboard = await Leaderboard.find({ role })
      .sort({ totalPoints: -1 })
      .select("userId");

    // Update ranks
    for (let i = 0; i < leaderboard.length; i++) {
      await Leaderboard.findOneAndUpdate(
        { userId: leaderboard[i].userId },
        { rank: i + 1 },
      );
    }
  } catch (error) {
    throw new Error(`Error recalculating ranks: ${error.message}`);
  }
};

/**
 * Check and award achievements
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {Promise<void>}
 */
const checkAchievements = async (userId, role) => {
  try {
    const user = await User.findById(userId);
    const donationsCount = await Points.countDocuments({
      userId,
      source: "DONATION",
    });
    const pickupsCount = await Points.countDocuments({
      userId,
      source: "PICKUP",
    });

    // Check for milestone achievements
    const milestones = [
      { count: 5, title: "First Steps", points: 25 },
      { count: 10, title: "Getting Started", points: 50 },
      { count: 25, title: "Making a Difference", points: 100 },
      { count: 50, title: "Community Hero", points: 200 },
      { count: 100, title: "Food Waste Warrior", points: 500 },
    ];

    const totalActions = role === "DONOR" ? donationsCount : pickupsCount;

    for (const milestone of milestones) {
      if (totalActions >= milestone.count) {
        // Check if achievement already exists
        const existingAchievement = await Achievement.findOne({
          userId,
          type: "MILESTONE",
          "metadata.milestoneValue": milestone.count,
        });

        if (!existingAchievement) {
          // Award achievement
          await Achievement.create({
            userId,
            type: "MILESTONE",
            title: milestone.title,
            description: `Completed ${milestone.count} ${role === "DONOR" ? "donations" : "pickups"}`,
            pointsAwarded: milestone.points,
            metadata: {
              milestoneValue: milestone.count,
            },
          });

          // Award points for achievement
          await awardPoints(
            userId,
            milestone.points,
            "ACHIEVEMENT",
            role,
            null,
            `Achievement unlocked: ${milestone.title}`,
          );

          // Send notification
          await notificationService.createNotification(
            userId,
            `Achievement unlocked: ${milestone.title}!`,
            "BADGE_EARNED",
          );
        }
      }
    }
  } catch (error) {
    throw new Error(`Error checking achievements: ${error.message}`);
  }
};

module.exports = {
  awardPoints,
  calculatePoints,
  updateLeaderboard,
  recalculateRanks,
  checkAchievements,
};
