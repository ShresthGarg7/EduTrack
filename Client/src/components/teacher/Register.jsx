import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TRegister(props) {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = props.title;
  }, []);

  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const contactRegex = /^\d{10}$/;

    if (!data.name || data.name.trim() === "") {
      newErrors.name = "Full Name is required";
    }

    if (!data.email || data.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!data.password || data.password.trim() === "") {
      newErrors.password = "Password is required";
    }

    if (!data.contact || data.contact.trim() === "") {
      newErrors.contact = "Contact Number is required";
    } else if (!contactRegex.test(data.contact)) {
      newErrors.contact = "Contact Number must be 10 digits";
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
      .post("http://localhost:5555/tsave", {
        name: data.name,
        email: data.email,
        password: data.password,
        contact: data.contact,
      })
      .then((res) => {
        if (res.data.message === "Record Saved") {
          alert(res.data.message);
          navigate("/teacher/portal");
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Registration failed");
      });
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="glass p-4 form-container panel-box">
          <h2 className="text-center mb-4 panel-title">📝 Register</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                👤 Full Name
              </label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                id="name"
                name="name"
                autoComplete="off"
                onChange={handleChange}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>

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
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                id="password"
                name="password"
                autoComplete="off"
                onChange={handleChange}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="contact" className="form-label">
                📱 Contact Number
              </label>
              <input
                type="tel"
                className={`form-control ${errors.contact ? "is-invalid" : ""}`}
                id="contact"
                name="contact"
                autoComplete="off"
                onChange={handleChange}
              />
              {errors.contact && (
                <div className="invalid-feedback">{errors.contact}</div>
              )}
            </div>

            <div className="d-grid justify-content-center mt-4">
              <button type="submit" className="btn neon-btn custom-btn">
                Register
              </button>
            </div>

            <div className="toggle-link mt-4 text-center">
              <span>Already registered? </span>
              <Link to="/teacher/login">Login here</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
