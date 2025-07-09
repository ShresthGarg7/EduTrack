import React, { useEffect, useState } from "react";
import axios from "axios";
import ASidebar from "./SideBar";
import { RingLoader } from "react-spinners";

export default function ManageClass(props) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({ cid: "", cname: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    document.title = props.title;
    fetchClasses();
  }, []);

  const fetchClasses = () => {
    axios
      .get("http://localhost:5555/classlist")
      .then((res) => {
        setClasses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch classes.");
      });
  };

  const handleDelete = (cid) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    axios
      .delete("http://localhost:5555/classdelete", { data: { cid: cid } })
      .then(() => {
        alert("Class deleted.");
        setClasses((prev) => prev.filter((cls) => cls.cid !== cid));
      })
      .catch((err) => {
        console.error(err);
        alert("Deletion failed.");
      });
  };

  const handleEdit = (cls) => {
    setEditingClass(cls.cid);
    setFormData({ cid: cls.cid, cname: cls.cname });
    setShowAddForm(true);
  };

  const handleSubmit = () => {
    if (!formData.cid || !formData.cname)
      return alert("Please fill out all fields");

    if (editingClass) {
      axios
        .put("http://localhost:5555/classupdate", formData)
        .then(() => {
          alert("Class updated.");
          setEditingClass(null);
          setFormData({ cid: "", cname: "" });
          setShowAddForm(false);
          fetchClasses();
        })
        .catch((err) => {
          console.error(err);
          alert("Update failed.");
        });
    } else {
      axios
        .post("http://localhost:5555/classadd", formData)
        .then(() => {
          alert("Class added.");
          setFormData({ cid: "", cname: "" });
          setShowAddForm(false);
          fetchClasses();
        })
        .catch((err) => {
          console.error(err);
          alert("Addition failed.");
        });
    }
  };

  const cancelEdit = () => {
    setEditingClass(null);
    setFormData({ cid: "", cname: "" });
    setShowAddForm(false);
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
          <h2 className="panel-title mb-3">🏫 Manage Classes</h2>
          <p className="subtitle">List of available classes:</p>

          <div className="table-responsive mb-4">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Class ID</th>
                  <th>Class Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.length > 0 ? (
                  classes.map((cls) => (
                    <tr key={cls.cid}>
                      <td>{cls.cid}</td>
                      <td>{cls.cname}</td>
                      <td>
                        <button
                          className="btn btn-sm neon-btn me-2"
                          onClick={() => handleEdit(cls)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm neon-btn"
                          style={{ backgroundColor: "#ff3b3b", color: "#fff" }}
                          onClick={() => handleDelete(cls.cid)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-3">
                      No classes available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!editingClass && !showAddForm && (
            <div className="text-center mb-3">
              <button
                className="btn neon-btn"
                onClick={() => {
                  setFormData({ cid: "", cname: "" });
                  setShowAddForm(true);
                }}
              >
                ➕ Add New Class
              </button>
            </div>
          )}

          {(editingClass || showAddForm) && (
            <>
              <h5 className="panel-title mb-2">
                {editingClass ? "✏️ Edit Class" : "➕ Add New Class"}
              </h5>

              <div className="glass p-3 mb-3">
                <div className="mb-3">
                  <label className="form-label">Class ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.cid}
                    onChange={(e) =>
                      setFormData({ ...formData, cid: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Class Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.cname}
                    onChange={(e) =>
                      setFormData({ ...formData, cname: e.target.value })
                    }
                  />
                </div>

                <div className="d-flex gap-2">
                  <button className="btn neon-btn" onClick={handleSubmit}>
                    {editingClass ? "Update Class" : "Add Class"}
                  </button>
                  <button className="btn btn-secondary" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
