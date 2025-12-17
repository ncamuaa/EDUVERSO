// src/admin/AdminGame/AdminGame.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
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
import logo from "../../assets/1logo.png";
import "./AdminGame.css";

export default function AdminGame() {
  const navigate = useNavigate();
  const location = useLocation();

  const isViewingRecords = location.pathname.includes("/records/");

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    window.location.href = "/login";
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} className="sidebar-logo" alt="logo" />
          <span className="sidebar-title">EduVerso Admin</span>
        </div>

        <ul className="sidebar-menu">
          <li onClick={() => navigate("/dashboard")}><LuLayoutDashboard /> Dashboard</li>
          <li onClick={() => navigate("/students")}><LuUsers /> Students</li>
          <li onClick={() => navigate("/admin-modules")}><LuBookOpen /> Modules</li>
          <li className="active"><LuGamepad /> Game Arena</li>
          <li onClick={() => navigate("/admin-peerfeedback")}><LuMessageSquare /> Peer Feedback</li>
          <li onClick={() => navigate("/admin-announcements")}><LuMegaphone /> Announcements</li>

          <div className="spacer" />

          <li onClick={() => navigate("/admin-settings")}><LuSettings /> Settings</li>
          <li className="logout" onClick={handleLogout}><LuLogOut /> Logout</li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <div className="game-glass">

          {/* ===== GAME ARENA HOME ===== */}
          {!isViewingRecords && (
            <>
              <h1 className="game-title">🎮 Game Arena</h1>
              <p className="game-subtitle">
                View student performance records collected from the mobile application.
              </p>

              <div className="game-grid">
                <div className="game-card">
                  <h3>Quiz Game</h3>
                  <p>Student quiz attempts</p>
                  <button onClick={() => navigate("records/quiz")}>View Records</button>
                </div>

                <div className="game-card">
                  <h3>Matching Game</h3>
                  <p>Concept & word matching results</p>
                  <button onClick={() => navigate("records/matching")}>View Records</button>
                </div>

                <div className="game-card">
                  <h3>RPS Game</h3>
                  <p>Rock–Paper–Scissors results</p>
                  <button onClick={() => navigate("records/rps")}>View Records</button>
                </div>
              </div>
            </>
          )}

          {/* ===== RECORDS VIEW (NO EXTRA GLASS) ===== */}
          {isViewingRecords && <Outlet />}

        </div>
      </main>
    </div>
  );
}
