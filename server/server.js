const express = require("express");
const cors = require("cors");

const challengeRoutes = require("./routes/challengeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Sandbox backend is running",
  });
});

app.use("/api/challenges", challengeRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Sandbox server running on http://localhost:${PORT}`);
});