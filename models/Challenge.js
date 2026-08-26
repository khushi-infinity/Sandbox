const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    default: 'Easy'
  },
  starterCode: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Challenge', challengeSchema);