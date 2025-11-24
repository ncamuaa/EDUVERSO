import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  LuLayoutDashboard,
  LuUsers,
  LuBookOpen,
  LuBrain,
  LuMessageSquare,
  LuMegaphone,
  LuSettings,
  LuLogOut
} from "react-icons/lu";
import { FaBars } from "react-icons/fa";

import logo1 from "../../assets/1logo.png";
import { users } from "../../data/users";
import { getStudentStats } from "../../data/stats";
import "./StudentList.css";

export default function StudentList() {
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name-asc");

  useEffect(() => {
    document.documentElement.classList.add("admin-dark");
    return () => document.documentElement.classList.remove("admin-dark");
  }, []);

  // COMPUTED GLOBAL STATS
  const { total, avgXP, activeToday, completion } = getStudentStats();

  // FILTER LIST
  const filtered = users
    .filter(
      (u) =>
        u.role === "student" &&
        u.username.toLowerCase().includes(search.toLowerCase())
    )
    .slice();

  // SORT
  filtered.sort((a, b) => {
    if (sort === "name-asc") return a.username.localeCompare(b.username);
    if (sort === "name-desc") return b.username.localeCompare(a.username);
    if (sort === "xp-desc") return b.xp - a.xp;
    if (sort === "xp-asc") return a.xp - b.xp;
    return 0;
  });

  return (
    <div className={`admin-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo1} className="sidebar-logo" alt="logo" />
          {!sidebarCollapsed && <span className="sidebar-title">EduVerso Admin</span>}

          <button className="sidebar-collapse-btn" onClick={() => setSidebarCollapsed((p) => !p)}>
            <FaBars />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li onClick={() => navigate("/dashboard")}>
            <LuLayoutDashboard /> {!sidebarCollapsed && "Dashboard"}
          </li>
          <li className="active">
            <LuUsers /> {!sidebarCollapsed && "Students"}
          </li>
           <li onClick={() => navigate("/admin-modules")}>
    <LuBookOpen /> {!sidebarCollapsed && "Modules"}
  </li>
          <li><LuBrain /> {!sidebarCollapsed && "Quiz Arena"}</li>
          <li><LuMessageSquare /> {!sidebarCollapsed && "Peer Feedback"}</li>
          <li><LuMegaphone /> {!sidebarCollapsed && "Announcements"}</li>
          <div className="spacer" />
          <li><LuSettings /> {!sidebarCollapsed && "Settings"}</li>
          <li><LuLogOut /> {!sidebarCollapsed && "Logout"}</li>
        </ul>
      </aside>

      {/* RIGHT WRAPPER */}
      <div className="right-wrapper">
        <main className="main-content">
          <div className="main-content-box">
            <div className="content-inner">

              <button className="back-btn" onClick={() => navigate("/admin-dashboard")}>
                ← Back
              </button>

              <h2 className="title">📁 Student Progress Monitor</h2>

              {/* CONTROLS */}
              <div className="top-controls">
                <input
                  className="search-input"
                  placeholder="Search Name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="name-asc">Name (A–Z)</option>
                  <option value="name-desc">Name (Z–A)</option>
                  <option value="xp-desc">XP (High → Low)</option>
                  <option value="xp-asc">XP (Low → High)</option>
                </select>
              </div>

              {/* SYNCED STATS */}
              <div className="stats-row">
                <div className="stat-box"><div className="stat-title">Total Students</div><div className="stat-value">{total}</div></div>
                <div className="stat-box"><div className="stat-title">Active Today</div><div className="stat-value">{activeToday}</div></div>
                <div className="stat-box"><div className="stat-title">Avg XP</div><div className="stat-value">{avgXP}</div></div>
                <div className="stat-box"><div className="stat-title">Completion</div><div className="stat-value">{completion}%</div></div>
              </div>

              {/* STUDENT GRID */}
              <div className="student-grid">
                {filtered.map((student) => (
                  <motion.div
                    key={student.username}
                    className="student-card old-design"
                    whileHover={{ scale: 1.03 }}
                  >
                    <div
                      className="card-media"
                      onClick={() =>
                        navigate(`/students/${student.username}`, { state: student })
                      }
                    >
                      <img src={student.avatar} className="student-img old-img" alt="" />
                    </div>

                    <div className="student-name">{student.username}</div>
                    <div className="student-stats">XP: {student.xp} • Level {student.level} • 🔥 {student.streak}</div>

                    <div className="card-actions">
  <button
    className="btn ghost"
    onClick={() =>
      navigate(`/students/${student.username}`, { state: student })
    }
  >
    View
  </button>

  <button className="btn main">Export</button>
</div>


                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
