import React, { useEffect, useState } from "react";
import axios from "axios";
import TSidebar from "./SideBar";
import { RingLoader } from "react-spinners";
import { jwtDecode } from "jwt-decode";

export default function TAttendance(props) {
  const [loading, setLoading] = useState(true);
  const [decoded, setDecoded] = useState(null);
  const [classList, setClassList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [students, setStudents] = useState([]);
  const [history, setHistory] = useState([]);

  const [mode, setMode] = useState("none");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("IsLogin");
    if (!token) return window.location.replace("/");

    try {
      const decodedToken = jwtDecode(token);
      setDecoded(decodedToken);
    } catch {
      return window.location.replace("/");
    }

    document.title = props.title || "Attendance";
    loadData();
    setTimeout(() => setLoading(false), 500);
  }, []);

  const loadData = () => {
    axios
      .get("http://localhost:5555/classlist")
      .then((res) => setClassList(res.data));
    axios
      .get("http://localhost:5555/subjectlist")
      .then((res) => setSubjectList(res.data));
    axios
      .get("http://localhost:5555/attendancelist")
      .then((res) => setHistory(res.data));
  };

  const fetchStudents = () => {
    console.log(
      "Fetching students for class:",
      selectedClass,
      "and subject:",
      selectedSubject
    );
    axios
      .post("http://localhost:5555/filterstudents", {
        className: selectedClass,
        subjectName: selectedSubject,
      })
      .then((res) => {
        console.log("Filtered students:", res.data);
        setStudents(res.data);
        const initialAttendance = res.data.map((s) => ({
          rno: s.rno,
          class: selectedClass,
          subject: selectedSubject,
          attend_date: new Date().toISOString().split("T")[0],
          isAttend: false,
        }));
        setAttendance(initialAttendance);
      })
      .catch((err) => {
        console.error("Error fetching filtered students", err);
      });
  };

  const handleToggle = (rno) => {
    setAttendance((prev) =>
      prev.map((rec) =>
        rec.rno === rno ? { ...rec, isAttend: !rec.isAttend } : rec
      )
    );
  };

  const handleSubmit = () => {
    if (!selectedClass || !selectedSubject || attendance.length === 0) {
      return alert("Please load students first.");
    }

    axios
      .post("http://localhost:5555/markattendance", {
        className: selectedClass,
        subjectName: selectedSubject,
        attendance,
      })
      .then(() => {
        alert("Attendance Saved");
        resetForm();
        loadData();
      })
      .catch((err) => {
        console.error(err);
        alert("Error saving attendance");
      });
  };

  const handleEdit = (cls, subject, date) => {
    console.log("Editing attendance for:", cls, subject, date);
    setMode("edit");
    setSelectedClass(cls);
    setSelectedSubject(subject);
    setSelectedDate(date);

    axios
      .post("http://localhost:5555/getattendance", {
        class: cls,
        subject,
        attend_date: date,
      })
      .then((res) => {
        console.log("Attendance fetched for editing:", res.data);
        setAttendance(res.data);
      })
      .catch((err) => {
        console.error("Error fetching attendance for edit", err);
      });
  };

  const handleUpdate = () => {
    axios
      .post("http://localhost:5555/updateattendance", { attendance })
      .then(() => {
        alert("Attendance Updated");
        resetForm();
        loadData();
      })
      .catch((err) => {
        console.error(err);
        alert("Error updating attendance");
      });
  };

  const resetForm = () => {
    setMode("none");
    setSelectedClass("");
    setSelectedSubject("");
    setSelectedDate("");
    setAttendance([]);
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
          <h2 className="panel-title mb-3">📋 Attendance</h2>

          <h5 className="mb-3">📜 Attendance History</h5>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Class</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((rec, idx) => (
                  <tr key={idx}>
                    <td>{rec.class}</td>
                    <td>{rec.subject}</td>
                    <td>{rec.attend_date}</td>
                    <td>
                      <button
                        className="btn btn-sm neon-btn"
                        onClick={() =>
                          handleEdit(rec.class, rec.subject, rec.attend_date)
                        }
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-muted">
                    No attendance records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {mode === "none" && (
            <div className="text-center my-4">
              <button className="btn neon-btn" onClick={() => setMode("new")}>
                ➕ Mark Attendance
              </button>
            </div>
          )}

          {(mode === "new" || mode === "edit") && (
            <div className="glass p-4 mt-4">
              <h5 className="mb-3">
                {mode === "new" ? "📝 Mark Attendance" : "✏️ Edit Attendance"}
              </h5>

              {/* Form Header */}
              <div className="row mb-3">
                {mode === "edit" ? (
                  <>
                    <div className="col-md-6">
                      <label className="form-label">Class</label>
                      <input
                        className="form-control"
                        value={selectedClass}
                        disabled
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Subject</label>
                      <input
                        className="form-control"
                        value={selectedSubject}
                        disabled
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-md-4">
                      <label className="form-label">Class</label>
                      <select
                        className="form-select"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        <option value="">Select Class</option>
                        {classList.map((cls) => (
                          <option key={cls.cid} value={cls.cname}>
                            {cls.cname}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Subject</label>
                      <select
                        className="form-select"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                      >
                        <option value="">Select Subject</option>
                        {subjectList
                          .filter((s) =>
                            s.classnames.some(
                              (c) => c.classname === selectedClass
                            )
                          )
                          .map((subj) => (
                            <option key={subj.sid} value={subj.sname}>
                              {subj.sname}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                      <button
                        className="btn neon-btn w-100"
                        onClick={fetchStudents}
                      >
                        Load Students
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Attendance Table */}
              {attendance.length > 0 ? (
                <>
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Present?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((stu) => (
                        <tr key={stu.rno}>
                          <td>{stu.rno}</td>
                          <td>
                            <input
                              type="checkbox"
                              checked={stu.isAttend}
                              onChange={() => handleToggle(stu.rno)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="d-flex gap-2 mt-3">
                    <button
                      className="btn neon-btn"
                      onClick={mode === "new" ? handleSubmit : handleUpdate}
                    >
                      {mode === "new" ? "Save Attendance" : "Update Attendance"}
                    </button>
                    <button className="btn btn-secondary" onClick={resetForm}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-muted text-center mt-3">
                  No students found for this class and subject.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
