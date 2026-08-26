const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const DAILY_LIMIT = parseInt(process.env.DAILY_LIMIT || "5", 10);

/**
 * Returns today's date as "YYYY-MM-DD" in Indian Standard Time,
 * so the daily limit resets at midnight IST no matter where
 * the server is deployed (Render/Railway servers are usually in UTC).
 */
function todayIST() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // never returned in queries unless explicitly asked
    },
    role: {
      type: String,
      enum: ["student", "company", "admin"],
      default: "student",
    },

    // ---- Daily progress tracking ----
    solvedToday: { type: Number, default: 0 },
    lastSolvedDate: { type: String, default: null }, // "YYYY-MM-DD" (IST)
    totalSolved: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with stored hash
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/**
 * If the stored lastSolvedDate is not today (IST), reset the counter.
 * This is "lazy reset" — no cron job needed. It runs whenever
 * progress is read or a submission comes in.
 * Returns true if a reset happened (caller should save()).
 */
userSchema.methods.resetDailyIfNeeded = function () {
  const today = todayIST();
  if (this.lastSolvedDate !== today) {
    this.solvedToday = 0;
    this.lastSolvedDate = today;
    return true;
  }
  return false;
};

/**
 * Record one successful submission.
 * Throws if the daily limit is already reached.
 */
userSchema.methods.recordSolve = function () {
  this.resetDailyIfNeeded();
  if (this.solvedToday >= DAILY_LIMIT) {
    const err = new Error(`Daily limit of ${DAILY_LIMIT} challenges reached. Come back tomorrow!`);
    err.statusCode = 429;
    throw err;
  }
  this.solvedToday += 1;
  this.totalSolved += 1;
};

userSchema.methods.progressSummary = function () {
  return {
    solvedToday: this.solvedToday,
    dailyLimit: DAILY_LIMIT,
    remainingToday: Math.max(0, DAILY_LIMIT - this.solvedToday),
    limitReached: this.solvedToday >= DAILY_LIMIT,
    totalSolved: this.totalSolved,
    date: todayIST(),
  };
};

module.exports = mongoose.model("User", userSchema);
module.exports.DAILY_LIMIT = DAILY_LIMIT;
module.exports.todayIST = todayIST;
