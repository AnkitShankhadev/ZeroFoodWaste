const Achievement = require('../models/Achievement');
const Badge = require('../models/Badge');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

/**
 * @desc    Get user achievements
 * @route   GET /api/achievements
 * @access  Private
 */
exports.getAchievements = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.user.id;
    const { type } = req.query;

    const query = { userId };
    if (type) query.type = type;

    const achievements = await Achievement.find(query).sort({ earnedAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        achievements,
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
    const { badgeType } = req.query;

    const query = { userId };
    if (badgeType) query.badgeType = badgeType;

    const badges = await Badge.find(query).sort({ earnedAt: -1 });

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
      return next(new AppError('User not found', 404));
    }

    const achievementsCount = await Achievement.countDocuments({ userId });
    const badgesCount = await Badge.countDocuments({ userId });

    // Get recent achievements
    const recentAchievements = await Achievement.find({ userId })
      .sort({ earnedAt: -1 })
      .limit(5);

    // Get recent badges
    const recentBadges = await Badge.find({ userId })
      .sort({ earnedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalPoints: user.totalPoints,
        achievementsCount,
        badgesCount,
        recentAchievements,
        recentBadges,
      },
    });
  } catch (error) {
    next(error);
  }
};

