import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";
import { jwtDecode } from "jwt-decode";
import ASidebar from "./SideBar";

export default function ADashboard(props) {
  const navigate = useNavigate();
  const [decoded, setDecoded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loginStatus = localStorage.getItem("IsLogin");
    if (!loginStatus || loginStatus === "") {
      navigate("/");
    } else {
      document.title = props.title;
      try {
        setTimeout(() => {
          const decodedToken = jwtDecode(loginStatus);
          setDecoded(decodedToken);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Invalid token:", err);
        navigate("/");
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("IsLogin");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="fullscreen-loader">
        <RingLoader color="#00f2ff" size={100} />
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100">
      <ASidebar />

      <div className="flex-grow-1 p-4">
        <div className="glass p-4 dashboard-panel">
          <h2 className="panel-title mb-3">📊 Dashboard Overview</h2>
          <p className="subtitle">
            Welcome, {decoded.name}! Use the sidebar to navigate your controls.
          </p>
        </div>
      </div>
    </div>
  );
}
