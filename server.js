const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Temporary mock challenge for testing
app.get('/api/challenges/random', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      _id: "64f1a2b3c4d5",
      title: "Reverse a String",
      description: "Write a function that reverses a string.",
      difficulty: "Easy",
      starterCode: "function reverseString(str) {\n  // Write code here\n}"
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});