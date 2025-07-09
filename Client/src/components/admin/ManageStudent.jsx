import React, { useEffect, useState } from "react";
import axios from "axios";
import ASidebar from "./SideBar";
import { RingLoader } from "react-spinners";

export default function ManageStudent(props) {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedRno, setSelectedRno] = useState(null);
  const [formData, setFormData] = useState({
    rno: "",
    name: "",
    class: "",
    subjects: [],
  });

  useEffect(() => {
    document.title = props.title || "Admin | Manage Student Academic Info";
    fetchRecords();
    fetchStudents();
    fetchClasses();
    fetchSubjects();
  }, []);

  const fetchRecords = () => {
    axios
      .get("http://localhost:5555/stuinfo")
      .then((res) => {
        setRecords(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const fetchStudents = () => {
    axios
      .get("http://localhost:5555/sdisplay")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  };

  const fetchClasses = () => {
    axios
      .get("http://localhost:5555/classlist")
      .then((res) => setClasses(res.data))
      .catch((err) => console.error(err));
  };

  const fetchSubjects = () => {
    axios
      .get("http://localhost:5555/subjectlist")
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error(err));
  };

  const handleView = (rno) => {
    const student = students.find((s) => s.rno === rno);
    if (!student) return alert("Student not found");

    const record = records.find((rec) => rec.rno === rno);
    setFormData(
      record || {
        rno: student.rno,
        name: student.name,
        class: "",
        subjects: [],
      }
    );
    setSelectedRno(rno);
  };

  const handleDelete = (rno) => {
    if (!window.confirm("Delete this academic record?")) return;

    axios
      .delete("http://localhost:5555/stuinfodelete", { data: { rno } })
      .then(() => {
        alert("Record deleted");
        fetchRecords();
        setSelectedRno(null);
      })
      .catch((err) => console.error(err));
  };

  const handleClassChange = (selectedClass) => {
    const relatedSubjects = subjects
      .filter((s) => s.classnames.some((c) => c.classname === selectedClass))
      .map((s) => ({
        subject: s.sname,
        marks: null,
      }));

    setFormData((prev) => ({
      ...prev,
      class: selectedClass,
      subjects: relatedSubjects,
    }));
  };

  const handleSave = () => {
    if (!formData.class) return alert("Select a class");

    axios
      .post("http://localhost:5555/stuinfoadd", formData)
      .then(() => {
        alert("Academic info saved");
        fetchRecords();
        setSelectedRno(null);
        setFormData({ rno: "", name: "", class: "", subjects: [] });
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to save");
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
      <ASidebar />
      <div className="flex-grow-1 p-4">
        <div className="glass p-4 dashboard-panel">
          <h2 className="panel-title mb-3">🎓 Manage Student Academic Info</h2>

          {/* Existing Records */}
          <div className="table-responsive mb-4">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Subjects</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records.map((rec) => (
                    <tr key={rec.rno}>
                      <td>{rec.rno}</td>
                      <td>{rec.name}</td>
                      <td>{rec.class}</td>
                      <td>{rec.subjects.map((s) => s.subject).join(", ")}</td>
                      <td>
                        <button
                          className="btn btn-sm neon-btn me-2"
                          onClick={() => handleView(rec.rno)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm neon-btn"
                          style={{ backgroundColor: "#ff3b3b", color: "#fff" }}
                          onClick={() => handleDelete(rec.rno)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-3">
                      No academic records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add Academic Info */}
          {!selectedRno && (
            <div className="glass p-3">
              <h5 className="panel-title mb-2">➕ Add Academic Info</h5>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Add Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.filter(
                      (stu) => !records.some((rec) => rec.rno === stu.rno)
                    ).length > 0 ? (
                      students
                        .filter(
                          (stu) => !records.some((rec) => rec.rno === stu.rno)
                        )
                        .map((stu) => (
                          <tr key={stu.rno}>
                            <td>{stu.rno}</td>
                            <td>{stu.name}</td>
                            <td>
                              <button
                                className="btn btn-sm neon-btn"
                                onClick={() => {
                                  setFormData({
                                    rno: stu.rno,
                                    name: stu.name,
                                    class: "",
                                    subjects: [],
                                  });
                                  setSelectedRno(stu.rno);
                                }}
                              >
                                Add Info
                              </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">
                          All students have academic info.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Academic Info Form */}
          {selectedRno && (
            <>
              <h5 className="panel-title mb-2">📄 Student Academic Form</h5>
              <div className="glass p-3 mb-3">
                <div className="mb-3">
                  <label className="form-label">Roll No</label>
                  <input
                    className="form-control"
                    value={formData.rno}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    value={formData.name}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Select Class</label>
                  <select
                    className="form-select"
                    value={formData.class}
                    onChange={(e) => handleClassChange(e.target.value)}
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.cid} value={cls.cname}>
                        {cls.cname}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Subjects</label>
                  <ul className="list-group">
                    {formData.subjects.map((s, idx) => (
                      <li key={idx} className="list-group-item">
                        {s.subject}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn neon-btn" onClick={handleSave}>
                    Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedRno(null)}
                  >
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
