import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ModuleViewer.css";

export default function ModuleViewer({ modules }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const moduleData = modules.find(m => m.id === parseInt(id));

  if (!moduleData) {
    return <h2 style={{ color: "white", padding: "20px" }}>Module not found.</h2>;
  }

  return (
    <div className="viewer-container">
      <button className="back-btn" onClick={() => navigate("/admin-modules")}>
        ⬅ Back
      </button>

      <h2 className="viewer-title">{moduleData.title}</h2>

      {moduleData.files.map((file, index) => (
        <div key={index} className="pdf-box">
          <h3>Lesson {index + 1}</h3>
          <iframe src={file} className="pdf-iframe"></iframe>
        </div>
      ))}
    </div>
  );
}
