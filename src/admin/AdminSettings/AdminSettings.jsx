import React, { useEffect, useState } from "react";
import {
  LuLayoutDashboard,
  LuUsers,
  LuBookOpen,
  LuBrain,
  LuMessageSquare,
  LuMegaphone,
  LuSettings as LuSettingsIcon,
  LuLogOut
} from "react-icons/lu";
import { FaBell, FaMoon, FaSun, FaBars } from "react-icons/fa";
import logo from "../../assets/1logo.png";
import "./AdminSettings.css";

export default function AdminSettings(){
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dark, setDark] = useState(true);
  const [settings, setSettings] = useState({
    dashboardNotifications: true,
    emailAlerts: true,
    darkMode: true,
    autoLogout: 30,
    timezone: "UTC"
  });

  useEffect(()=>{
    document.documentElement.classList.toggle("admin-dark", dark);
  }, [dark]);

  function toggle(key){
    setSettings(s => ({ ...s, [key]: !s[key] }));
  }

  function updateField(key, value){
    setSettings(s => ({ ...s, [key]: value }));
  }

  return (
    <div className={`admin-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* SIDEBAR */}
      <aside className="sidebar" aria-hidden={sidebarCollapsed}>
        <div className="sidebar-header">
          <img src={logo} alt="logo" className="sidebar-logo" />
          {!sidebarCollapsed && <span className="sidebar-title">EduVerso Admin</span>}
          <button
            className="sidebar-collapse-btn"
            onClick={() => setSidebarCollapsed(p => !p)}
            aria-expanded={!sidebarCollapsed}
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
            <LuUsers />
            {!sidebarCollapsed && <span>Students</span>}
          </li>

          <li onClick={() => (window.location.href = "/admin-modules")}>
            <LuBookOpen />
            {!sidebarCollapsed && <span>Modules</span>}
          </li>

          <li>
            <LuBrain />
            {!sidebarCollapsed && <span>Quiz Arena</span>}
          </li>

          <li onClick={() => (window.location.href = "/admin-peerfeedback")}>
            <LuMessageSquare />
            {!sidebarCollapsed && <span>Peer Feedback</span>}
          </li>

          <li onClick={() => (window.location.href = "/admin-announcements")}>
            <LuMegaphone />
            {!sidebarCollapsed && <span>Announcements</span>}
          </li>

          <div className="spacer" />

          <li className="active" onClick={() => (window.location.href = "/admin-settings")}>
            <LuSettingsIcon />
            {!sidebarCollapsed && <span>Settings</span>}
          </li>

          <li onClick={() => (window.location.href = "/logout")}>
            <LuLogOut />
            {!sidebarCollapsed && <span>Logout</span>}
          </li>
        </ul>
      </aside>

      {/* RIGHT WRAPPER */}
      <div className="right-wrapper">
        <main className="main-content">
          <div className="main-content-box">
            <div className="settings-header-row">
              <div>
                <h2>⚙️ Admin Settings</h2>
                <p className="modules-sub">Manage system settings and admin preferences.</p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn ghost"
                  onClick={() => setDark(d => !d)}
                  title="Toggle theme"
                >
                  {dark ? <FaMoon /> : <FaSun />}
                </button>

                <button className="btn ghost" title="Notifications">
                  <FaBell />
                </button>
              </div>
            </div>

            <div className="settings-grid">
              <div className="settings-card">
                <h3 className="card-title">General</h3>

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
                      <span className="slider" />
                    </label>
                  </div>
                </div>

                <div className="settings-row">
                  <div className="settings-left">
                    <div className="row-heading">Email Alerts</div>
                    <div className="row-sub">Important email alerts for admins</div>
                  </div>
                  <div className="settings-right">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.emailAlerts}
                        onChange={() => toggle("emailAlerts")}
                      />
                      <span className="slider" />
                    </label>
                  </div>
                </div>

                <div className="settings-row">
                  <div className="settings-left">
                    <div className="row-heading">Dark Mode</div>
                    <div className="row-sub">Toggle dark theme for admin dashboard</div>
                  </div>
                  <div className="settings-right">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={settings.darkMode}
                        onChange={() => {
                          toggle("darkMode");
                          setDark(d => !d);
                        }}
                      />
                      <span className="slider" />
                    </label>
                  </div>
                </div>

                <div className="settings-row">
                  <div className="settings-left">
                    <div className="row-heading">Auto Logout</div>
                    <div className="row-sub">Idle timeout (minutes)</div>
                  </div>
                  <div className="settings-right">
                    <select
                      className="select"
                      value={settings.autoLogout}
                      onChange={(e) => updateField("autoLogout", Number(e.target.value))}
                    >
                      <option value={5}>5 min</option>
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                      <option value={60}>60 min</option>
                    </select>
                  </div>
                </div>

                <div className="settings-row">
                  <div className="settings-left">
                    <div className="row-heading">Timezone</div>
                    <div className="row-sub">System timezone</div>
                  </div>
                  <div className="settings-right">
                    <select
                      className="select"
                      value={settings.timezone}
                      onChange={(e) => updateField("timezone", e.target.value)}
                    >
                      <option value="UTC">UTC</option>
                      <option value="Asia/Manila">Asia/Manila</option>
                      <option value="America/Los_Angeles">America/Los_Angeles</option>
                      <option value="Europe/London">Europe/London</option>
                    </select>
                  </div>
                </div>

                <div className="panel-actions">
                  <button className="btn ghost" onClick={() => window.location.reload()}>
                    Reset
                  </button>
                  <button className="btn main" onClick={() => alert("Saved (demo)")}>
                    Save
                  </button>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
