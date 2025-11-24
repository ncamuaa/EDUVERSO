import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { FaBars } from "react-icons/fa";
import "./StudentProfile.css";
import logo1 from "../assets/1logo.png";


export default function StudentProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state;

  if (!student) return <h2>Student not found</h2>;

  return (
    <div className="admin-layout">

      {/* SIDEBAR SAME AS STUDENTLIST */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-header">
            <img src={logo1} alt="logo" className="sidebar-logo" />
            <span className="sidebar-title">EduVerso Admin</span>
          </div>

          <button className="sidebar-collapse-btn">
            <FaBars />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li onClick={() => navigate("/admin-dashboard")}>
            <span className="menu-icon"><LuLayoutDashboard /></span>
            <span className="menu-text">Dashboard</span>
          </li>

          <li onClick={() => navigate("/students")} className="active">
            <span className="menu-icon"><LuUsers /></span>
            <span className="menu-text">Students</span>
          </li>

          <li><span className="menu-icon"><LuBookOpen /></span><span className="menu-text">Modules</span></li>
          <li><span className="menu-icon"><LuBrain /></span><span className="menu-text">Quiz Arena</span></li>
          <li><span className="menu-icon"><LuMessageSquare /></span><span className="menu-text">Peer Feedback</span></li>
          <li><span className="menu-icon"><LuMegaphone /></span><span className="menu-text">Announcements</span></li>

          <div className="spacer"></div>

          <li><span className="menu-icon"><LuSettings /></span><span className="menu-text">Settings</span></li>
          <li className="logout"><span className="menu-icon"><LuLogOut /></span><span className="menu-text">Logout</span></li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        <button className="back-btn" onClick={() => navigate("/students")}>
          ← Back
        </button>

        <div className="profile-wrapper">

          <img src={student.avatar} className="profile-avatar" />
          <h2 className="profile-name">{student.username}</h2>

          <div className="level-tag">Level {student.level}</div>

          <div className="stats-card">
            <div><strong>{student.xp}</strong><span> XP</span></div>
            <div><strong>{student.streak}</strong><span> 🔥 Streak</span></div>
          </div>

          <div className="info-card">
            <h3>📘 Details</h3>
            <p><strong>Username:</strong> {student.username}</p>
            <p><strong>Level:</strong> {student.level}</p>
            <p><strong>XP:</strong> {student.xp}</p>
            <p><strong>Streak:</strong> {student.streak}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
