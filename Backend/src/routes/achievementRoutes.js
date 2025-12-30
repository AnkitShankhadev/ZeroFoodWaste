const express = require('express');
const router = express.Router();
const {
  getAchievements,
  getBadges,
  getStats,
} = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All routes require authentication

router.get('/', getAchievements);
router.get('/badges', getBadges);
router.get('/stats', getStats);

module.exports = router;

