const Achievement = require("../models/Achievement");
const Badge = require("../models/Badge");
const User = require("../models/User");
const Points = require("../models/Points");
const {
  DONOR_ACHIEVEMENTS,
  NGO_ACHIEVEMENTS,
  VOLUNTEER_ACHIEVEMENTS,
  BADGES,
} = require("../config/achievements");
const notificationService = require("./notificationService");

/**
 * Get achievements for a role
 */
const getAchievementsByRole = (role) => {
  switch (role) {
    case "DONOR":
      return DONOR_ACHIEVEMENTS;
    case "NGO":
      return NGO_ACHIEVEMENTS;
    case "VOLUNTEER":
      return VOLUNTEER_ACHIEVEMENTS;
    default:
      return [];
  }
};

/**
 * Award achievement to a user
 */
const awardAchievement = async (userId, achievementId, role) => {
  try {
    const achievementList = getAchievementsByRole(role);
    const achievementConfig = achievementList.find(
      (a) => a.id === achievementId,
    );

    if (!achievementConfig) {
      console.log(`Achievement ${achievementId} not found for role ${role}`);
      return null;
    }

    // Check if already earned
    const existingAchievement = await Achievement.findOne({
      userId,
      type: achievementConfig.type,
      title: achievementConfig.title,
    });

    if (existingAchievement) {
      return null; // Already earned
    }

    // Create achievement
    const achievement = await Achievement.create({
      userId,
      type: achievementConfig.type,
      title: achievementConfig.title,
      description: achievementConfig.description,
      icon: achievementConfig.icon,
      pointsAwarded: achievementConfig.pointsAwarded,
      metadata: {
        achievementId,
        role,
      },
      earnedAt: new Date(),
    });

    // Award points
    if (achievementConfig.pointsAwarded > 0) {
      await User.findByIdAndUpdate(userId, {
        $inc: { totalPoints: achievementConfig.pointsAwarded },
      });

      // Create points record
      await Points.create({
        userId,
        points: achievementConfig.pointsAwarded,
        source: "ACHIEVEMENT",
        description: `Achievement unlocked: ${achievementConfig.title}`,
        role,
      });
    }

    // Check and award badges
    await checkAndAwardBadges(userId);

    // Send notification
    await notificationService.createNotification(
      userId,
      `🎉 Achievement Unlocked: ${achievementConfig.title}! You earned ${achievementConfig.pointsAwarded} points.`,
      "BADGE_EARNED",
      achievement._id,
    );

    return achievement;
  } catch (error) {
    console.error("Error awarding achievement:", error.message);
    throw error;
  }
};

/**
 * Check and award badges based on total points
 */
const checkAndAwardBadges = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const badgeOrder = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"];

    for (const badgeType of badgeOrder) {
      const badgeConfig = BADGES[badgeType];
      const existingBadge = await Badge.findOne({ userId, badgeType });

      if (!existingBadge && user.totalPoints >= badgeConfig.pointsRequired) {
        const badge = await Badge.create({
          userId,
          badgeType,
          badgeName: badgeConfig.name,
          description: badgeConfig.description,
          icon: badgeConfig.icon,
          criteria: `${badgeConfig.pointsRequired} total points`,
          earnedAt: new Date(),
        });

        // Send notification
        await notificationService.createNotification(
          userId,
          `🏅 Badge Unlocked: ${badgeConfig.name}! ${badgeConfig.icon}`,
          "BADGE_EARNED",
          badge._id,
        );
      }
    }
  } catch (error) {
    console.error("Error checking badges:", error.message);
  }
};

/**
 * Check and potentially award achievement based on trigger
 */
const checkAchievementTrigger = async (userId, role, trigger, currentValue) => {
  try {
    const achievementList = getAchievementsByRole(role);
    const relevantAchievements = achievementList.filter(
      (a) => a.trigger === trigger,
    );

    for (const achievement of relevantAchievements) {
      if (currentValue >= achievement.targetValue) {
        await awardAchievement(userId, achievement.id, role);
      }
    }
  } catch (error) {
    console.error("Error checking achievement trigger:", error.message);
  }
};

/**
 * Get user's achievements with earned status
 */
const getUserAchievements = async (userId, role) => {
  try {
    const achievementList = getAchievementsByRole(role);
    const userAchievements = await Achievement.find({ userId }).lean();

    const enhancedAchievements = achievementList.map((achievement) => {
      const earned = userAchievements.find(
        (ua) => ua.title === achievement.title,
      );
      return {
        ...achievement,
        earnedAt: earned ? earned.earnedAt : null,
        _id: earned ? earned._id : null,
      };
    });

    return enhancedAchievements;
  } catch (error) {
    console.error("Error getting user achievements:", error.message);
    throw error;
  }
};

/**
 * Get user's badges
 */
const getUserBadges = async (userId) => {
  try {
    return await Badge.find({ userId }).sort({ earnedAt: -1 }).lean();
  } catch (error) {
    console.error("Error getting user badges:", error.message);
    throw error;
  }
};

/**
 * Get all achievements for a role (for display purposes)
 */
const getAllRoleAchievements = (role) => {
  return getAchievementsByRole(role);
};

/**
 * Get badge information
 */
const getBadgeInfo = () => {
  return BADGES;
};

module.exports = {
  awardAchievement,
  checkAndAwardBadges,
  checkAchievementTrigger,
  getUserAchievements,
  getUserBadges,
  getAllRoleAchievements,
  getBadgeInfo,
  getAchievementsByRole,
};
