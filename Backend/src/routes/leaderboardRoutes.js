const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  getMyRank,
  getTopUsers,
} = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All routes require authentication

router.get('/', getLeaderboard);
router.get('/my-rank', getMyRank);
router.get('/top', getTopUsers);

module.exports = router;

