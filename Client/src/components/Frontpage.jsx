import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
export default function PanelPage(props) {
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="row justify-content-center g-4 text-center">
        <div className="col-md-4">
          <div className="glass panel-box p-4">
            <h2 className="panel-title">Student</h2>
            <p className="subtitle">For Student</p>
            <Link
              to="/student/portal"
              className="btn neon-btn custom-btn panel-hover-trigger"
            >
              Go to Student Panel
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass panel-box p-4">
            <h2 className="panel-title">Teacher</h2>
            <p className="subtitle">For Teachers</p>
            <Link
              to="/teacher/portal"
              className="btn neon-btn custom-btn panel-hover-trigger"
            >
              Go to Teacher Panel
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="glass panel-box p-4">
            <h2 className="panel-title">Admin</h2>
            <p className="subtitle">For Admin</p>
            <Link
              to="/admin/portal"
              className="btn neon-btn custom-btn panel-hover-trigger"
            >
              Go to Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
