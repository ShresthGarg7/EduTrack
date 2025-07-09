import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RingLoader } from "react-spinners";
import { jwtDecode } from "jwt-decode";
import TSidebar from "./SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function TProfile(props) {
  const navigate = useNavigate();
  const [decoded, setDecoded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    tid: "",
    name: "",
    email: "",
    password: "",
    contact: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("IsLogin");
    if (!token || token === "") {
      navigate("/");
      return;
    }

    document.title = props.title;
    // First timeout: decode token
    setTimeout(() => {
      try {
        const decodedToken = jwtDecode(token);
        setDecoded(decodedToken);

        // Second timeout: after token is decoded, fetch data
        setTimeout(() => {
          axios
            .get(`http://localhost:5555/tsearch/${decodedToken.tid}`)
            .then((res) => {
              if (res.data.message === "Found") {
                const tid = res.data.data[0].tid;
                const name = res.data.data[0].name;
                const email = res.data.data[0].email;
                const password = res.data.data[0].password;
                const contact = res.data.data[0].contact;
                setFormData({ tid, name, email, password, contact });
                setLoading(false);
              } else {
                alert(res.data.message);
                navigate("/");
              }
            })
            .catch((err) => {
              console.error(err);
              alert("Failed to fetch profile.");
              navigate("/");
            });
        }, 500);
      } catch (err) {
        console.error("Invalid token:", err);
        navigate("/");
      }
    }, 500);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const confirm = window.confirm(
      "Are you sure you want to update your profile?"
    );
    if (!confirm) return;

    axios
      .put("http://localhost:5555/tedit", formData)
      .then((res) => {
        if (res.data.message === "Updated") {
          alert("Account Details Updated Successfully");
          navigate("/teacher/dashboard");
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Updation failed");
      });
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
      <TSidebar />

      <div className="flex-grow-1 p-4">
        <div className="glass p-4 dashboard-panel">
          <h2 className="panel-title mb-3">👤 Profile</h2>
          <p className="subtitle">Update your account information below.</p>

          <form className="row g-4" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label className="form-label">Teacher ID (TID)</label>
              <input
                type="text"
                className="form-control"
                value={formData.tid}
                disabled
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  className="input-group-text"
                  style={{
                    cursor: "pointer",
                    background: "transparent",
                    border: "none",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    style={{ color: "#00f2ff" }}
                  />
                </span>
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="contact"
                className="form-control"
                value={formData.contact}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 d-flex justify-content-center mt-3">
              <button type="submit" className="custom-btn neon-btn">
                💾 Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
