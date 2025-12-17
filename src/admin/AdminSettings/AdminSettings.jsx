import React, { useEffect, useState } from "react";
import {
  LuLayoutDashboard,
  LuUsers,
  LuBookOpen,
  LuGamepad2,   // ✅ standardized icon
  LuMessageSquare,
  LuMegaphone,
  LuSettings as LuSettingsIcon,
  LuLogOut
} from "react-icons/lu";
import { FaBell, FaMoon, FaSun, FaBars } from "react-icons/fa";
import logo from "../../assets/1logo.png";
import "./AdminSettings.css";

export default function AdminSettings() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dark, setDark] = useState(true);
  const [settings, setSettings] = useState({
    dashboardNotifications: true,
    emailAlerts: true,
    darkMode: true,
    autoLogout: 30,
    timezone: "UTC"
  });

  // redirect if not logged in
  useEffect(() => {
    if (localStorage.getItem("admin_logged_in") !== "true") {
      window.location.href = "/login";
    }
  }, []);

  // theme
  useEffect(() => {
    document.documentElement.classList.toggle("admin-dark", dark);
  }, [dark]);

  function toggle(key) {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  }

  function updateField(key, value) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    window.location.href = "/login";
  };

  return (
    <div className={`admin-layout ${sidebarCollapsed ? "sidebar-hidden" : ""}`}>
      {/* SIDEBAR OPEN BUTTON */}
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
            <img src={logo} className="sidebar-logo" alt="" />
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

          {/* ✅ GAMES ARENA FIXED */}
          <li onClick={() => (window.location.href = "/admin-games")}>
            <LuGamepad2 className="menu-icon" />
            <span className="menu-text">Games Arena</span>
          </li>

          <li onClick={() => (window.location.href = "/admin-peerfeedback")}>
            <LuMessageSquare className="menu-icon" />
            <span className="menu-text">Peer Feedback</span>
          </li>

          <li onClick={() => (window.location.href = "/admin-announcements")}>
            <LuMegaphone className="menu-icon" />
            <span className="menu-text">Announcements</span>
          </li>

          <div className="spacer" />

          <li
            className="active"
            onClick={() => (window.location.href = "/admin-settings")}
          >
            <LuSettingsIcon className="menu-icon" />
            <span className="menu-text">Settings</span>
          </li>

          <li className="logout" onClick={handleLogout}>
            <LuLogOut className="menu-icon" />
            <span className="menu-text">Logout</span>
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT — ORIGINAL SETTINGS LAYOUT */}
      <main className="main-content">
        <div className="main-content-box">
          <div className="settings-header-row">
            <div>
              <h2>⚙️ Admin Settings</h2>
              <p className="modules-sub">
                Manage system settings and admin preferences.
              </p>
            </div>

            <div className="settings-actions">
              <button className="icon-btn" onClick={() => setDark(!dark)}>
                {dark ? <FaMoon /> : <FaSun />}
              </button>

              <button className="icon-btn">
                <FaBell />
              </button>
            </div>
          </div>

          <div className="settings-grid">
            <div className="settings-card">
              <h3 className="card-title">General</h3>

              {/* Notifications */}
              <div className="settings-row">
                <div className="settings-left">
                  <div className="row-heading">Dashboard Notifications</div>
                  <div className="row-sub">Show alerts and system updates</div>
                </div>
                <div className="settings-right">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.dashboardNotifications}
                      onChange={() => toggle("dashboardNotifications")}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              {/* Email Alerts */}
              <div className="settings-row">
                <div className="settings-left">
                  <div className="row-heading">Email Alerts</div>
                  <div className="row-sub">Send important email alerts to admin</div>
                </div>
                <div className="settings-right">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.emailAlerts}
                      onChange={() => toggle("emailAlerts")}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              {/* Dark Mode */}
              <div className="settings-row">
                <div className="settings-left">
                  <div className="row-heading">Dark Mode</div>
                  <div className="row-sub">Toggle dark admin theme</div>
                </div>
                <div className="settings-right">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={() => {
                        toggle("darkMode");
                        setDark(!dark);
                      }}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              {/* Auto Logout */}
              <div className="settings-row">
                <div className="settings-left">
                  <div className="row-heading">Auto Logout</div>
                  <div className="row-sub">Idle timeout (minutes)</div>
                </div>
                <div className="settings-right">
                  <select
                    className="select"
                    value={settings.autoLogout}
                    onChange={(e) =>
                      updateField("autoLogout", Number(e.target.value))
                    }
                  >
                    <option value={5}>5 min</option>
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={60}>60 min</option>
                  </select>
                </div>
              </div>

              {/* Timezone */}
              <div className="settings-row">
                <div className="settings-left">
                  <div className="row-heading">Timezone</div>
                  <div className="row-sub">System timezone</div>
                </div>
                <div className="settings-right">
                  <select
                    className="select"
                    value={settings.timezone}
                    onChange={(e) =>
                      updateField("timezone", e.target.value)
                    }
                  >
                    <option value="UTC">UTC</option>
                    <option value="Asia/Manila">Asia/Manila</option>
                    <option value="America/Los_Angeles">
                      America/Los_Angeles
                    </option>
                    <option value="Europe/London">Europe/London</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="panel-actions">
                <button
                  className="btn ghost"
                  onClick={() => window.location.reload()}
                >
                  Reset
                </button>
                <button
                  className="btn main"
                  onClick={() => alert("Saved (demo)")}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
