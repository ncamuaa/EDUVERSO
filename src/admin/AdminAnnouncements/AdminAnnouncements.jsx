// src/pages/Admin/AdminAnnouncements.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaBell,
  FaMoon,
  FaSun,
  FaBars,
} from "react-icons/fa";

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

import logo from "../../assets/1logo.png";
import "./AdminAnnouncements.css";

const API_BASE = "http://192.168.100.180:5001";


export default function AdminAnnouncements() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dark, setDark] = useState(true);

  const [announcements, setAnnouncements] = useState([]);

  const [query, setQuery] = useState("");
  const [sortDir, setSortDir] = useState("desc");

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    id: "",
    title: "",
    body: "",
    category: "info",
  });

  const [saving, setSaving] = useState(false);

  /* =====================================================
     CHECK ADMIN LOGIN
  ===================================================== */
  useEffect(() => {
    if (localStorage.getItem("admin_logged_in") !== "true") {
      window.location.href = "/login";
    }
  }, []);

  /* =====================================================
     DARK MODE
  ===================================================== */
  useEffect(() => {
    document.documentElement.classList.toggle("admin-dark", dark);
  }, [dark]);

  /* =====================================================
     LOAD ALL ANNOUNCEMENTS
  ===================================================== */
  const loadAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/announcements`);

      if (!res.ok) throw new Error("Failed to load announcements");
      const data = await res.json();
      setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error("Failed loading announcements:", err);
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  /* =====================================================
     SEARCH + SORT
  ===================================================== */
  const filtered = useMemo(() => {
    const q = query.toLowerCase();

    return announcements
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.body.toLowerCase().includes(q)
      )
      .sort((a, b) =>
        sortDir === "desc"
          ? new Date(b.created_at) - new Date(a.created_at)
          : new Date(a.created_at) - new Date(b.created_at)
      );
  }, [announcements, query, sortDir]);

  /* =====================================================
     OPEN MODAL HELPERS
  ===================================================== */
  const openCreate = () => {
    setForm({ id: "", title: "", body: "", category: "info" });
    setModal({ mode: "create" });
  };

  const openView = (a) => setModal({ mode: "view", data: a });

  const openEdit = (a) => {
    setForm({
      id: a.id,
      title: a.title,
      body: a.body,
      category: a.category || "info",
    });
    setModal({ mode: "edit", data: a });
  };

  const openDelete = (a) => setModal({ mode: "delete", data: a });

  /* =====================================================
     CREATE ANNOUNCEMENT
  ===================================================== */
  const createAnnouncement = async () => {
    if (!form.title.trim()) return alert("Title required.");
    if (!form.body.trim()) return alert("Message required.");

    try {
      setSaving(true);

      const res = await fetch(`${API_BASE}/api/announcements`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          body: form.body.trim(),
          category: form.category,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to create announcement");
        return;
      }

      setAnnouncements((prev) => [
        {
          id: data.id,
          title: form.title.trim(),
          body: form.body.trim(),
          category: form.category,
          is_new: 1,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);

      setModal(null);
    } catch (err) {
      console.error("Create error:", err);
      alert("Server error while creating announcement");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     SAVE EDIT
  ===================================================== */
  const saveEdit = async () => {
    if (!form.title.trim()) return alert("Title required.");
    if (!form.body.trim()) return alert("Message required.");

    try {
      setSaving(true);

      const res = await fetch(`${API_BASE}/api/announcements/${form.id}`, {

        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          body: form.body.trim(),
          category: form.category,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to update announcement");
        return;
      }

      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === form.id
            ? {
                ...a,
                title: form.title.trim(),
                body: form.body.trim(),
                category: form.category,
                is_new: 1,
              }
            : a
        )
      );

      setModal(null);
    } catch (err) {
      console.error("Edit error:", err);
      alert("Server error while updating");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE ANNOUNCEMENT
  ===================================================== */
  const confirmDelete = async () => {
    try {
      setSaving(true);

      const res = await fetch(
        `${API_BASE}/api/announcements/${modal.data.id}`,

        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to delete announcement");
        return;
      }

      setAnnouncements((prev) =>
        prev.filter((a) => a.id !== modal.data.id)
      );

      setModal(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error while deleting");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     LOGOUT
  ===================================================== */
  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    window.location.href = "/login";
  };

  return (
    <div className={`admin-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {sidebarCollapsed && (
        <button
          className="sidebar-open-btn"
          onClick={() => setSidebarCollapsed(false)}
        >
          <FaBars />
        </button>
      )}

      {/* SIDEBAR */}
      <aside className="sidebar">
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
            <LuLayoutDashboard className="menu-icon" /> Dashboard
          </li>

          <li onClick={() => (window.location.href = "/students")}>
            <LuUsers className="menu-icon" /> Students
          </li>

          <li onClick={() => (window.location.href = "/admin-modules")}>
            <LuBookOpen className="menu-icon" /> Modules
          </li>

          {/* ✅ GAMES ARENA ADDED */}
          <li onClick={() => (window.location.href = "/admin-games")}>
            <LuGamepad2 className="menu-icon" /> Games Arena
          </li>

          <li onClick={() => (window.location.href = "/admin-peerfeedback")}>
            <LuMessageSquare className="menu-icon" /> Peer Feedback
          </li>

          <li className="active">
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

      {/* MAIN CONTENT */}
      <main className="admin-ann-container">
        <div className="ann-main-box-dashboard">
          {/* HEADER */}
          <div className="ann-header">
            <div className="ann-top-row">
              <h1 className="ann-main-title">📢 Admin Announcements</h1>

              <div className="ann-icons-right">
                <button className="icon-btn" onClick={() => setDark(!dark)}>
                  {dark ? <FaMoon /> : <FaSun />}
                </button>
                <button className="icon-btn">
                  <FaBell />
                </button>
              </div>
            </div>

            <p className="ann-sub">
              Create, manage, and broadcast announcements
            </p>

            <div className="ann-controls under-title">
              <div className="ann-search">
                <FaSearch />
                <input
                  placeholder="Search announcements..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <select
                className="ann-sort"
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value)}
              >
                <option value="desc">Newest → Oldest</option>
                <option value="asc">Oldest → Newest</option>
              </select>

              <button className="btn add" onClick={openCreate}>
                <FaPlus /> Add Announcement
              </button>
            </div>
          </div>

          {/* ANNOUNCEMENTS LIST */}
          <div className="ann-list">
            {filtered.map((a) => (
              <div className="ann-card" key={a.id}>
                <div className="ann-card-top">
                  <div>
                    <h3 className="ann-title">{a.title}</h3>
                    <p className="ann-meta">
                      {new Date(a.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="ann-actions">
                    <button className="icon" onClick={() => openView(a)}>
                      <FaEye />
                    </button>
                    <button className="icon" onClick={() => openEdit(a)}>
                      <FaEdit />
                    </button>
                    <button
                      className="icon danger"
                      onClick={() => openDelete(a)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <p className="ann-message">{a.body}</p>
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="ann-empty">No announcements yet.</p>
            )}
          </div>
        </div>
      </main>

      {/* VIEW MODAL */}
      {modal?.mode === "view" && (
        <div className="ann-modal-backdrop" onClick={() => setModal(null)}>
          <div className="ann-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modal.data.title}</h2>
            <p className="ann-meta">
              {new Date(modal.data.created_at).toLocaleDateString()}
            </p>

            <p style={{ marginTop: 12 }}>{modal.data.body}</p>

            <div className="ann-modal-actions">
              <button className="btn" onClick={() => setModal(null)}>
                Close
              </button>

              <button className="btn add" onClick={() => openEdit(modal.data)}>
                <FaEdit /> Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <div className="ann-modal-backdrop" onClick={() => setModal(null)}>
          <div className="ann-modal" onClick={(e) => e.stopPropagation()}>
            <h2>
              {modal.mode === "create"
                ? "New Announcement"
                : "Edit Announcement"}
            </h2>

            {/* Title */}
            <div className="field">
              <label>Title</label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            {/* Category */}
            <div className="field">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="update">Update</option>
              </select>
            </div>

            {/* Body */}
            <div className="field">
              <label>Message</label>
              <textarea
                rows="5"
                value={form.body}
                onChange={(e) =>
                  setForm({ ...form, body: e.target.value })
                }
              />
            </div>

            {/* BUTTONS */}
            <div className="ann-modal-actions">
              <button className="btn" onClick={() => setModal(null)}>
                Cancel
              </button>

              {modal.mode === "create" ? (
                <button
                  className="btn add"
                  onClick={createAnnouncement}
                  disabled={saving}
                >
                  {saving ? "Creating..." : "Create"}
                </button>
              ) : (
                <button
                  className="btn add"
                  onClick={saveEdit}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {modal?.mode === "delete" && (
        <div className="ann-modal-backdrop" onClick={() => setModal(null)}>
          <div className="ann-delete-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Announcement?</h2>
            <p className="ann-sub">This action cannot be undone.</p>

            <div className="ann-modal-actions">
              <button className="btn" onClick={() => setModal(null)}>
                Cancel
              </button>

              <button
                className="btn danger"
                onClick={confirmDelete}
                disabled={saving}
              >
                <FaTrash /> {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
