const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

/**
 * @desc    Get leaderboard by role
 * @route   GET /api/leaderboard
 * @access  Private
 */
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { role = 'DONOR', limit = 100 } = req.query;

    if (!['DONOR', 'NGO', 'VOLUNTEER'].includes(role)) {
      return next(new AppError('Invalid role', 400));
    }

    const leaderboard = await Leaderboard.find({ role })
      .populate('userId', 'name email profileImage')
      .sort({ totalPoints: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        leaderboard,
        role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's rank
 * @route   GET /api/leaderboard/my-rank
 * @access  Private
 */
exports.getMyRank = async (req, res, next) => {
  try {
    const userRole = req.user.role;

    if (!['DONOR', 'NGO', 'VOLUNTEER'].includes(userRole)) {
      return res.status(200).json({
        success: true,
        data: {
          rank: null,
          message: 'Ranking not available for this role',
        },
      });
    }

    const leaderboardEntry = await Leaderboard.findOne({ userId: req.user.id });

    if (!leaderboardEntry) {
      return res.status(200).json({
        success: true,
        data: {
          rank: null,
          totalPoints: req.user.totalPoints,
        },
      });
    }

    // Get total users in this role for percentage calculation
    const totalUsers = await Leaderboard.countDocuments({ role: userRole });

    res.status(200).json({
      success: true,
      data: {
        rank: leaderboardEntry.rank,
        totalPoints: leaderboardEntry.totalPoints,
        totalUsers,
        percentile: totalUsers > 0 ? ((totalUsers - leaderboardEntry.rank + 1) / totalUsers * 100).toFixed(2) : 0,
        donationsCount: leaderboardEntry.donationsCount,
        pickupsCount: leaderboardEntry.pickupsCount,
        achievementsCount: leaderboardEntry.achievementsCount,
        badgesCount: leaderboardEntry.badgesCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get top users
 * @route   GET /api/leaderboard/top
 * @access  Private
 */
exports.getTopUsers = async (req, res, next) => {
  try {
    const { role, limit = 10 } = req.query;

    const query = {};
    if (role && ['DONOR', 'NGO', 'VOLUNTEER'].includes(role)) {
      query.role = role;
    }

    const topUsers = await Leaderboard.find(query)
      .populate('userId', 'name email profileImage role')
      .sort({ totalPoints: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        topUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

