/* ---------------------------------------
   LOGIN + LOGOUT TRACKING
----------------------------------------*/

export function logLogin(username) {
  if (!username) return;
  const logs = JSON.parse(localStorage.getItem("activityLogs") || "{}");

  if (!logs[username]) logs[username] = [];

  logs[username].push({
    type: "login",
    timestamp: new Date().toISOString(),
  });

  localStorage.setItem("sessionStart", Date.now().toString());
  localStorage.setItem("activityLogs", JSON.stringify(logs));
}

export function logLogout(username) {
  if (!username) return;
  const logs = JSON.parse(localStorage.getItem("activityLogs") || "{}");

  if (!logs[username]) logs[username] = [];

  const start = parseInt(localStorage.getItem("sessionStart") || "0", 10);
  const duration = start
    ? Math.max(1, Math.round((Date.now() - start) / 60000))
    : 1;

  logs[username].push({
    type: "logout",
    timestamp: new Date().toISOString(),
    duration,
  });

  localStorage.setItem("activityLogs", JSON.stringify(logs));
  localStorage.removeItem("sessionStart");
}

/* ---------------------------------------
   MICRO LESSON TRACKING
----------------------------------------*/

export function logMicroActivity(username, lessonId, score, xpEarned) {
  if (!username || !lessonId) return;

  const logs = JSON.parse(localStorage.getItem("activityLogs") || "{}");

  if (!logs[username]) logs[username] = [];

  logs[username].push({
    type: "micro_lesson",
    lessonId,
    score,
    xpEarned,
    timestamp: new Date().toISOString(),
  });

  localStorage.setItem("activityLogs", JSON.stringify(logs));
}

/* ---------------------------------------
   MODULE TRACKING
----------------------------------------*/

export function logModuleStart(username, moduleId) {
  if (!username || !moduleId) return;
  const logs = JSON.parse(localStorage.getItem("activityLogs") || "{}");

  if (!logs[username]) logs[username] = [];
  logs[username].push({
    type: "module_start",
    moduleId,
    timestamp: new Date().toISOString(),
  });

  localStorage.setItem("module_start_time", Date.now().toString());
  localStorage.setItem("activityLogs", JSON.stringify(logs));
}

export function logModuleProgress(username, moduleId, currentPage, totalPages) {
  if (!username || !moduleId) return;

  const percent = Math.round((currentPage / totalPages) * 100);

  const logs = JSON.parse(localStorage.getItem("activityLogs") || "{}");
  if (!logs[username]) logs[username] = [];

  logs[username].push({
    type: "module_progress",
    moduleId,
    currentPage,
    totalPages,
    percent,
    timestamp: new Date().toISOString(),
  });

  localStorage.setItem("activityLogs", JSON.stringify(logs));
}

export function logModuleEnd(username, moduleId) {
  if (!username || !moduleId) return;

  const logs = JSON.parse(localStorage.getItem("activityLogs") || "{}");
  if (!logs[username]) logs[username] = [];

  const start = parseInt(localStorage.getItem("module_start_time") || "0", 10);
  const duration = start
    ? Math.max(1, Math.round((Date.now() - start) / 60000))
    : 1;

  logs[username].push({
    type: "module_end",
    moduleId,
    duration,
    timestamp: new Date().toISOString(),
  });

  localStorage.setItem("activityLogs", JSON.stringify(logs));
  localStorage.removeItem("module_start_time");
}

/* ---------------------------------------
   READ LOGS
----------------------------------------*/

export function getActivityLogs(username) {
  const logs = JSON.parse(localStorage.getItem("activityLogs") || "{}");
  return logs[username] || [];
}
