// src/pages/Admin/StudentList.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  LuLayoutDashboard,
  LuUsers,
  LuBookOpen,
  LuGamepad2,      // ✅ ADDED (standard icon)
  LuMessageSquare,
  LuMegaphone,
  LuSettings,
  LuLogOut,
} from "react-icons/lu";

import { FaBars, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";

import noAvatar from "../../assets/no-avatar.png";
import logo1 from "../../assets/1logo.png";
import "./StudentList.css";

const API_BASE = "http://192.168.100.180:5001";

const computeLevel = (xp) => Math.floor((xp || 0) / 100) + 1;

export default function StudentList() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name-asc");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [modal, setModal] = useState(null);
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

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* 🔐 Protect route */
  useEffect(() => {
    if (localStorage.getItem("admin_logged_in") !== "true") {
      window.location.href = "/login";
    }
  }, []);

  /* 🌙 Dark mode */
  useEffect(() => {
    document.documentElement.classList.add("admin-dark");
    return () => document.documentElement.classList.remove("admin-dark");
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const r = await fetch(`${API_BASE}/students/list`);

      if (!r.ok) throw new Error("Failed to load");
      const data = await r.json();

      const arr = data.students || [];
      setStudents(
        arr.map((s) => ({
          ...s,
          xp: s.xp || 0,
          streak: s.streak || 0,
          level: computeLevel(s.xp),
          avatar_url: s.avatar ? `${API_BASE}/${s.avatar}` : null,

        }))
      );
    } catch (err) {
      console.error("LOAD STUDENTS ERROR:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    const i = setInterval(loadStudents, 8000);
    return () => clearInterval(i);
  }, []);

  const filtered = students
    .filter((s) =>
      (s.fullname || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "name-asc") return a.fullname.localeCompare(b.fullname);
      if (sort === "name-desc") return b.fullname.localeCompare(a.fullname);
      if (sort === "xp-desc") return b.xp - a.xp;
      if (sort === "xp-asc") return a.xp - b.xp;
      return 0;
    });

  const openAdd = () => {
    setForm({
      id: "",
      fullname: "",
      email: "",
      password: "",
      xp: 0,
      streak: 0,
      avatar: "",
      avatarFile: null,
    });
    setModal({ mode: "add" });
  };

  const openEdit = (s) => {
    setForm({
      id: s.id,
      fullname: s.fullname,
      email: s.email,
      password: "",
      xp: s.xp,
      streak: s.streak,
      avatar: s.avatar,
      avatarFile: null,
    });
    setModal({ mode: "edit", data: s });
  };

  const openDelete = (s) => setModal({ mode: "delete", data: s });
  const closeModal = () => setModal(null);

  return (
    <div className={`stu-admin-layout ${sidebarCollapsed ? "stu-sidebar-collapsed" : ""}`}>
      {sidebarCollapsed && (
        <button className="stu-sidebar-open-btn" onClick={() => setSidebarCollapsed(false)}>
          <FaBars />
        </button>
      )}

      {/* ===================== SIDEBAR ===================== */}
      <aside className="stu-sidebar">
        <div className="stu-sidebar-top">
          <div className="stu-sidebar-header">
            <img src={logo1} className="stu-sidebar-logo" alt="logo" />
            <span className="stu-sidebar-title">EduVerso Admin</span>
          </div>

          <button
            className="stu-sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed((p) => !p)}
          >
            <FaBars />
          </button>
        </div>

        <ul className="stu-sidebar-menu">
          <li onClick={() => navigate("/dashboard")}>
            <LuLayoutDashboard className="stu-menu-icon" />
            <span className="stu-menu-text">Dashboard</span>
          </li>

          <li className="active" onClick={() => navigate("/students")}>
            <LuUsers className="stu-menu-icon" />
            <span className="stu-menu-text">Students</span>
          </li>

          <li onClick={() => navigate("/admin-modules")}>
            <LuBookOpen className="stu-menu-icon" />
            <span className="stu-menu-text">Modules</span>
          </li>

          {/* ✅ GAMES ARENA (ADDED – NOTHING ELSE REMOVED) */}
          <li onClick={() => navigate("/admin-games")}>
            <LuGamepad2 className="stu-menu-icon" />
            <span className="stu-menu-text">Games Arena</span>
          </li>

          <li onClick={() => navigate("/admin-peerfeedback")}>
            <LuMessageSquare className="stu-menu-icon" />
            <span className="stu-menu-text">Peer Feedback</span>
          </li>

          <li onClick={() => navigate("/admin-announcements")}>
            <LuMegaphone className="stu-menu-icon" />
            <span className="stu-menu-text">Announcements</span>
          </li>

          <div className="stu-spacer" />

          <li onClick={() => navigate("/admin-settings")}>
            <LuSettings className="stu-menu-icon" />
            <span className="stu-menu-text">Settings</span>
          </li>

          <li
            className="logout"
            onClick={() => {
              localStorage.removeItem("admin_logged_in");
              window.location.href = "/login";
            }}
          >
            <LuLogOut className="stu-menu-icon" /> Logout
          </li>
        </ul>
      </aside>
      {/* ===================== MAIN CONTENT ===================== */}
      <main className="stu-main">
        <div className="stu-main-glass">
          <div className="stu-main-inner">

            <div className="stu-header-row">
              <div>
                <button className="stu-back-btn" onClick={() => navigate("/dashboard")}>
                  ← Back
                </button>
                <h2 className="stu-title">📁 Student Progress Monitor</h2>
                <p className="stu-subtitle">Tracking XP, levels, streaks & avatars</p>
              </div>

              <div className="stu-header-controls">
                <input
                  className="stu-search-input"
                  placeholder="Search fullname…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <select
                  className="stu-sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="name-asc">Name A–Z</option>
                  <option value="name-desc">Name Z–A</option>
                  <option value="xp-desc">XP High → Low</option>
                  <option value="xp-asc">XP Low → High</option>
                </select>

                <button
                  className="stu-btn main"
                  onClick={openAdd}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                >
                  <FaPlus /> Add Student
                </button>
              </div>
            </div>

            <div className="stu-student-grid">
              {loading && <div style={{ color: "#fff", gridColumn: "1 / -1" }}>Loading…</div>}

              {filtered.map((s) => (
                <motion.div key={s.id} className="stu-student-card" whileHover={{ scale: 1.03 }}>
                  <div className="stu-card-media">
                    <img
                      src={s.avatar_url || noAvatar}
                      alt="avatar"
                      className="stu-student-img"
                      onError={(e) => (e.currentTarget.src = noAvatar)}
                    />
                  </div>

                  <div className="stu-name-block">
                    <div className="stu-student-name">{s.fullname}</div>
                    <div className="stu-student-email">{s.email}</div>
                  </div>

                  <div className="stu-student-stats">
                    XP: {s.xp} • Level {s.level} • 🔥 {s.streak}-day streak
                  </div>

                  <div className="stu-card-actions">
                    <button
                      className="stu-btn ghost"
                      onClick={() => navigate(`/students/${s.id}`, { state: s })}
                    >
                      <FaEye /> &nbsp;View
                    </button>

                    <button className="stu-btn" onClick={() => openEdit(s)}>
                      <FaEdit /> &nbsp;Edit
                    </button>

                    <button
                      className="stu-btn"
                      style={{ background: "#ff7b7b", color: "#fff" }}
                      onClick={() => openDelete(s)}
                    >
                      <FaTrash /> &nbsp;Delete
                    </button>
                  </div>
                </motion.div>
              ))}

              {filtered.length === 0 && !loading && (
                <div className="stu-empty">No students found.</div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ===================== MODALS ===================== */}
      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <div className="ann-modal-backdrop" onClick={closeModal}>
          <div className="ann-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modal.mode === "add" ? "Add Student" : "Edit Student"}</h2>

            <div className="field">
              <label>Fullname</label>
              <input value={form.fullname} onChange={(e) => setForm({ ...form, fullname: e.target.value })} />
            </div>

            <div className="field">
              <label>Email</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="field">
              <label>Password {modal.mode === "edit" && "(leave blank to keep current)"}</label>
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
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm((f) => ({ ...f, avatarFile: e.target.files && e.target.files[0] }))
                }
              />
              {form.avatar && !form.avatarFile && (
                <div style={{ marginTop: 8 }}>
                  <img src={`${API_BASE}/${form.avatar}`} alt="avatar" style={{ width: 80, height: 80, borderRadius: 8 }} />
                </div>
              )}
            </div>

            <div className="ann-modal-actions">
              <button className="btn" onClick={closeModal}>Cancel</button>

              {modal.mode === "add" ? (
                <button className="btn add" onClick={createStudent} disabled={saving}>
                  {saving ? "Creating..." : "Create"}
                </button>
              ) : (
                <button className="btn add" onClick={saveEdit} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {modal?.mode === "delete" && (
        <div className="ann-modal-backdrop" onClick={closeModal}>
          <div className="ann-delete-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Student?</h2>
            <p className="ann-sub">
              Are you sure you want to delete <strong>{modal.data.fullname}</strong>?
              This action cannot be undone.
            </p>

            <div className="ann-modal-actions">
              <button className="btn" onClick={closeModal}>Cancel</button>
              <button className="btn danger" onClick={confirmDelete} disabled={saving}>
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
