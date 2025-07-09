import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function APortal(props) {
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="glass text-center p-4 form-container panel-box">
        <h2 className="mb-3 panel-title">Welcome 👋</h2>
        <p className="subtitle">Admin Portal</p>
        <div className="d-flex flex-column align-items-center gap-3">
          <Link className="btn neon-btn custom-btn" to="/admin/login">
            🔐 Login
          </Link>
          <Link className="btn neon-btn custom-btn" to="/admin/register">
            📝 Register
          </Link>
        </div>
      </div>
    </div>
  );
}
