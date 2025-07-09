import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("IsLogin");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="text-center mb-4">
        <h2 className="panel-title mb-0">🧑🏻‍🏫 Teacher</h2>
        <p className="subtitle" style={{ fontSize: "14px" }}>
          Dashboard Menu
        </p>
      </div>

      <nav className="sidebar-nav">
        <Link to="/teacher/dashboard" className="sidebar-link">
          📊 Dashboard
        </Link>
        <Link to="/teacher/profile" className="sidebar-link">
          👤 Profile
        </Link>
        <Link to="/teacher/attendence" className="sidebar-link">
          📋 Attendance
        </Link>
        <Link to="/teacher/marks" className="sidebar-link">
          🎓 Marks
        </Link>
        <Link to="/teacher/data" className="sidebar-link">
          📚 Study Material
        </Link>
      </nav>

      <div className="mt-auto w-100 text-center pt-3">
        <Link
          to="/"
          className="sidebar-link"
          onClick={(e) => {
            e.preventDefault();
            logout();
          }}
        >
          🔙 Logout
        </Link>
      </div>
    </aside>
  );
}
