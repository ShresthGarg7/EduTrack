import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ASidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("IsLogin");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="text-center mb-4">
        <h2 className="panel-title mb-0">👨🏻‍💻 Admin</h2>
        <p className="subtitle" style={{ fontSize: "14px" }}>
          Dashboard Menu
        </p>
      </div>

      <nav className="sidebar-nav">
        <Link to="/admin/dashboard" className="sidebar-link">
          📊 Dashboard
        </Link>
        <Link to="/admin/profile" className="sidebar-link">
          👤 Profile
        </Link>
        <Link to="/admin/teacher" className="sidebar-link">
          👩‍🏫 Manage Teachers
        </Link>
        <Link to="/admin/class" className="sidebar-link">
          🏫 Manage Class
        </Link>
        <Link to="/admin/subject" className="sidebar-link">
          📚 Manage Subjects
        </Link>
        <Link to="/admin/student" className="sidebar-link">
          🎓 Manage Students
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
