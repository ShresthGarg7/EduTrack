import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function SPortal(props) {
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="glass text-center p-4 form-container panel-box">
        <h2 className="mb-3 panel-title">Welcome 👋</h2>
        <p className="subtitle">Student Portal</p>
        <div className="d-flex flex-column align-items-center gap-3">
          <Link className="btn neon-btn custom-btn" to="/student/login">
            🔐 Login
          </Link>
          <Link className="btn neon-btn custom-btn" to="/student/register">
            📝 Register
          </Link>
        </div>
      </div>
    </div>
  );
}
