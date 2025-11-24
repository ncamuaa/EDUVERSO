// src/admin/StudentProgressScreen/StudentProgressScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// ✅ Fixed paths after reorganizing folders
import { users } from "../../data/users";
import Button from "../../components/ui/Button";

import "./StudentProgressScreen.css";

export default function StudentProgressScreen() {
  const [students, setStudents] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 3;
  const navigate = useNavigate();

  useEffect(() => {
    // Load students
    const studentData = users
      .filter((u) => u.role === "student")
      .map((s) => ({
        ...s,
        modules: [
          { name: "Module 1", lastAccess: "2025-11-04 14:10", duration: "25 min" },
          { name: "Module 2", lastAccess: "2025-11-03 16:30", duration: "15 min" },
        ],
        lastLogin: new Date().toLocaleString(),
      }));

    setStudents(studentData);

    // Fake websocket for online users
    const socket = new WebSocket("ws://localhost:4000");

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "onlineUsers") setOnlineUsers(data.users);
    };

    return () => socket.close();
  }, []);

  const isOnline = (username) =>
    onlineUsers.some((u) => u.username === username && u.online);

  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = students.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(students.length / studentsPerPage);

  return (
    <div className="admin-theme">
      <div className="progress-header">
        <h2>🎓 Student Progress Monitor</h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate("/admin-dashboard")}
        >
          ⬅ Back
        </Button>
      </div>

      <div className="student-grid">
        {currentStudents.map((s, i) => (
          <motion.div
            key={i}
            className="student-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="student-header">
              <div
                className={`status-dot ${isOnline(s.username) ? "online" : "offline"}`}
              ></div>
              <img src={s.avatar} alt={s.username} className="avatar" />
              <div className="info">
                <h3>{s.username}</h3>
                <p className="last-login">Last login: {s.lastLogin}</p>
              </div>
            </div>

            <div className="stats">
              <p>🔥 Streak: {s.streak}</p>
              <p>🎯 XP: {s.xp}</p>
              <p>🏆 Level: {s.level}</p>
            </div>

            <div className="modules">
              <h4>📚 Module Activity</h4>
              {s.modules.map((m, j) => (
                <p key={j}>
                  <strong>{m.name}</strong> — {m.duration} (Last: {m.lastAccess})
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {students.length > 3 && (
        <div className="pagination">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ⬅ Prev
          </Button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next ➡
          </Button>
        </div>
      )}
    </div>
  );
}
