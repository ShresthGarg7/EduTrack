import React, { useEffect, useState } from "react";
import axios from "axios";
import TSidebar from "./SideBar";

export default function TStudyMaterial(props) {
  const [materialList, setMaterialList] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [classList, setClassList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [showForm, setShowForm] = useState(false); // 👈 form toggle state

  useEffect(() => {
    axios
      .get("http://localhost:5555/classlist")
      .then((res) => setClassList(res.data));
    axios
      .get("http://localhost:5555/subjectlist")
      .then((res) => setSubjectList(res.data));
    fetchMaterials();
  }, []);

  const fetchMaterials = () => {
    axios
      .get("http://localhost:5555/readnotes")
      .then((res) => setMaterialList(res.data))
      .catch((err) => console.error("Failed to load materials", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("class_name", className);
    formData.append("subject", subject);
    formData.append("smfile", file);

    axios
      .post("http://localhost:5555/uploadnotes", formData)
      .then(() => {
        alert("Study Material Uploaded");
        setTitle("");
        setDescription("");
        setClassName("");
        setSubject("");
        setFile(null);
        setShowForm(false);
        fetchMaterials();
      })
      .catch((err) => {
        console.error("Upload failed", err);
        alert("Upload failed");
      });
  };

  const handleDelete = (smid) => {
    if (!window.confirm("Are you sure you want to delete this material?"))
      return;

    axios
      .delete("http://localhost:5555/notesdelete", { data: { smid: smid } })
      .then(() => {
        alert("Material deleted successfully");
        fetchMaterials();
      })
      .catch((err) => {
        console.error("Deletion failed", err);
        alert("Failed to delete");
      });
  };

  return (
    <div className="d-flex min-vh-100">
      <TSidebar />
      <div className="flex-grow-1 p-4">
        <div className="glass p-4 dashboard-panel">
          <h2 className="panel-title mb-4">📘 Uploaded Study Materials</h2>

          {materialList.length > 0 ? (
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>SMID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Download</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {materialList.map((mat) => (
                  <tr key={mat.smid}>
                    <td>{mat.smid}</td>
                    <td>{mat.title}</td>
                    <td>{mat.description}</td>
                    <td>{mat.class_name}</td>
                    <td>{mat.subject}</td>
                    <td>{new Date(mat.uploadDate).toLocaleDateString()}</td>
                    <td>
                      <a
                        href={`http://localhost:5555/${mat.filepath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm neon-btn"
                        download
                      >
                        ⬇ Download
                      </a>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(mat.smid)}
                      >
                        ❌ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted text-center">
              No study materials uploaded yet.
            </p>
          )}

          {/* ➕ Add New button placed here after table */}
          <div className="text-center mt-4">
            <button
              className="btn neon-btn"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "➕ Add New"}
            </button>
          </div>
        </div>

        {/* Conditional form rendering */}
        {showForm && (
          <div className="glass p-4 dashboard-panel mt-5">
            <h2 className="panel-title mb-4">📚 Upload Study Material</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={description}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Class</label>
                  <select
                    className="form-select"
                    value={className}
                    required
                    onChange={(e) => setClassName(e.target.value)}
                  >
                    <option value="">Select Class</option>
                    {classList.map((cls) => (
                      <option key={cls.cid} value={cls.cname}>
                        {cls.cname}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Subject</label>
                  <select
                    className="form-select"
                    value={subject}
                    required
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="">Select Subject</option>
                    {subjectList.map((subj) => (
                      <option key={subj.sid} value={subj.sname}>
                        {subj.sname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Upload File</label>
                <input
                  type="file"
                  className="form-control"
                  name="smfile"
                  required
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <button type="submit" className="btn neon-btn">
                🚀 Upload
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
