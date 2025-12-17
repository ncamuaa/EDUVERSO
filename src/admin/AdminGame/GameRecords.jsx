// src/admin/AdminGame/GameRecords.jsx
import { useParams, useNavigate } from "react-router-dom";
import "./GameRecords.css";

export default function GameRecords() {
  const { gameType } = useParams();
  const navigate = useNavigate();

  // 🔹 Sample data (replace with backend later)
  const records = [
    {
      id: 1,
      student: "Juan Dela Cruz",
      score: "8 / 10",
      percentage: "80%",
      xp: 20,
      date: "2025-12-16",
    },
    {
      id: 2,
      student: "Maria Santos",
      score: "9 / 10",
      percentage: "90%",
      xp: 30,
      date: "2025-12-16",
    },
  ];

  return (
    <div className="game-records-container">
      <button className="back-btn" onClick={() => navigate("/admin-games")}>
        ← Back to Game Arena
      </button>

      <h2 className="records-title">
        🎮 {gameType.toUpperCase()} Game Records
      </h2>

      <table className="records-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Score</th>
            <th>Percentage</th>
            <th>XP Earned</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.student}</td>
              <td>{r.score}</td>
              <td>{r.percentage}</td>
              <td>{r.xp}</td>
              <td>{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
