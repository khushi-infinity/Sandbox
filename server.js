const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const challengeRoutes = require('./routes/challengeRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/challenges', challengeRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});