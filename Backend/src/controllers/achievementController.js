const Achievement = require("../models/Achievement");
const Badge = require("../models/Badge");
const User = require("../models/User");
const achievementService = require("../services/achievementService");
const { AppError } = require("../middleware/errorHandler");

/**
 * @desc    Get user's achievements with earned status
 * @route   GET /api/achievements
 * @access  Private
 */
exports.getAchievements = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const achievements = await achievementService.getUserAchievements(
      userId,
      user.role,
    );

    res.status(200).json({
      success: true,
      data: {
        achievements,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user badges
 * @route   GET /api/achievements/badges
 * @access  Private
 */
exports.getBadges = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.user.id;

    const badges = await achievementService.getUserBadges(userId);

    res.status(200).json({
      success: true,
      data: {
        badges,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get role-specific achievements
 * @route   GET /api/achievements/role
 * @access  Private
 */
exports.getRoleAchievements = async (req, res, next) => {
  try {
    const achievements = achievementService.getAllRoleAchievements(
      req.user.role,
    );

    res.status(200).json({
      success: true,
      data: {
        achievements,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get badge levels info
 * @route   GET /api/achievements/badges/levels
 * @access  Private
 */
exports.getBadgeLevels = async (req, res, next) => {
  try {
    const badges = achievementService.getBadgeInfo();

    res.status(200).json({
      success: true,
      data: {
        badges,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user stats
 * @route   GET /api/achievements/stats
 * @access  Private
 */
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const achievements = await achievementService.getUserAchievements(
      userId,
      user.role,
    );
    const badges = await achievementService.getUserBadges(userId);

    const earnedAchievements = achievements.filter((a) => a.earnedAt);
    const earnedCount = earnedAchievements.length;

    res.status(200).json({
      success: true,
      data: {
        totalPoints: user.totalPoints,
        achievementsEarned: earnedCount,
        achievementsTotal: achievements.length,
        badgesEarned: badges.length,
        role: user.role,
        achievements: earnedAchievements.slice(0, 5),
        badges: badges.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};
