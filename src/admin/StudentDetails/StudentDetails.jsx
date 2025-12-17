// src/pages/Admin/StudentDetails.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

import {
  LuLayoutDashboard,
  LuUsers,
  LuBookOpen,
  LuGamepad,
  LuMessageSquare,
  LuMegaphone,
  LuSettings,
  LuLogOut,
} from "react-icons/lu";

import { FaBars, FaEdit, FaTrash } from "react-icons/fa";

import logo1 from "../../assets/1logo.png";
import noAvatar from "../../assets/no-avatar.png";

import "./StudentDetails.css";
const API_BASE = "http://192.168.100.180:5001";


export default function StudentDetails() {
  const navigate = useNavigate();
  const { state: studentFromNav } = useLocation();

  const [student, setStudent] = useState(studentFromNav || null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // edit modal
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    id: "",
    fullname: "",
    email: "",
    password: "",
    xp: 0,
    streak: 0,
    avatar: "",
    avatarFile: null,
  });

  useEffect(() => {
    if (localStorage.getItem("admin_logged_in") !== "true") {
      window.location.href = "/login";
    }
  }, []);

  // if navigated without state, fetch by URL id
  useEffect(() => {
    async function fetchIfNeeded() {
      if (student) {
        setForm({
          id: student.id,
          fullname: student.fullname || "",
          email: student.email || "",
          password: "",
          xp: student.xp || 0,
          streak: student.streak || 0,
          avatar: student.avatar || "",
          avatarFile: null,
        });
        return;
      }

      // attempt to parse id from url
      const path = window.location.pathname.split("/");
      const id = path[path.length - 1];
      if (!id) return;

      try {
        const r = await fetch(`${BASE}/students/${id}`);
        if (!r.ok) throw new Error("Failed to fetch student");
        const data = await r.json();
        if (data.student) {
          setStudent(data.student);
          setForm({
            id: data.student.id,
            fullname: data.student.fullname || "",
            email: data.student.email || "",
            password: "",
            xp: data.student.xp || 0,
            streak: data.student.streak || 0,
            avatar: data.student.avatar || "",
            avatarFile: null,
          });
        } else {
          setStudent(null);
        }
      } catch (err) {
        console.error("FETCH STUDENT ERROR:", err);
      }
    }

    fetchIfNeeded();
  }, [student]);

  if (!student) {
    return <h2 style={{ padding: 40, color: "#fff" }}>No student selected.</h2>;
  }

  const level = Math.floor((student.xp || 0) / 100) + 1;
  const progressPercent = Math.round(((student.xp % 100) / 100) * 100);

  /* ---------- avatar upload helper ---------- */
  const uploadAvatar = async (file, userId = null) => {
    if (!file) return null;
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      if (userId) fd.append("id", userId);
      const r = await fetch(`${BASE}/students/upload-avatar`, {
        method: "POST",
        body: fd,
      });
      if (!r.ok) throw new Error("Upload failed");
      const data = await r.json();
      return data.avatar;
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert("Avatar upload failed");
      return null;
    }
  };

  const openEdit = () => {
    setForm({
      id: student.id,
      fullname: student.fullname || "",
      email: student.email || "",
      password: "",
      xp: student.xp || 0,
      streak: student.streak || 0,
      avatar: student.avatar || "",
      avatarFile: null,
    });
    setEditing(true);
  };

  const closeEdit = () => setEditing(false);

  const saveEdit = async () => {
    if (!form.fullname.trim()) return alert("Fullname required");
    if (!form.email.trim()) return alert("Email required");

    try {
      setSaving(true);
      let avatarPath = form.avatar;
      if (form.avatarFile) {
        const uploaded = await uploadAvatar(form.avatarFile, form.id);
        if (uploaded) avatarPath = uploaded;
      }

      const r = await fetch(`${BASE}/students/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: form.fullname,
          email: form.email,
          password: form.password || "",
          avatar: avatarPath || null,
          xp: Number(form.xp || 0),
          streak: Number(form.streak || 0),
        }),
      });
      const data = await r.json();
      if (!r.ok || !data.success) {
        alert(data.message || "Failed to update");
        return;
      }

      // refresh student detail view
      const r2 = await fetch(`${BASE}/students/${form.id}`);
      if (r2.ok) {
        const dd = await r2.json();
        setStudent(dd.student);
      }

      setEditing(false);
    } catch (err) {
      console.error("SAVE EDIT ERROR:", err);
      alert("Server error while updating");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!window.confirm(`Delete ${student.fullname}? This cannot be undone.`)) return;
    try {
      const r = await fetch(`${BASE}/students/${student.id}`, { method: "DELETE" });
      const data = await r.json();
      if (!r.ok || !data.success) {
        alert(data.message || "Failed to delete");
        return;
      }
      // go back to list
      navigate("/students");
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert("Server error while deleting");
    }
  };

  return (
    <div className={`admin-layout ${sidebarCollapsed ? "sidebar-hidden" : ""}`}>
      {sidebarCollapsed && (
        <button className="sidebar-open-btn" onClick={() => setSidebarCollapsed(false)}>
          <FaBars />
        </button>
      )}

      {/* UNIFIED SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-header">
            <img src={logo1} className="sidebar-logo" alt="logo" />
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
          <li onClick={() => navigate("/dashboard")}>
            <LuLayoutDashboard className="menu-icon" />
            <span className="menu-text">Dashboard</span>
          </li>

          <li className="active" onClick={() => navigate("/students")}>
            <LuUsers className="menu-icon" />
            <span className="menu-text">Students</span>
          </li>

          <li onClick={() => navigate("/admin-modules")}>
            <LuBookOpen className="menu-icon" />
            <span className="menu-text">Modules</span>
          </li>

          <li onClick={() => navigate("/admin-games")}>
            <LuGamepad className="stu-menu-icon" />
            <span className="stu-menu-text">Game Arena</span>
          </li>

          <li onClick={() => navigate("/admin-peerfeedback")}>
            <LuMessageSquare className="menu-icon" />
            <span className="menu-text">Peer Feedback</span>
          </li>

          <li onClick={() => navigate("/admin-announcements")}>
            <LuMegaphone className="menu-icon" />
            <span className="menu-text">Announcements</span>
          </li>

          <div className="spacer" />

          <li onClick={() => navigate("/admin-settings")}>
            <LuSettings className="menu-icon" />
            <span className="menu-text">Settings</span>
          </li>

          <li
            className="logout"
            onClick={() => {
              localStorage.removeItem("admin_logged_in");
              window.location.href = "/login";
            }}
          >
            <LuLogOut className="menu-icon" /> Logout
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="dashboard-main-box">
          <div className="main-inner">
            <div className="student-header-card">
              <div className="header-left">
                <img
                  className="avatar-large"
                  src={student.avatar ? `${BASE}/${student.avatar}` : noAvatar}
                  alt="avatar"
                />
                <div className="meta">
                  <h2 className="student-name">{student.fullname}</h2>
                  <div className="student-sub">{student.email}</div>

                  <div className="student-basic-info">
                    <p>ID: {student.id}</p>
                  </div>
                </div>
              </div>

              <div className="header-right">
                <div className="quick-stats">
                  <div className="stat small">
                    <div className="stat-label">XP</div>
                    <div className="stat-value">{student.xp}</div>
                  </div>

                  <div className="stat small">
                    <div className="stat-label">Level</div>
                    <div className="stat-value">{level}</div>
                  </div>

                  <div className="stat small">
                    <div className="stat-label">Streak</div>
                    <div className="stat-value">🔥 {student.streak}</div>
                  </div>
                </div>

                <div className="level-progress">
                  <div className="progress-row">
                    <span>Progress to next level</span>
                    <span>{progressPercent}%</span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button
                    className="btn ghost"
                    onClick={() => navigate("/students")}
                  >
                    ← Back
                  </button>

                  <button className="btn" onClick={openEdit}>
                    <FaEdit /> &nbsp;Edit
                  </button>

                  <button className="btn danger" onClick={confirmDelete}>
                    <FaTrash /> &nbsp;Delete
                  </button>
                </div>
              </div>
            </div>

            <div className="wide-card" style={{ marginTop: 20 }}>
              <h3>📘 Activity Logs</h3>
              <p className="muted">
                Logs not available yet. You can add activity tracking later.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ---------- EDIT MODAL ---------- */}
      {editing && (
        <div className="ann-modal-backdrop" onClick={closeEdit}>
          <div className="ann-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Student</h2>

            <div className="field">
              <label>Fullname</label>
              <input value={form.fullname} onChange={(e) => setForm({ ...form, fullname: e.target.value })} />
            </div>

            <div className="field">
              <label>Email</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="field">
              <label>Password (leave blank to keep current)</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>

            <div className="field">
              <label>XP</label>
              <input type="number" value={form.xp} onChange={(e) => setForm({ ...form, xp: Number(e.target.value) })} />
            </div>

            <div className="field">
              <label>Streak</label>
              <input type="number" value={form.streak} onChange={(e) => setForm({ ...form, streak: Number(e.target.value) })} />
            </div>

            <div className="field">
              <label>Avatar (optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setForm((f) => ({ ...f, avatarFile: e.target.files && e.target.files[0] }))} />
              {form.avatar && !form.avatarFile && (
                <div style={{ marginTop: 8 }}>
                  <img src={`${BASE}/${form.avatar}`} alt="avatar" style={{ width: 80, height: 80, borderRadius: 8 }} />
                </div>
              )}
            </div>

            <div className="ann-modal-actions">
              <button className="btn" onClick={closeEdit}>Cancel</button>
              <button className="btn add" onClick={saveEdit} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
