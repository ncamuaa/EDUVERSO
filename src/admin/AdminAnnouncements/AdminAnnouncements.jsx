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
  FaBars
} from "react-icons/fa";

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

import logo from "../../assets/1logo.png";
import "./AdminAnnouncements.css";

const SAMPLE_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "New peer feedback improvements",
    message:
      "Peer feedback now supports inline comments, better sorting, and admin moderation features.",
    date: "Nov 24, 2025",
    createdAt: Date.now() - 86400000 * 7
  },
  {
    id: 2,
    title: "Server maintenance tonight",
    message:
      "We'll be bringing the platform down for a quick maintenance window at 11:45 PM. Expect ~15 minutes downtime.",
    date: "Nov 30, 2025",
    createdAt: Date.now() - 86400000 * 2
  }
];

export default function AdminAnnouncements() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dark, setDark] = useState(true);

  const [announcements, setAnnouncements] = useState(SAMPLE_ANNOUNCEMENTS);
  const [query, setQuery] = useState("");
  const [sortDir, setSortDir] = useState("desc");

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: "", message: "", date: "" });

  useEffect(() => {
    document.documentElement.classList.toggle("admin-dark", dark);
  }, [dark]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return announcements
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.message.toLowerCase().includes(q) ||
          a.date.toLowerCase().includes(q)
      )
      .sort((a, b) =>
        sortDir === "desc" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
      );
  }, [announcements, query, sortDir]);

  const openCreate = () => {
    setForm({ title: "", message: "", date: new Date().toLocaleDateString() });
    setModal({ mode: "create" });
  };

  const openView = (item) => setModal({ mode: "view", data: item });

  const openEdit = (item) => {
    setForm(item);
    setModal({ mode: "edit", data: item });
  };

  const createAnnouncement = () => {
    if (!form.title.trim()) return alert("Title is required.");
    setAnnouncements((prev) => [
      { ...form, id: Date.now(), createdAt: Date.now() },
      ...prev
    ]);
    setModal(null);
  };

  const saveEdit = () => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === form.id ? form : a))
    );
    setModal(null);
  };

  const deleteAnn = (item) => setModal({ mode: "delete", data: item });

  const confirmDelete = () => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== modal.data.id));
    setModal(null);
  };

  return (
    <div className={`admin-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} className="sidebar-logo" alt="logo" />
          {!sidebarCollapsed && <span className="sidebar-title">EduVerso Admin</span>}

          <button
            className="sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <FaBars />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li onClick={() => (window.location.href = "/dashboard")}>
            <LuLayoutDashboard />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </li>

          <li onClick={() => (window.location.href = "/students")}>
            <LuUsers /> {!sidebarCollapsed && <span>Students</span>}
          </li>

          <li onClick={() => (window.location.href = "/admin-modules")}>
            <LuBookOpen /> {!sidebarCollapsed && <span>Modules</span>}
          </li>

          <li>
            <LuBrain /> {!sidebarCollapsed && <span>Quiz Arena</span>}
          </li>

          <li onClick={() => (window.location.href = "/admin-peerfeedback")}>
            <LuMessageSquare /> {!sidebarCollapsed && <span>Peer Feedback</span>}
          </li>

          <li className="active">
            <LuMegaphone /> {!sidebarCollapsed && <span>Announcements</span>}
          </li>

          <li onClick={() => (window.location.href = "/settings")}>
            <LuSettings /> {!sidebarCollapsed && <span>Settings</span>}
          </li>

          <div className="spacer"></div>

          <li className="logout">
            <LuLogOut /> {!sidebarCollapsed && <span>Logout</span>}
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-ann-container">
        <div className="ann-header">
          <div className="ann-left">
            <h1 className="ann-main-title">📢 Admin Announcements</h1>
            <p className="ann-sub">Create, manage, and view platform announcements</p>
          </div>

          {/* CONTROLS BELOW TITLE */}
          <div className="ann-controls-row">
            <div className="ann-controls">
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

              <button className="icon-btn" onClick={() => setDark(!dark)}>
                {dark ? <FaMoon /> : <FaSun />}
              </button>

              <button className="icon-btn">
                <FaBell />
              </button>
            </div>
          </div>
        </div>

        {/* ANNOUNCEMENT LIST */}
        <div className="ann-list">
          {filtered.map((a) => (
            <div className="ann-card" key={a.id}>
              <div className="ann-card-top">
                <div className="ann-title-left">
                  <h3 className="ann-title">{a.title}</h3>
                  <p className="ann-meta">{a.date}</p>
                </div>

                <div className="ann-actions">
                  <button className="icon" onClick={() => openView(a)}>
                    <FaEye />
                  </button>
                  <button className="icon" onClick={() => openEdit(a)}>
                    <FaEdit />
                  </button>
                  <button className="icon danger" onClick={() => deleteAnn(a)}>
                    <FaTrash />
                  </button>
                </div>
              </div>

              <p className="ann-message">{a.message}</p>
            </div>
          ))}
        </div>
      </main>

      {/* VIEW MODAL */}
      {modal?.mode === "view" && (
        <div className="ann-modal-backdrop" onClick={() => setModal(null)}>
          <div className="ann-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modal.data.title}</h2>
            <p className="ann-meta">{modal.data.date}</p>
            <p style={{ marginTop: 12, lineHeight: 1.6 }}>{modal.data.message}</p>

            <div className="ann-modal-actions">
              <button className="btn" onClick={() => setModal(null)}>Close</button>
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
            <h2>{modal.mode === "create" ? "New Announcement" : "Edit Announcement"}</h2>

            <div className="field">
              <label>Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="field">
              <label>Date</label>
              <input
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div className="field">
              <label>Message</label>
              <textarea
                rows="5"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <div className="ann-modal-actions">
              <button className="btn" onClick={() => setModal(null)}>Cancel</button>

              {modal.mode === "create" ? (
                <button className="btn add" onClick={createAnnouncement}>Create</button>
              ) : (
                <button className="btn add" onClick={saveEdit}>Save</button>
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
              <button className="btn" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn danger" onClick={confirmDelete}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
