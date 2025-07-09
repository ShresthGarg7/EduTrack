import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("IsLogin");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="text-center mb-4">
        <h2 className="panel-title mb-0">👨🏻‍🎓 Student</h2>
        <p className="subtitle" style={{ fontSize: "14px" }}>
          Dashboard Menu
        </p>
      </div>

      <nav className="sidebar-nav">
        <Link to="/student/dashboard" className="sidebar-link">
          📊 Dashboard
        </Link>
        <Link to="/student/profile" className="sidebar-link">
          👤 Profile
        </Link>
        <Link to="/student/attendance" className="sidebar-link">
          📋 Attendance
        </Link>
        <Link to="/student/marks" className="sidebar-link">
          🎓 Marks
        </Link>
        <Link to="/student/data" className="sidebar-link">
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
