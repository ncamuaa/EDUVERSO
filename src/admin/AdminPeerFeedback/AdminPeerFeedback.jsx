import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

import {
  LuLayoutDashboard,
  LuUsers,
  LuBookOpen,
  LuGamepad2,     // ✅ standardized icon
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
  FaPen,
  FaStar,
} from "react-icons/fa";

import logo from "../../assets/1logo.png";
import "./AdminPeerFeedback.css";

const API_BASE = "http://192.168.100.180:5001";


export default function AdminPeerFeedback() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dark, setDark] = useState(true);
  const isAdmin = localStorage.getItem("admin_logged_in") === "true";

  /* ================================
        STATE
  ================================= */
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState("all");
  const [sortStars, setSortStars] = useState("desc");
  const [search, setSearch] = useState("");

  const [modalData, setModalData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* ================================
        LOAD FEEDBACK FROM BACKEND
  ================================= */
  const loadFeedback = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/feedback`);

      const data = await res.json();
      setFeedback(data.feedback || []);
    } catch (err) {
      console.error("FEEDBACK LOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  /* ================================
        DELETE FEEDBACK (BACKEND)
  ================================= */
  const deleteFeedback = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/feedback/${id}`, {
  method: "DELETE",
});

      const data = await res.json();

      if (data.success) {
        setFeedback((prev) => prev.filter((fb) => fb.id !== id));
        setDeleteTarget(null);
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      alert("Delete error");
      console.error(err);
    }
  };

  /* ================================
        ADD NEW FEEDBACK (BACKEND)
  ================================= */
  const addFeedback = async (f) => {
    try {
      const res = await fetch(`${API_BASE}/api/feedback`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });

      const data = await res.json();

      if (data.success) {
        loadFeedback();
        setModalData(null);
      } else {
        alert("Failed to add feedback");
      }
    } catch (err) {
      console.error("ADD FEEDBACK ERROR:", err);
    }
  };

  /* ================================
        FILTER + SEARCH + SORT
  ================================= */
  const filtered = useMemo(() => {
    let arr = [...feedback];

    if (filterStatus === "approved") arr = arr.filter((f) => f.approved);
    if (filterStatus === "pending") arr = arr.filter((f) => !f.approved);

    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (f) =>
          f.student.toLowerCase().includes(q) ||
          f.title.toLowerCase().includes(q) ||
          f.text.toLowerCase().includes(q)
      );
    }

    arr.sort((a, b) =>
      sortStars === "desc" ? b.stars - a.stars : a.stars - b.stars
    );

    return arr;
  }, [feedback, filterStatus, sortStars, search]);

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    window.location.href = "/admin-login";
  };

  return (
    <div className={`admin-layout ${sidebarCollapsed ? "sidebar-hidden" : ""}`}>
      {sidebarCollapsed && (
        <button
          className="sidebar-open-btn"
          onClick={() => setSidebarCollapsed(false)}
        >
          <FaBars />
        </button>
      )}

      {/* SIDEBAR */}
      <motion.aside
        className="sidebar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="sidebar-top">
          <div className="sidebar-header">
            <img src={logo} className="sidebar-logo" alt="logo" />
            <span className="sidebar-title">EduVerso Admin</span>
          </div>

          <button
            className="sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
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

          <li onClick={() => (window.location.href = "/admin-modules")}>
            <LuBookOpen className="menu-icon" />
            <span className="menu-text">Modules</span>
          </li>

          {/* ✅ GAMES ARENA (FIXED + ADDED) */}
          <li onClick={() => (window.location.href = "/admin-games")}>
            <LuGamepad2 className="menu-icon" />
            <span className="menu-text">Games Arena</span>
          </li>

          <li
            className="active"
            onClick={() => (window.location.href = "/admin-peerfeedback")}
          >
            <LuMessageSquare className="menu-icon" />
            <span className="menu-text">Peer Feedback</span>
          </li>

          <li onClick={() => (window.location.href = "/admin-announcements")}>
            <LuMegaphone className="menu-icon" />
            <span className="menu-text">Announcements</span>
          </li>

          <div className="spacer" />

          <li onClick={() => (window.location.href = "/admin-settings")}>
            <LuSettings className="menu-icon" />
            <span className="menu-text">Settings</span>
          </li>

          <li className="logout" onClick={handleLogout}>
            <LuLogOut className="menu-icon" />
            <span className="menu-text">Logout</span>
          </li>
        </ul>
      </motion.aside>
      {/* MAIN CONTENT */}
      <main className="pf-main">
        <div className="pf-main-box">

          {/* TOPBAR */}
          <div className="pf-topbar">
            <div className="content-inner">
              <div className="top-row">
                <h2>📘 Peer Feedback (Admin View)</h2>

                <div className="right-controls">
                  <button className="icon-btn" onClick={() => setDark(!dark)}>
                    {dark ? <FaMoon /> : <FaSun />}
                  </button>

                  <button className="icon-btn">
                    <FaBell />
                  </button>
                </div>
              </div>

              <div className="controls-row">
                <div className="left-controls">
                  <select className="pf-sort" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                  </select>

                  <select className="pf-sort" value={sortStars} onChange={(e) => setSortStars(e.target.value)}>
                    <option value="desc">Stars (5 → 1)</option>
                    <option value="asc">Stars (1 → 5)</option>
                  </select>

                  <button className="icon-btn rect-btn">Export</button>

                  <button
                    className="icon-btn add-btn rect-btn"
                    onClick={() =>
                      setModalData({
                        student: "",
                        title: "",
                        text: "",
                        stars: 5,
                        tag: "General",
                        isNew: true,
                      })
                    }
                  >
                    + Add
                  </button>
                </div>

                <div className="right-controls secondary">
                  <div className="pf-search">
                    <FaSearch />
                    <input
                      placeholder="Search…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FEEDBACK LIST */}
          <div className="feedback-list">
            {filtered.map((fb) => (
              <motion.div className="feedback-card" key={fb.id} whileHover={{ scale: 1.02 }}>
                <div className="card-header">
                  <div>
                    <h3>{fb.title}</h3>
                    <p className="pf-student">{fb.student} • {new Date(fb.date).toLocaleDateString()}</p>
                  </div>

                  <div className="card-actions">
                    <button className="act act-view" onClick={() => setModalData(fb)}><FaEye /></button>
                    <button className="act act-edit"><FaPen /></button>
                    <button className="act act-delete" onClick={() => setDeleteTarget(fb)}><FaTrash /></button>
                  </div>
                </div>

                <p className="feedback-text">{fb.text}</p>

                <div className="card-footer">
                  <div className="stars">
                    {"⭐".repeat(fb.stars)}
                  </div>
                  <span className="date">{new Date(fb.date).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* VIEW / ADD MODAL */}
      {modalData && (
        <div className="pf-modal-bg" onClick={() => setModalData(null)}>
          <div className="pf-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{modalData.isNew ? "Add Feedback" : modalData.title}</h3>

            {/* Add / Edit Fields */}
            {modalData.isNew && (
              <>
                <input
                  className="modal-input"
                  placeholder="Student Name"
                  value={modalData.student}
                  onChange={(e) => setModalData({ ...modalData, student: e.target.value })}
                />

                <input
                  className="modal-input"
                  placeholder="Title"
                  value={modalData.title}
                  onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                />

                <textarea
                  className="modal-textarea"
                  placeholder="Feedback text"
                  value={modalData.text}
                  onChange={(e) => setModalData({ ...modalData, text: e.target.value })}
                />
              </>
            )}

            {!modalData.isNew && (
              <>
                <p>{modalData.student} – {new Date(modalData.date).toLocaleDateString()}</p>
                <p>{modalData.text}</p>
              </>
            )}

            <button
              className="pf-close"
              onClick={() => {
                if (modalData.isNew) {
                  addFeedback(modalData);
                } else {
                  setModalData(null);
                }
              }}
            >
              {modalData.isNew ? "Save Feedback" : "Close"}
            </button>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="pf-modal-bg" onClick={() => setDeleteTarget(null)}>
          <div className="pf-delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Feedback?</h3>
            <p>Are you sure you want to delete “{deleteTarget.title}”?</p>

            <div className="delete-actions">
              <button className="cancel" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>

              <button className="confirm" onClick={() => deleteFeedback(deleteTarget.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
