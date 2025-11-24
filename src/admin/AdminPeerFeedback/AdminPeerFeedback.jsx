import React, { useState, useEffect } from "react";
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

import {
  FaBars,
  FaBell,
  FaMoon,
  FaSun,
  FaSearch,
  FaEye,
  FaTrash,
  FaCheck,
} from "react-icons/fa";

import logo from "../../assets/1logo.png";
import "./AdminPeerFeedback.css";

/* SAMPLE DATA */
const SAMPLE_FEEDBACK = [
  {
    id: 1,
    title: "Mission: Space Chemistry Lab",
    student: "Jordan Smith",
    feedback:
      "Great hypothesis! Try adding more data in your analysis for stronger results. Consider repeating the experiment with varied controls and record measurement uncertainty.",
    stars: 5,
    date: "Nov 4, 2025",
    approved: false,
  },
  {
    id: 2,
    title: "Zoe’s Essay",
    student: "Lucas Fernandez",
    feedback:
      "Nice comparison of plant and animal cells! You could expand the part about cellular adaptation in microgravity and add citations.",
    stars: 3,
    date: "Nov 2, 2025",
    approved: true,
  },
];

export default function AdminPeerFeedback() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dark, setDark] = useState(true);

  const [feedback, setFeedback] = useState(SAMPLE_FEEDBACK);
  const [search, setSearch] = useState("");
  const [sortStars, setSortStars] = useState("desc");

  const [modalData, setModalData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle("admin-dark", dark);
  }, [dark]);

  const filtered = feedback
    .filter(
      (f) =>
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.student.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (sortStars === "desc" ? b.stars - a.stars : a.stars - b.stars));

  const toggleApprove = (id) => {
    setFeedback((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, approved: !item.approved } : item
      )
    );
  };

  const deleteFeedback = (id) => {
    setFeedback((prev) => prev.filter((item) => item.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className={`admin-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} className="sidebar-logo" alt="logo" />
          {!sidebarCollapsed && <span className="sidebar-title">EduVerso Admin</span>}

          <button className="sidebar-collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <FaBars />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li><LuLayoutDashboard /> {!sidebarCollapsed && "Dashboard"}</li>
          <li><LuUsers /> {!sidebarCollapsed && "Students"}</li>
          <li><LuBookOpen /> {!sidebarCollapsed && "Modules"}</li>
          <li><LuBrain /> {!sidebarCollapsed && "Quiz Arena"}</li>
          <li className="active"><LuMessageSquare /> {!sidebarCollapsed && "Peer Feedback"}</li>
          <li><LuMegaphone /> {!sidebarCollapsed && "Announcements"}</li>

          <div className="spacer" />

          <li><LuSettings /> {!sidebarCollapsed && "Settings"}</li>
          <li className="logout"><LuLogOut /> {!sidebarCollapsed && "Logout"}</li>
        </ul>
      </aside>

      {/* MAIN */}
      <main className="pf-main">
        <div className="pf-topbar">
          <h2>📘 Peer Feedback (Admin View)</h2>

          <div className="pf-controls">
            {/* SEARCH */}
            <div className="pf-search">
              <FaSearch />
              <input
                placeholder="Search student, feedback or title…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* SORT */}
            <select className="pf-sort" value={sortStars} onChange={(e) => setSortStars(e.target.value)}>
              <option value="desc">Stars (5 → 1)</option>
              <option value="asc">Stars (1 → 5)</option>
            </select>

            {/* THEME TOGGLE */}
            <button className="icon-btn" onClick={() => setDark(!dark)}>
              {dark ? <FaMoon /> : <FaSun />}
            </button>

            {/* NOTIFICATIONS */}
            <button className="icon-btn"><FaBell /></button>
          </div>
        </div>

        {/* FEEDBACK LIST */}
        <div className="feedback-list">
          {filtered.map((fb) => (
            <motion.div className="feedback-card" key={fb.id} whileHover={{ scale: 1.02 }}>

              <div className="card-header">
                <div className="card-header-left">
                  <h3>{fb.title}</h3>
                  <p className="pf-student">{fb.student} • {fb.date}</p>
                </div>

                <div className="card-actions">
                  <button className="act act-view" onClick={() => setModalData(fb)}>
                    <FaEye />
                  </button>

                  <button className="act act-approve" onClick={() => toggleApprove(fb.id)}>
                    <FaCheck />
                  </button>

                  <button className="act act-delete" onClick={() => setDeleteTarget(fb)}>
                    <FaTrash />
                  </button>
                </div>
              </div>

              <p className="feedback-text">{fb.feedback}</p>

              <div className="card-footer">
                <span className="stars">{"⭐".repeat(fb.stars)}</span>
                <span className="date">{fb.date}</span>
              </div>

            </motion.div>
          ))}
        </div>
      </main>

      {/* FULL VIEW MODAL */}
      {modalData && (
        <div className="pf-modal-bg" onClick={() => setModalData(null)}>
          <div className="pf-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{modalData.title}</h3>
            <p className="pf-modal-student">{modalData.student} — {modalData.date}</p>
            <p className="pf-modal-body">{modalData.feedback}</p>

            <button className="pf-close" onClick={() => setModalData(null)}>Close</button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteTarget && (
        <div className="pf-modal-bg" onClick={() => setDeleteTarget(null)}>
          <div className="pf-delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Feedback?</h3>
            <p>Are you sure you want to delete "{deleteTarget.title}"?</p>

            <div className="delete-actions">
              <button className="cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="confirm" onClick={() => deleteFeedback(deleteTarget.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
