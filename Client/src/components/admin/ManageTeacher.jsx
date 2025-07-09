import React, { useEffect, useState } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";
import ASidebar from "./SideBar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ManageTeacher(props) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = props.title || "Admin | Manage Teachers";
    const token = localStorage.getItem("IsLogin");
    if (!token) return navigate("/");

    setTimeout(() => {
      try {
        const decodedToken = jwtDecode(token);
        setTimeout(() => {
          axios
            .get("http://localhost:5555/tdisplay")
            .then((res) => {
              setTeachers(res.data);
              setLoading(false);
            })
            .catch((err) => {
              console.error(err);
              alert("Failed to fetch teachers.");
              navigate("/");
            });
        }, 500);
      } catch (err) {
        console.error("Invalid token:", err);
        navigate("/");
      }
    }, 500);
  }, []);

  const toggleActiveStatus = (tid, currentStatus) => {
    const newStatus = !currentStatus;
    axios
      .put("http://localhost:5555/tactivate", { tid, isActive: newStatus })
      .then(() => {
        setTeachers((prev) =>
          prev.map((t) => (t.tid === tid ? { ...t, isActive: newStatus } : t))
        );
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update status");
      });
  };

  const handleDelete = (tid) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this teacher?"
    );
    if (!confirm) return;

    axios
      .delete("http://localhost:5555/tdelete", { data: { tid: tid } })
      .then(() => {
        alert("Teacher Deleted");
        setTeachers((prev) => prev.filter((t) => t.tid !== tid));
      })
      .catch((err) => {
        console.error(err);
        alert("Deletion failed");
      });
  };

  const handleView = (tid) => {
    const teacher = teachers.find((t) => t.tid === tid);
    if (teacher) setSelectedTeacher(teacher);
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
          <h2 className="panel-title mb-3">👩‍🏫 Manage Teachers</h2>
          <p className="subtitle">View and manage all teachers below.</p>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>TID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.tid}>
                    <td>{teacher.tid}</td>
                    <td>{teacher.name}</td>
                    <td>{teacher.email}</td>
                    <td>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={teacher.isActive}
                          onChange={() =>
                            toggleActiveStatus(teacher.tid, teacher.isActive)
                          }
                          id={`statusCheck-${teacher.tid}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`statusCheck-${teacher.tid}`}
                        >
                          {teacher.isActive ? "Active" : "Not Active"}
                        </label>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm neon-btn me-2"
                        onClick={() => handleView(teacher.tid)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-sm neon-btn"
                        style={{ backgroundColor: "#ff3b3b", color: "#fff" }}
                        onClick={() => handleDelete(teacher.tid)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedTeacher && (
            <div className="glass p-4 mt-4">
              <h3 className="panel-title mb-3">👁️ View Teacher Details</h3>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">TID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedTeacher.tid}
                    readOnly
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedTeacher.name}
                    readOnly
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={selectedTeacher.email}
                    readOnly
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Contact</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedTeacher.contact}
                    readOnly
                  />
                </div>
                <div className="col-12 text-end">
                  <button
                    className="btn neon-btn"
                    onClick={() => setSelectedTeacher(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
