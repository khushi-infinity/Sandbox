const challenges = require("../challenges/challenges");

const testChallenge1 = require("../tests/challenge1.test");
const testChallenge2 = require("../tests/challenge2.test");
const testChallenge3 = require("../tests/challenge3.test");

function runChallenge(req, res) {
  try {
    const { challengeId, files } = req.body;

    if (!challengeId || !files) {
      return res.status(400).json({
        passed: false,
        message: "challengeId and files are required",
      });
    }

    const challenge = challenges.find(
      (item) => item.challengeId === challengeId
    );

    if (!challenge) {
      return res.status(404).json({
        passed: false,
        message: "Challenge not found",
      });
    }

   if (challengeId === "1") {
  const result = testChallenge1(files);

  return res.json(result);
}

if (challengeId === "2") {
  const result = testChallenge2(files);

  return res.json(result);
}

if (challengeId === "3") {
  const result = testChallenge3(files);

  return res.json(result);
}

    return res.json({
      passed: false,
      testsPassed: 0,
      totalTests: 0,
      message: "Tests for this challenge are not available yet.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      passed: false,
      message: "Failed to run challenge",
    });
  }
}

module.exports = {
  runChallenge,
};