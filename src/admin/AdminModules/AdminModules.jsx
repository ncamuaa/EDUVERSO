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

import { FaBars, FaPlus } from "react-icons/fa";

import logo from "../../assets/1logo.png";
import "./AdminModules.css";

export default function AdminModules() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sample modules (replace with Firebase later)
  const [modules, setModules] = useState([
    { id: 1, title: "Biology Basics", lessons: 12, updated: "2 days ago" },
    { id: 2, title: "Physics Fundamentals", lessons: 9, updated: "5 days ago" },
    { id: 3, title: "Chemistry Elements", lessons: 15, updated: "1 week ago" },
    { id: 4, title: "Earth Science", lessons: 10, updated: "3 days ago" },
  ]);

  useEffect(() => {
    document.documentElement.classList.add("admin-dark");
    return () => document.documentElement.classList.remove("admin-dark");
  }, []);

  return (
    <div className={`admin-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} className="sidebar-logo" alt="logo" />
          {!sidebarCollapsed && <span className="sidebar-title">EduVerso Admin</span>}

          <button className="sidebar-collapse-btn" onClick={() => setSidebarCollapsed(p => !p)}>
            <FaBars />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li onClick={() => navigate("/dashboard")}>
            <LuLayoutDashboard />
            {!sidebarCollapsed && "Dashboard"}
          </li>

          <li onClick={() => navigate("/students")}>
            <LuUsers />
            {!sidebarCollapsed && "Students"}
          </li>

          <li className="active">
            <LuBookOpen />
            {!sidebarCollapsed && "Modules"}
          </li>

          <li><LuBrain /> {!sidebarCollapsed && "Quiz Arena"}</li>
          <li><LuMessageSquare /> {!sidebarCollapsed && "Peer Feedback"}</li>
          <li><LuMegaphone /> {!sidebarCollapsed && "Announcements"}</li>

          <div className="spacer" />

          <li><LuSettings /> {!sidebarCollapsed && "Settings"}</li>
          <li><LuLogOut /> {!sidebarCollapsed && "Logout"}</li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <div className="right-wrapper">
        <main className="main-content">
          <div className="main-content-box">
            <div className="modules-header">
              <h2>📚 Admin Modules</h2>
              <button className="add-btn">
                <FaPlus /> Add Module
              </button>
            </div>

            <p className="modules-sub">
              Manage learning modules, lessons, and updates for students.
            </p>

            {/* MODULE LIST */}
            <div className="modules-grid">
              {modules.map((m) => (
                <motion.div
                  key={m.id}
                  className="module-card"
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="module-title">{m.title}</h3>
                  <p className="module-meta">
                    Lessons: <strong>{m.lessons}</strong>
                  </p>
                  <p className="module-meta">Updated: {m.updated}</p>

                  <div className="module-actions">
                    <button
                      className="btn ghost"
                      onClick={() => navigate(`/admin-modules/${m.id}`)}
                    >
                      View
                    </button>
                    <button className="btn main">Edit</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>

    </div>
  );
}
