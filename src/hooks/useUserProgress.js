export const XP_FOR_NEXT_LEVEL = 200;

export function computeLevel(xp) {
  return Math.floor(xp / XP_FOR_NEXT_LEVEL) + 1;
}

export function getUserProgress(username) {
  const streak = parseInt(localStorage.getItem(`streak_${username}`)) || 0;
  const xp = parseInt(localStorage.getItem(`xp_${username}`)) || 0;
  return { streak, xp, level: computeLevel(xp) };
}

export function updateProgressOnLogin(username, { streakDelta = 1, xpDelta = 50 } = {}) {
  const streakKey = `streak_${username}`;
  const xpKey = `xp_${username}`;
  const streak = (parseInt(localStorage.getItem(streakKey)) || 0) + streakDelta;
  const xp = (parseInt(localStorage.getItem(xpKey)) || 0) + xpDelta;
  localStorage.setItem(streakKey, streak);
  localStorage.setItem(xpKey, xp);
}

export function getCurrentUser() {
  return localStorage.getItem("username") || "User";
}
