const express = require('express');
const router = express.Router();
const { getRandomChallenge } = require('../controllers/challengeController');

router.get('/random', getRandomChallenge);

module.exports = router;