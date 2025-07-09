import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TLogin(props) {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!data.email || data.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!data.password || data.password.trim() === "") {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    axios
      .post("http://localhost:5555/tlogin", {
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        if (res.data.message === "Success") {
          localStorage.setItem("IsLogin", res.data.token);
          navigate("/teacher/dashboard");
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Login failed");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="glass p-4 form-container panel-box">
        <h2 className="text-center mb-3 panel-title">🔐 Login</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              📧 Email
            </label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              id="email"
              name="email"
              autoComplete="off"
              onChange={handleChange}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              🔒 Password
            </label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              id="password"
              name="password"
              autoComplete="off"
              onChange={handleChange}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <div className="d-grid justify-content-center mt-4">
            <button type="submit" className="btn neon-btn custom-btn">
              Login
            </button>
          </div>

          <div className="toggle-link mt-4 text-center">
            <span>Not registered? </span>
            <Link to="/teacher/register">Register here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
