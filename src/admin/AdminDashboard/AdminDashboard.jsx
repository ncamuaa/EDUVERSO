// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState, useRef } from "react";

import { motion } from "framer-motion";

import {
  LuLayoutDashboard,
  LuUsers,
  LuBookOpen,
  LuSettings,
  LuLogOut,
  LuMessageSquare,
  LuBrain,
  LuMegaphone,
} from "react-icons/lu";

import { FaBell, FaMoon, FaSun, FaBars } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { LuGamepad2 } from "react-icons/lu";


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

import logo from "../../assets/1logo.png";
import "./AdminDashboard.css";

const API_BASE = "http://192.168.100.180:5001";


const safe = (v) => (Number.isFinite(v) ? v : 0);

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dark, setDark] = useState(true);

  const [totalStudents, setTotalStudents] = useState(0);
  const [activeToday, setActiveToday] = useState(0);
  const [avgXP, setAvgXP] = useState(0);
  const [completion, setCompletion] = useState(0);

  const [xpTrend, setXpTrend] = useState([]);
  const [moduleUsage, setModuleUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);

  // Protect route
  useEffect(() => {
    if (localStorage.getItem("admin_logged_in") !== "true") {
      window.location.href = "/login";
    }
  }, []);

  // dark mode class toggle
  useEffect(() => {
    document.documentElement.classList.toggle("admin-dark", dark);
  }, [dark]);

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    window.location.href = "/login";
  };

  const fetchJson = async (url) => {
    const r = await fetch(url);
    if (!r.ok) throw new Error(url);
    return r.json();
  };

  async function loadStats() {
    setLoading(true);
    try {
      const [
        total,
        active,
        avg,
        comp,
        trend,
        usage,
      ] = await Promise.all([
        fetchJson(`${API_BASE}/admin/total-students`).catch(() => ({ total: 0 })),
        fetchJson(`${API_BASE}/admin/active-today`).catch(() => ({ activeToday: 0 })),
        fetchJson(`${API_BASE}/admin/average-xp`).catch(() => ({ avgXP: 0 })),
        fetchJson(`${API_BASE}/admin/completion`).catch(() => ({ completion: 0 })),
        fetchJson(`${API_BASE}/admin/xp-trend`).catch(() => ({ trend: [] })),
        fetchJson(`${API_BASE}/admin/module-usage`).catch(() => ({ usage: [] })),
      ]);

      setTotalStudents(safe(total.total));
      setActiveToday(safe(active.activeToday));
      setAvgXP(safe(avg.avgXP));
      setCompletion(safe(comp.completion));

      setXpTrend(trend.trend || []);
      setModuleUsage(usage.usage || []);
    } catch (err) {
      console.error("DASHBOARD ERROR:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadStats();
    pollRef.current = setInterval(loadStats, 30000);
    return () => clearInterval(pollRef.current);
  }, []);

  const xpTrendData =
    xpTrend.length > 0
      ? xpTrend
      : [
          { date: "Mon", xp: 120 },
          { date: "Tue", xp: 180 },
          { date: "Wed", xp: 160 },
          { date: "Thu", xp: 220 },
          { date: "Fri", xp: 260 },
        ];

  const moduleUsageData =
    moduleUsage.length > 0
      ? moduleUsage
      : [
          { module: "Modules", value: 320 },
          { module: "Quiz Arena", value: 200 },
          { module: "Peer FB", value: 160 },
          { module: "Announcements", value: 110 },
        ];

  const StatCard = ({ title, value, icon }) => (
    <motion.div className="adm-stat-card" whileHover={{ scale: 1.03 }}>
      <div className="adm-stat-icon">{icon}</div>
      <div>
        <div className="adm-stat-title">{title}</div>
        <div className="adm-stat-value">{value}</div>
      </div>
    </motion.div>
  );

  return (
    <div className={`admin-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* Sidebar open floating button (shown when collapsed) */}
      {sidebarCollapsed && (
        <button
          className="sidebar-open-btn"
          onClick={() => setSidebarCollapsed(false)}
        >
          <FaBars />
        </button>
      )}

      {/* SIDEBAR (copied style from AdminAnnouncements) */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-header">
            <img src={logo} className="sidebar-logo" alt="logo" />
            <span className="sidebar-title">EduVerso Admin</span>
          </div>

          <button
            className="sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed((p) => !p)}
          >
            <FaBars />
          </button>
        </div>

       <ul className="sidebar-menu">
  <li
    className="active"
    onClick={() => (window.location.href = "/dashboard")}
  >
    <LuLayoutDashboard className="menu-icon" /> Dashboard
  </li>

  <li onClick={() => (window.location.href = "/students")}>
    <LuUsers className="menu-icon" /> Students
  </li>

  <li onClick={() => (window.location.href = "/admin-modules")}>
    <LuBookOpen className="menu-icon" /> Modules
  </li>

  {/* ✅ FIXED: GAMES ARENA */}
  <li onClick={() => (window.location.href = "/admin-games")}>
    <LuGamepad2 className="menu-icon" /> Games Arena
  </li>



  <li onClick={() => (window.location.href = "/admin-peerfeedback")}>
    <LuMessageSquare className="menu-icon" /> Peer Feedback
  </li>

  <li onClick={() => (window.location.href = "/admin-announcements")}>
    <LuMegaphone className="menu-icon" /> Announcements
  </li>

  <div className="spacer"></div>

  <li onClick={() => (window.location.href = "/admin-settings")}>
    <LuSettings className="menu-icon" /> Settings
  </li>

  <li className="logout" onClick={handleLogout}>
    <LuLogOut className="menu-icon" /> Logout
  </li>
</ul>

      </aside>

      {/* MAIN CONTENT (keeps previous dashboard layout) */}
      <main className="admin-ann-container">
        <div className="ann-main-box-dashboard">
          {/* TOPBAR */}
          <div className="ann-top-row" style={{ justifyContent: "flex-end", gap: 12 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                className="icon-btn"
                onClick={() => setNotifOpen((x) => !x)}
                aria-label="notifications"
              >
                <FaBell />
              </button>

              <button
                className="icon-btn"
                onClick={() => setDark((x) => !x)}
                aria-label="toggle-theme"
              >
                {dark ? <FaMoon /> : <FaSun />}
              </button>

              <button className="icon-btn" aria-label="user">
                <AiOutlineUser />
              </button>
            </div>
          </div>

          {/* DASHBOARD INNER */}
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
              {/* LEFT COLUMN */}
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                  <StatCard title="Total Students" value={loading ? "…" : totalStudents} icon={<LuUsers />} />
                  <StatCard title="Active Today" value={loading ? "…" : activeToday} icon={<LuBrain />} />
                  <StatCard title="Average XP" value={loading ? "…" : avgXP} icon={<LuBookOpen />} />
                  <StatCard title="Completion" value={loading ? "…" : `${completion}%`} icon={<LuSettings />} />
                </div>

                <div style={{ marginTop: 18, background: "rgba(255,255,255,0.04)", padding: 18, borderRadius: 12 }}>
                  <h3 style={{ margin: 0 }}>📌 System Overview</h3>
                  <p style={{ marginTop: 8, color: "rgba(255,255,255,0.8)" }}>
                    High-level metrics for activity, XP growth and module usage.
                  </p>
                </div>

                <div style={{ marginTop: 18, background: "rgba(255,255,255,0.04)", padding: 18, borderRadius: 12 }}>
                  <h3 style={{ margin: 0 }}>📖 Module Performance Summary</h3>
                  <p style={{ marginTop: 8, color: "rgba(255,255,255,0.8)" }}>
                    See which modules have the highest engagement.
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN - charts */}
              <div>
                <div style={{ marginBottom: 18, background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 12 }}>
                  <h4 style={{ margin: 0 }}>XP Trend</h4>
                  <div style={{ height: 220, marginTop: 8 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={xpTrendData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="xp" stroke="#8f63ff" fill="#8f63ff33" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 12 }}>
                  <h4 style={{ margin: 0 }}>Module Usage</h4>
                  <div style={{ height: 220, marginTop: 8 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={moduleUsageData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="module" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#9b5bff" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* optional notif panel */}
        {notifOpen && (
          <motion.div
            className="ann-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ position: "fixed", right: 36, top: 96, width: 320, zIndex: 1200 }}
          >
            <div style={{ background: "#0b0b16", padding: 12, borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
              <h4 style={{ margin: 0 }}>Notifications</h4>
              <p style={{ marginTop: 8 }}>No new notifications</p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

