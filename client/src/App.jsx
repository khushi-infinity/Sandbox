import { useEffect, useState } from "react";

import ChallengeWorkspace from "./pages/ChallengeWorkspace";
import Leaderboard from "./pages/Leaderboard";
import PracticedChallenges from "./pages/PracticedChallenges";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [page, setPage] = useState(() => {
    const token = localStorage.getItem("token");

    return token ? "challenge" : "login";
  });

  const [menuOpen, setMenuOpen] = useState(false);

  const [selectedChallenge, setSelectedChallenge] =
    useState(null);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  // =========================
  // KEEP USER PROGRESS UPDATED
  // =========================

  useEffect(() => {
    function updateUser() {
      const savedUser =
        localStorage.getItem("user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }

    window.addEventListener(
      "userUpdated",
      updateUser
    );

    return () => {
      window.removeEventListener(
        "userUpdated",
        updateUser
      );
    };
  }, []);

  // =========================
  // NAVIGATION
  // =========================

  function changePage(newPage) {
    setPage(newPage);
    setMenuOpen(false);
  }

  // =========================
  // LOGIN
  // =========================

  function handleLogin() {
    const savedUser =
      localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setSelectedChallenge(null);
    setMenuOpen(false);
    setPage("challenge");
  }

  // =========================
  // PRACTICE AGAIN
  // =========================

  function handlePractice(challenge) {
    setSelectedChallenge(challenge);
    setMenuOpen(false);
    setPage("challenge");
  }

  // =========================
  // LOGOUT
  // =========================

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setSelectedChallenge(null);
    setMenuOpen(false);

    setPage("login");
  }

  return (
    <>
      {/* ================= LOGIN ================= */}

      {page === "login" && (
        <Login
          onSignup={() => setPage("signup")}
          onLogin={handleLogin}
        />
      )}

      {/* ================= SIGNUP ================= */}

      {page === "signup" && (
        <Signup
          onLogin={() => setPage("login")}
        />
      )}

      {/* ================= MAIN APP ================= */}

      {page !== "login" &&
        page !== "signup" && (
          <>
            {/* ================= HEADER ================= */}

            <div className="app-header">

              <div className="sandbox-menu">

                <button
                  className="sandbox-button"
                  onClick={() =>
                    setMenuOpen((previous) => !previous)
                  }
                >
                  SANDBOX
                </button>

                {/* DROPDOWN ONLY OPENS WHEN CLICKED */}

                {menuOpen && (
                  <div className="dropdown-menu">

                    <button
                      onClick={() =>
                        changePage("challenge")
                      }
                    >
                      🧩 Challenges
                    </button>

                    <button
                      onClick={() =>
                        changePage("leaderboard")
                      }
                    >
                      🏆 Leaderboard
                    </button>

                    <button
                      onClick={() =>
                        changePage("practiced")
                      }
                    >
                      ✓ Practiced
                    </button>

                    <button
                      onClick={handleLogout}
                    >
                      Logout
                    </button>

                  </div>
                )}

              </div>

              {/* SOLVED COUNT */}

              {user?.progress && (
                <div className="user-progress">
                  <span className="solved-label">
                    Solved:
                  </span>

                  <span className="solved-count">
                    {user.progress.totalSolved}
                  </span>
                </div>
              )}

            </div>

            {/* ================= CHALLENGES ================= */}

            {page === "challenge" && (
              <ChallengeWorkspace
                selectedChallenge={
                  selectedChallenge
                }
              />
            )}

            {/* ================= LEADERBOARD ================= */}

            {page === "leaderboard" && (
              <Leaderboard />
            )}

            {/* ================= PRACTICED ================= */}

            {page === "practiced" && (
              <PracticedChallenges
                onPractice={handlePractice}
              />
            )}

          </>
        )}
    </>
  );
}

export default App;