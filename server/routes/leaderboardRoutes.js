const express = require("express");

const {
  getLeaderboard,
  updateUserScore,
} = require("../controllers/leaderboardController");

const router = express.Router();

router.get("/", getLeaderboard);

router.post("/update", updateUserScore);

module.exports = router;