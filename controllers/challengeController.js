const Challenge = require("../models/Challenge");

// Get a random mock challenge in multi-file format
const getRandomChallenge = async (req, res) => {
  try {
    const mockChallenge = {
      challengeId: "1",
      title: "Fix Broken Login",
      description:
        "Users are unable to log in to the application. Investigate the MERN project and find the bug.",
      requirements: [
        "Inspect the relevant files.",
        "Fix the login functionality.",
        "Do not change unrelated code.",
        "Click Run to test your solution.",
      ],
      files: {
        "client/src/Login.jsx": "function Login() {\n  return <h1>Login Page</h1>;\n}\n\nexport default Login;\n",
        "server/controllers/authController.js": "const login = (req, res) => {\n  // Login logic here\n};\n\nmodule.exports = { login };\n",
        "server/routes/authRoutes.js": "const express = require(\"express\");\n\nconst router = express.Router();\n\nmodule.exports = router;\n",
      },
    };

    return res.status(200).json({
      success: true,
      data: mockChallenge,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getRandomChallenge,
};