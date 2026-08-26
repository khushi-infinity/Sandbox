import { useEffect, useState } from "react";
import FileExplorer from "../components/FileExplorer";
import CodeEditor from "../components/CodeEditor";
import TestResults from "../components/TestResults";

function ChallengeWorkspace() {
    const [terminalHeight, setTerminalHeight] = useState(150);
    
  const [challenge, setChallenge] = useState({
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
    "client/src/Login.jsx": `function Login() {
  return <h1>Login Page</h1>;
}

export default Login;
`,
    "server/controllers/authController.js": `const login = (req, res) => {
  // Login logic here
};

module.exports = { login };
`,
    "server/routes/authRoutes.js": `const express = require("express");

const router = express.Router();

module.exports = router;
`,
  },
});

  const [selectedFile, setSelectedFile] = useState(
  "client/src/Login.jsx"
);
const [result, setResult] = useState(null);
const [isRunning, setIsRunning] = useState(false);
  function handleCodeChange(newCode) {
  setChallenge((previousChallenge) => ({
    ...previousChallenge,
    files: {
      ...previousChallenge.files,
      [selectedFile]: newCode || "",
    },
  }));
}
useEffect(() => {
  async function fetchChallenge() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/challenges/random"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch challenge");
      }

      const data = await response.json();

      setChallenge(data);

      const firstFile = Object.keys(data.files)[0];

      if (firstFile) {
        setSelectedFile(firstFile);
      }
    } catch (error) {
      console.error("Failed to fetch challenge:", error);
    }
  }

  fetchChallenge();
}, []);
async function handleRun() {
  try {
    setIsRunning(true);
    setResult(null);

    const response = await fetch(
      "http://localhost:5000/api/challenges/run",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeId: challenge.challengeId,
          files: challenge.files,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to run challenge");
    }


    const data = await response.json();

    setResult(data);
  } catch (error) {
    console.error("Failed to run challenge:", error);

    setResult({
      passed: false,
      message: "Something went wrong while running the challenge.",
    });
  } finally {
    setIsRunning(false);
  }
}
function getLanguage(fileName) {
  if (fileName.endsWith(".jsx")) return "javascript";
  if (fileName.endsWith(".js")) return "javascript";
  if (fileName.endsWith(".json")) return "json";
  if (fileName.endsWith(".css")) return "css";
  if (fileName.endsWith(".html")) return "html";

  return "plaintext";
}
function startResize(e) {
  e.preventDefault();

  function resize(e) {
    const newHeight = window.innerHeight - e.clientY;

    if (newHeight >= 70 && newHeight <= 500) {
      setTerminalHeight(newHeight);
    }
  }

  function stopResize() {
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
  }

  document.addEventListener("mousemove", resize);
  document.addEventListener("mouseup", stopResize);
}
  return (
  <div className="workspace">
    <header className="topbar">
      <div className="logo">SANDBOX</div>

     <div className="challenge-name">
  {challenge.title}
</div>

    <button
  className="run-button"
  onClick={handleRun}
  disabled={isRunning}
>
  {isRunning ? "Running..." : "▶ Run"}
</button>
    </header>

    <div className="workspace-content">
      <div className="sidebar">
        <FileExplorer
          files={challenge.files}
          selectedFile={selectedFile}
          onSelectFile={setSelectedFile}
        />
      </div>
      <div className="challenge-panel">
  <h2>{challenge.title}</h2>

  <h3>Problem</h3>

  <p>
  {challenge.description}
  </p>

  <h3>Requirements</h3>

  <ul>
   {challenge.requirements.map((requirement, index) => (
    <li key={index}>{requirement}</li>
  ))}
  </ul>
</div>

      <div className="editor-area">
        <h3>{selectedFile}</h3>

        <div className="editor-container">
   <CodeEditor
          code={challenge.files[selectedFile]}
          onChange={handleCodeChange}
          language={getLanguage(selectedFile)}
        />
        </div>
      </div>
    </div>
   <div
  className="resize-handle"
  onMouseDown={startResize}
></div>

<div
  className="terminal-panel"
  style={{ height: `${terminalHeight}px` }}
>
  <TestResults
    result={result}
    isRunning={isRunning}
  />
</div>
  </div>
);
}

export default ChallengeWorkspace;