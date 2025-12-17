import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  LuLayoutDashboard,
  LuUsers,
  LuBookOpen,
  LuGamepad2,   // ✅ standardized icon
  LuMessageSquare,
  LuMegaphone,
  LuSettings,
  LuLogOut,
} from "react-icons/lu";

import { FaBars, FaPlus, FaTimes, FaTrash } from "react-icons/fa";

import logo from "../../assets/1logo.png";
import "./AdminModules.css";
const API_BASE = "http://192.168.100.180:5001";


export default function AdminModules() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  /* ----------------------------------------------------
     FETCH MODULES (GET /api/modules/)
  ----------------------------------------------------- */
  const fetchModules = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/modules/`);

      const data = await res.json();

      setModules(data.modules || []);
      setLoading(false);
    } catch (err) {
      console.error("Module fetch error:", err);
      setModules([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("admin_logged_in") !== "true") {
      window.location.href = "/login";
    }
    fetchModules();
  }, []);

  /* ----------------------------------------------------
     UPLOAD MODULE (POST /api/modules/)
  ----------------------------------------------------- */
  const handleUpload = async () => {
    if (!newTitle.trim()) {
      alert("Module title is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("description", newDesc);

    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (pdfFile) formData.append("pdf_file", pdfFile);

    try {
      const res = await fetch(`${API_BASE}/api/modules/`, {

        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Module added successfully!");
        setShowModal(false);
        setNewTitle("");
        setNewDesc("");
        setPdfFile(null);
        setThumbnail(null);
        fetchModules();
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload error");
    }
  };

  /* ----------------------------------------------------
     DELETE MODULE (DELETE /api/modules/:id)
  ----------------------------------------------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/modules/${id}`, {

        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        alert("Module deleted!");
        fetchModules();
      } else {
        alert("Delete failed: " + data.error);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete error");
    }
  };

  /* ----------------------------------------------------
     LOGOUT
  ----------------------------------------------------- */
  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    window.location.href = "/login";
  };

  return (
    <div className={`admin-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} className="sidebar-logo" alt="logo" />
          {!sidebarCollapsed && (
            <span className="sidebar-title">EduVerso Admin</span>
          )}

          <button
            className="sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <FaBars />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li onClick={() => navigate("/dashboard")}>
            <LuLayoutDashboard />
            <span>Dashboard</span>
          </li>

          <li onClick={() => navigate("/students")}>
            <LuUsers />
            <span>Students</span>
          </li>

          <li className="active">
            <LuBookOpen />
            <span>Modules</span>
          </li>

          {/* ✅ GAMES ARENA ADDED */}
          <li onClick={() => navigate("/admin-games")}>
            <LuGamepad2 />
            <span>Games Arena</span>
          </li>

          <li onClick={() => navigate("/admin-peerfeedback")}>
            <LuMessageSquare />
            <span>Peer Feedback</span>
          </li>

          <li onClick={() => navigate("/admin-announcements")}>
            <LuMegaphone />
            <span>Announcements</span>
          </li>

          <div className="spacer"></div>

          <li onClick={() => navigate("/admin-settings")}>
            <LuSettings />
            <span>Settings</span>
          </li>

          <li className="logout" onClick={handleLogout}>
            <LuLogOut />
            <span>Logout</span>
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <div className="right-wrapper">
        <main className="main-content">
          <div className="main-content-box">
            <div className="modules-header">
              <h2>📚 Admin Modules</h2>
              <button className="add-btn" onClick={() => setShowModal(true)}>
                <FaPlus /> Add Module
              </button>
            </div>

            {loading ? (
              <p>Loading modules...</p>
            ) : modules.length === 0 ? (
              <p>No modules yet</p>
            ) : (
              <div className="modules-grid">
                {modules.map((m) => (
                  <motion.div
                    key={m.id}
                    className="module-card"
                    whileHover={{ scale: 1.03 }}
                  >
                    <h3>{m.title}</h3>
                    <p>{m.description || "No description"}</p>
                    <p>Created: {m.created_at?.slice(0, 10)}</p>

                    <div className="module-actions">
                      <button
                        className="btn ghost"
                        onClick={() =>
                          navigate(`/admin-modules/${m.id}`, {
                            state: { moduleData: m },
                          })
                        }
                      >
                        View
                      </button>

                      <button className="btn main">Edit</button>

                      <button
                        className="btn danger"
                        onClick={() => handleDelete(m.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ADD MODULE MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
            >
              <FaTimes />
            </button>

            <h2>Add Module</h2>

            <input
              className="modal-input"
              placeholder="Module Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <textarea
              className="modal-textarea"
              placeholder="Module Description"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />

            <label>Upload PDF:</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
            />

            <label>Upload Thumbnail:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
            />

            <button className="modal-upload-btn" onClick={handleUpload}>
              Upload Module
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
