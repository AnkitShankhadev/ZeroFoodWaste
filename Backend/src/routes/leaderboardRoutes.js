const express = require("express");
const router = express.Router();
const {
  getLeaderboard,
  getMyRank,
  getTopUsers,
} = require("../controllers/leaderboardController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // All routes require authentication

router.get("/my-rank", getMyRank);
router.get("/top", getTopUsers);
router.get("/", getLeaderboard);

module.exports = router;
