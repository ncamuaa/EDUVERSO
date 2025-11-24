import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

import { FaBell, FaMoon, FaSun, FaBars } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

import { getStudentStats } from "../../data/stats";
import logo from "../../assets/1logo.png";
import "./AdminDashboard.css";

const sampleXPTrend = [
  { date: "Mon", xp: 120 },
  { date: "Tue", xp: 200 },
  { date: "Wed", xp: 150 },
  { date: "Thu", xp: 240 },
  { date: "Fri", xp: 300 },
  { date: "Sat", xp: 250 },
  { date: "Sun", xp: 280 },
];

const sampleUsage = [
  { module: "Modules", value: 420 },
  { module: "Quiz Arena", value: 260 },
  { module: "Peer Feedback", value: 190 },
  { module: "Announcements", value: 120 },
];

function StatCard({ title, value, icon }) {
  return (
    <motion.div className="stat-card" whileHover={{ scale: 1.03 }}>
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("admin_logged_in") !== "true") {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("admin-dark", dark);
  }, [dark]);

  // GLOBAL STUDENT STATS
  const { total, avgXP, activeToday, completion } = getStudentStats();

  return (
    <div className={`admin-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>

      {/* SIDEBAR */}
      {sidebarCollapsed && (
        <button className="sidebar-open-btn" onClick={() => setSidebarCollapsed(false)}>
          <FaBars />
        </button>
      )}

      <motion.aside className="sidebar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="sidebar-top">
          <div className="sidebar-header">
            <img src={logo} className="sidebar-logo" alt="logo" />
            <span className="sidebar-title">EduVerso Admin</span>
          </div>

          <button className="sidebar-collapse-btn" onClick={() => setSidebarCollapsed((s) => !s)}>
            <FaBars />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li onClick={() => (window.location.href = "/dashboard")}>
            <LuLayoutDashboard className="menu-icon" />
            <span className="menu-text">Dashboard</span>
          </li>

          <li onClick={() => (window.location.href = "/students")}>
            <LuUsers className="menu-icon" />
            <span className="menu-text">Students</span>
          </li>

          {/* ⭐ UPDATED — now navigates to AdminModules */}
          <li onClick={() => (window.location.href = "/admin-modules")}>
            <LuBookOpen className="menu-icon" />
            <span className="menu-text">Modules</span>
          </li>

          <li><LuBrain className="menu-icon" /><span className="menu-text">Quiz Arena</span></li>
          <li onClick={() => (window.location.href = "/admin-peerfeedback")}>
  <LuMessageSquare className="menu-icon" />
  <span className="menu-text">Peer Feedback</span>
</li>

         <li onClick={() => (window.location.href = "/admin-announcements")}>
  <LuMegaphone className="menu-icon" />
  <span className="menu-text">Announcements</span>
</li>

          <div className="spacer" />

          <li onClick={() => (window.location.href = "/admin-settings")}>
            <LuBookOpen className="menu-icon" />
            <span className="menu-text">Setting</span>
          </li>
          <li className="logout"><LuLogOut className="menu-icon" /><span className="menu-text">Logout</span></li>
        </ul>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="main-inner">

          {/* TOPBAR */}
          <header className="topbar">
            <div className="search-bar">
              <svg width="18" height="18" className="search-icon" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="20" y1="20" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
              </svg>
              <input placeholder="Search anything..." />
            </div>

            <div className="floating-actions">
              <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
                <FaBell />
              </button>

              <button className="icon-btn" onClick={() => setDark(!dark)}>
                {dark ? <FaMoon /> : <FaSun />}
              </button>

              <button className="icon-btn"><AiOutlineUser /></button>
            </div>

            {notifOpen && (
              <motion.div className="notif-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h4>Notifications</h4>
                <p>New student joined: Maria</p>
              </motion.div>
            )}
          </header>

          {/* STATS */}
          <section className="dashboard-grid">
            <div className="left-grid">
              <div className="stats-row">
                <StatCard title="Total Students" value={total} icon={<LuUsers />} />
                <StatCard title="Active Today" value={activeToday} icon={<LuBrain />} />
                <StatCard title="Avg XP" value={avgXP} icon={<LuMessageSquare />} />
                <StatCard title="Completion" value={`${completion}%`} icon={<LuSettings />} />
              </div>

              <div className="two-cards">
                <div className="info-card">
                  <h3>📊 Admin Overview</h3>
                  <p>Manage users, announcements & analytics.</p>
                  <div className="info-actions">
                    <button onClick={() => (window.location.href = "/students")}>
                      View students
                    </button>
                    <button>Make announcement</button>
                  </div>
                </div>

                <div className="info-card">
                  <h3>🧩 Platform Insights</h3>
                  <p>Detailed module and activity insights.</p>
                </div>
              </div>

              <div className="wide-card">
                <h3>🎓 Student Progress Monitor</h3>
                <p>Track XP, modules, and completed tasks.</p>
              </div>
            </div>

            <div className="right-grid">
              <div className="chart-card">
                <h4>XP Trend (7 days)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={sampleXPTrend}>
                    <Area type="monotone" dataKey="xp" stroke="#9c7cff" fill="#9c7cff33" />
                    <XAxis dataKey="date" /><YAxis /><Tooltip />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h4>Module usage (weekly)</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={sampleUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="module" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8f63ff" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
