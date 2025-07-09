import React, { useEffect, useState } from "react";
import axios from "axios";
import ASidebar from "./SideBar";
import { RingLoader } from "react-spinners";

export default function ManageSubject(props) {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    sid: "",
    sname: "",
    classnames: [],
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    document.title = props.title;
    fetchSubjects();
    fetchClasses();
  }, []);

  const fetchSubjects = () => {
    axios
      .get("http://localhost:5555/subjectlist")
      .then((res) => {
        setSubjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch subjects.");
      });
  };

  const fetchClasses = () => {
    axios
      .get("http://localhost:5555/classlist")
      .then((res) => {
        setClasses(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to fetch classes.");
      });
  };

  const handleDelete = (sid) => {
    if (!window.confirm("Are you sure you want to delete this subject?"))
      return;

    axios
      .delete("http://localhost:5555/subjectdelete", { data: { sid } })
      .then(() => {
        alert("Subject deleted.");
        setSubjects((prev) => prev.filter((s) => s.sid !== sid));
      })
      .catch((err) => {
        console.error(err);
        alert("Deletion failed.");
      });
  };

  const handleEdit = (subj) => {
    setEditingSubject(subj.sid);
    setFormData({
      sid: subj.sid,
      sname: subj.sname,
      classnames: subj.classnames.map((cls) => cls.classname),
    });
    setShowForm(true);
  };

  const handleCheckboxChange = (classname) => {
    setFormData((prev) => {
      const isChecked = prev.classnames.includes(classname);
      return {
        ...prev,
        classnames: isChecked
          ? prev.classnames.filter((cls) => cls !== classname)
          : [...prev.classnames, classname],
      };
    });
  };

  const handleSubmit = () => {
    if (!formData.sid || !formData.sname)
      return alert("Please fill out all fields");

    const payload = {
      sid: formData.sid,
      sname: formData.sname,
      classnames: formData.classnames,
    };

    const request = editingSubject
      ? axios.put("http://localhost:5555/subjectupdate", payload)
      : axios.post("http://localhost:5555/subjectadd", payload);

    request
      .then(() => {
        alert(editingSubject ? "Subject updated." : "Subject added.");
        setEditingSubject(null);
        setFormData({ sid: "", sname: "", classnames: [] });
        setShowForm(false);
        fetchSubjects();
      })
      .catch((err) => {
        console.error(err);
        alert("Operation failed.");
      });
  };

  const cancelEdit = () => {
    setEditingSubject(null);
    setFormData({ sid: "", sname: "", classnames: [] });
    setShowForm(false);
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
          <h2 className="panel-title mb-3">📘 Manage Subjects</h2>
          <p className="subtitle">List of available subjects:</p>

          <div className="table-responsive mb-4">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Subject ID</th>
                  <th>Subject Name</th>
                  <th>Classes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.length > 0 ? (
                  subjects.map((subj) => (
                    <tr key={subj.sid}>
                      <td>{subj.sid}</td>
                      <td>{subj.sname}</td>
                      <td>
                        {subj.classnames.length > 0
                          ? subj.classnames.map((c) => c.classname).join(", ")
                          : "None"}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm neon-btn me-2"
                          onClick={() => handleEdit(subj)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm neon-btn"
                          style={{ backgroundColor: "#ff3b3b", color: "#fff" }}
                          onClick={() => handleDelete(subj.sid)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-3">
                      No subjects available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Always show add button unless editing */}
          {!editingSubject && (
            <div className="text-center mb-3">
              <button
                className="btn neon-btn"
                onClick={() => {
                  setFormData({ sid: "", sname: "", classnames: [] });
                  setShowForm(true);
                }}
              >
                ➕ Add New Subject
              </button>
            </div>
          )}

          {(editingSubject || showForm) && (
            <>
              <h5 className="panel-title mb-2">
                {editingSubject ? "✏️ Edit Subject" : "➕ Add New Subject"}
              </h5>

              <div className="glass p-3 mb-3">
                <div className="mb-3">
                  <label className="form-label">Subject ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.sid}
                    onChange={(e) =>
                      setFormData({ ...formData, sid: e.target.value })
                    }
                    disabled={!!editingSubject}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Subject Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.sname}
                    onChange={(e) =>
                      setFormData({ ...formData, sname: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Select Classes</label>
                  <div className="d-flex flex-wrap gap-2">
                    {classes.map((cls) => (
                      <div className="form-check" key={cls.cid}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`check-${cls.cid}`}
                          checked={formData.classnames.includes(cls.cname)}
                          onChange={() => handleCheckboxChange(cls.cname)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`check-${cls.cid}`}
                        >
                          {cls.cname}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn neon-btn" onClick={handleSubmit}>
                    {editingSubject ? "Update Subject" : "Add Subject"}
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
