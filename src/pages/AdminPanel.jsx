// AdminPanel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-panel-container">
      <h2>Admin Panel 🚀</h2>
      <p>Manage jobs, internships, courses, and more efficiently.</p>
      <div className="admin-buttons">
        <button className="admin-btn" onClick={() => navigate("/manage/jobs")}>💼 Manage Jobs</button>
        <button className="admin-btn" onClick={() => navigate("/manage/internships")}>🎓 Manage Internships</button>
        <button className="admin-btn" onClick={() => navigate("/manage/courses")}>📚 Manage Courses</button>
        <button className="admin-btn" onClick={() => navigate("/manage/skills")}>🛠️ Upload New Skills</button>
        <button className="admin-btn" onClick={() => navigate("/manage/career-roadmaps")}>🗺️ Upload Career Roadmaps</button>
      </div>
      <footer className="admin-footer">
        <p>👨‍💻 Designed for efficiency | ✨ Keep your listings updated!</p>
      </footer>
    </div>
  );
};

export default AdminPanel;
