const Challenge = require('../models/Challenge');

const getRandomChallenge = async (req, res) => {
  try {
    const count = await Challenge.countDocuments();
    
    if (count === 0) {
      return res.status(404).json({ message: 'No challenges found' });
    }

    const randomIndex = Math.floor(Math.random() * count);
    const randomChallenge = await Challenge.findOne().skip(randomIndex);

    res.status(200).json({
      success: true,
      data: randomChallenge
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getRandomChallenge };