// File: src/StudentProfile/StudentProgress.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuUsers,
  LuBookOpen,
  LuBrain,
  LuMessageSquare,
  LuMegaphone,
  LuSettings,
  LuLogOut,
} from "react-icons/lu";
import "./StudentDetails.css";
import logo1 from "../../assets/1logo.png";

// local uploaded screenshot (will be transformed to URL by your environment)
const previewSnapshot = "/mnt/data/Screenshot 2025-11-22 at 11.05.10 AM.png";

export default function StudentProgress() {
  const navigate = useNavigate();
  const { state: student } = useLocation();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!student) return;
    // auto-refresh logs (reads activityLogs from localStorage)
    const interval = setInterval(() => {
      const allLogs = JSON.parse(localStorage.getItem("activityLogs")) || {};
      setLogs(allLogs[student.username] || []);
    }, 1000);
    return () => clearInterval(interval);
  }, [student]);

  if (!student) {
    return (
      <div style={{ padding: 40, color: "#fff" }}>
        <h2>Student not found</h2>
      </div>
    );
  }

  // helpers / mock derived stats (replace with real logic if you have it)
  const percent = (a, b) => (b === 0 ? 0 : Math.round((a / b) * 100));
  const formatDate = (ts) => (ts ? new Date(ts).toLocaleString() : "—");

  const xpToday = student.xpToday ?? 0;
  const xpWeek = student.xpWeek ?? 0;
  const xpToNext = student.xpToNext ?? Math.max(1000 - (student.xp % 1000), 100);
  const completion = student.completion ?? 0;
  const timeThisWeek = student.timeThisWeek ?? 0;

  const levelProgressPercent = percent(student.xp % 1000, 1000);

  const exportLogs = () => {
    let csv = "Type,Info,Value,Timestamp\n";
    logs.forEach((log) => {
      const ts = log.timestamp || "";
      if (log.type === "login") csv += `login,,,"${ts}"\n`;
      if (log.type === "logout")
        csv += `logout,Session Duration,${log.duration} min,"${ts}"\n`;
      if (log.type === "micro_lesson")
        csv += `micro_lesson,Lesson ${log.lessonId},"Score ${log.score}, XP ${log.xpEarned}","${ts}"\n`;
      if (log.type === "module_start")
        csv += `module_start,Module ${log.moduleId},Started,"${ts}"\n`;
      if (log.type === "module_progress")
        csv += `module_progress,Module ${log.moduleId},"Page ${log.currentPage}/${log.totalPages} (${log.percent}%)","${ts}"\n`;
      if (log.type === "module_end")
        csv += `module_end,Module ${log.moduleId},"Duration ${log.duration} min","${ts}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${student.username}_activity_logs.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo1} className="sidebar-logo" alt="logo" />
          <span className="sidebar-title">EduVerso Admin</span>
        </div>

        <ul className="sidebar-menu">
          <li onClick={() => navigate("/dashboard")}>
            <span className="menu-icon"><LuLayoutDashboard /></span>
            <span className="menu-text">Dashboard</span>
          </li>
          <li onClick={() => navigate("/students")} className="active">
            <span className="menu-icon"><LuUsers /></span>
            <span className="menu-text">Students</span>
          </li>
          <li onClick={() => navigate("/modules")}>
            <span className="menu-icon"><LuBookOpen /></span>
            <span className="menu-text">Modules</span>
          </li>
          <li>
            <span className="menu-icon"><LuBrain /></span>
            <span className="menu-text">Quiz Arena</span>
          </li>
          <li>
            <span className="menu-icon"><LuMessageSquare /></span>
            <span className="menu-text">Peer Feedback</span>
          </li>
          <li>
            <span className="menu-icon"><LuMegaphone /></span>
            <span className="menu-text">Announcements</span>
          </li>

          <div className="spacer" />

          <li>
            <span className="menu-icon"><LuSettings /></span>
            <span className="menu-text">Settings</span>
          </li>
          <li className="logout">
            <span className="menu-icon"><LuLogOut /></span>
            <span className="menu-text">Logout</span>
          </li>
        </ul>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        {/* top controls */}
        <div className="progress-top">
          <div className="left-controls">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>

          <div className="right-controls">
            <div className="last-login">Last login: {formatDate(student.lastLogin)}</div>
            <button className="export-btn" onClick={exportLogs}>
              📄 Export Logs
            </button>
          </div>
        </div>

        {/* student header card */}
        <section className="student-header-card">
          <div className="header-left">
            <img
              className="avatar-large"
              src={student.avatar || previewSnapshot}
              alt={`${student.username} avatar`}
            />
            <div className="meta">
              <h2 className="student-name">{student.username}</h2>
              <div className="student-sub">Grade {student.grade ?? "—"} · ID {student.id ?? "—"}</div>
            </div>
          </div>

          <div className="header-right">
            <div className="quick-stats">
              <div className="stat small">
                <div className="stat-label">XP</div>
                <div className="stat-value">{student.xp}</div>
                <div className="stat-sub">Today +{xpToday}</div>
              </div>

              <div className="stat small">
                <div className="stat-label">Level</div>
                <div className="stat-value">Lv {student.level}</div>
                <div className="stat-sub">Next in {xpToNext} XP</div>
              </div>

              <div className="stat small">
                <div className="stat-label">Streak</div>
                <div className="stat-value">🔥 {student.streak ?? 0}</div>
                <div className="stat-sub">This week {xpWeek} XP</div>
              </div>
            </div>

            <div className="level-progress">
              <div className="progress-row">
                <div className="progress-label">Progress to next level</div>
                <div className="progress-meta">{levelProgressPercent}%</div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${levelProgressPercent}%` }} />
              </div>
            </div>
          </div>
        </section>

        {/* dashboard metrics */}
        <section className="dashboard-block">
          <div className="cards-row">
            <div className="metric-card">
              <div className="metric-title">Completion</div>
              <div className="metric-big">{completion}%</div>
              <div className="metric-sub">Module completion rate</div>
            </div>

            <div className="metric-card">
              <div className="metric-title">Time Spent (week)</div>
              <div className="metric-big">{timeThisWeek} min</div>
              <div className="metric-sub">Sessions: {Math.max(1, Math.round(timeThisWeek / 30))}</div>
            </div>

            <div className="metric-card">
              <div className="metric-title">Last Module</div>
              <div className="metric-big">{student.lastModule ?? "—"}</div>
              <div className="metric-sub">Last opened {formatDate(student.lastModuleDate)}</div>
            </div>

            <div className="metric-card">
              <div className="metric-title">Achievements</div>
              <div className="achievement-list">
                {(student.achievements && student.achievements.length) ? (
                  student.achievements.slice(0, 3).map((a, i) => <span key={i} className="achievement">{a}</span>)
                ) : (
                  <span className="achievement muted">No badges yet</span>
                )}
              </div>
            </div>
          </div>

          <div className="cards-row lower">
            <div className="wide-card">
              <div className="wide-title">Recent mini-tests</div>
              <div className="mini-tests">
                {(student.tests && student.tests.length) ? (
                  student.tests.slice(0, 4).map((t, i) => (
                    <div className="mini-test" key={i}>
                      <div>
                        <div className="mt-name">{t.name}</div>
                        <div className="mt-date">{formatDate(t.date)}</div>
                      </div>
                      <div className="mt-score">{t.score}%</div>
                    </div>
                  ))
                ) : (
                  <div className="muted">No tests yet</div>
                )}
              </div>
            </div>

            <div className="wide-card">
              <div className="wide-title">Activity snapshot</div>
              <div className="snapshot">
                <img src={previewSnapshot} alt="snapshot" className="snapshot-img" />
              </div>
            </div>
          </div>
        </section>

        {/* info + logs */}
        <section className="info-and-logs">
          <div className="info-panel">
            <h3>Student Information</h3>
            <div className="info-box">
              <p><strong>XP:</strong> {student.xp}</p>
              <p><strong>Streak:</strong> {student.streak ?? 0}</p>
              <p><strong>Level:</strong> {student.level}</p>
              <p className="muted">Student ID: {student.id ?? "—"}</p>
            </div>
          </div>

          <div className="logs-panel">
            <h3>Real-Time Activity Logs</h3>
            <div className="logs-list">
              {logs.length === 0 ? (
                <p className="no-logs">No activity yet.</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="log-item">
                    <div className="log-time">{formatDate(log.timestamp)}</div>
                    <div className="log-desc">
                      {log.type === "login" && <>🟢 <strong>Login</strong></>}
                      {log.type === "logout" && <>🔴 <strong>Logout</strong> — Duration: {log.duration} min</>}
                      {log.type === "micro_lesson" && <>⚡ <strong>Micro Lesson {log.lessonId}</strong> — Score {log.score}, XP {log.xpEarned}</>}
                      {log.type === "module_start" && <>📘 <strong>Started module {log.moduleId}</strong></>}
                      {log.type === "module_progress" && <>📄 <strong>Module progress</strong> — {log.percent}%</>}
                      {log.type === "module_end" && <>✅ <strong>Module finished</strong> — Duration {log.duration} min</>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
