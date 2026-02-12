const express = require('express');
const router = express.Router();
const {
  getAchievements,
  getBadges,
  getStats,
  getRoleAchievements,
  getBadgeLevels,
} = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All routes require authentication

router.get('/stats', getStats);
router.get('/role', getRoleAchievements);
router.get('/badges/levels', getBadgeLevels);
router.get('/badges', getBadges);
router.get('/', getAchievements);

module.exports = router;

