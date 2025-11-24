// src/data/stats.js
import { users } from "./users";

/**
 * Returns computed stats derived from users array.
 * Tweak formulas (activeToday / completion) to fit your real logic.
 */
export function getStudentStats() {
  const students = users.filter((u) => u.role === "student");

  const total = students.length;

  const avgXP =
    students.length === 0
      ? 0
      : Math.round(students.reduce((sum, s) => sum + (s.xp || 0), 0) / students.length);

  // Example rule: "active today" = students with streak > 0
  const activeToday = students.filter((s) => (s.streak || 0) > 0).length;

  // Example completion heuristic: percent of avgXP relative to a target (1000)
  // Adjust target to a realistic maximum for your app.
  const completion = Math.min(100, Math.round((avgXP / 1000) * 100));

  return {
    total,
    avgXP,
    activeToday,
    completion,
  };
}
