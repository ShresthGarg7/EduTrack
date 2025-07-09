import React, { useEffect, useState } from "react";
import axios from "axios";
import TSidebar from "./SideBar";
import { RingLoader } from "react-spinners";
import { jwtDecode } from "jwt-decode";

export default function TMarks(props) {
  const [loading, setLoading] = useState(true);
  const [classList, setClassList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("IsLogin");
    if (!token) return window.location.replace("/");

    try {
      jwtDecode(token);
    } catch {
      return window.location.replace("/");
    }

    document.title = props.title || "Marks";
    axios.get("http://localhost:5555/classlist").then((res) => {
      setClassList(res.data);
    });
    axios.get("http://localhost:5555/subjectlist").then((res) => {
      setSubjectList(res.data);
    });

    setTimeout(() => setLoading(false), 500);
  }, []);

  const fetchStudents = () => {
    if (!selectedClass || !selectedSubject) {
      alert("Please select both class and subject");
      return;
    }

    axios
      .post("http://localhost:5555/filterstudents", {
        className: selectedClass,
        subjectName: selectedSubject,
      })
      .then((res) => {
        const studentData = res.data.map((stu) => {
          const subjectEntry = stu.subjects.find(
            (s) => s.subject === selectedSubject
          );
          return {
            rno: stu.rno,
            name: stu.name,
            class: stu.class,
            marks: subjectEntry?.marks ?? "",
          };
        });
        setStudents(studentData);
      })
      .catch((err) => {
        console.error("Error fetching student info:", err);
      });
  };

  const handleMarksChange = (rno, newMarks) => {
    setStudents((prev) =>
      prev.map((stu) => (stu.rno === rno ? { ...stu, marks: newMarks } : stu))
    );
  };

  const handleSubmit = () => {
    const payload = students.map((stu) => ({
      rno: stu.rno,
      name: stu.name,
      class: stu.class,
      subjects: [
        {
          subject: selectedSubject,
          marks: stu.marks !== "" ? parseFloat(stu.marks) : null,
        },
      ],
    }));

    for (let stu of payload) {
      axios
        .post("http://localhost:5555/stuinfoadd", stu)
        .then(() => {})
        .catch((err) => console.error(err));
    }

    alert("Marks saved/updated");
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
          <h2 className="panel-title mb-4">📝 Enter Marks</h2>

          <div className="row mb-4">
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
                    s.classnames.some((c) => c.classname === selectedClass)
                  )
                  .map((subj) => (
                    <option key={subj.sid} value={subj.sname}>
                      {subj.sname}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button className="btn neon-btn w-100" onClick={fetchStudents}>
                Load Students
              </button>
            </div>
          </div>

          {students.length > 0 && (
            <>
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((stu) => (
                    <tr key={stu.rno}>
                      <td>{stu.rno}</td>
                      <td>{stu.name}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={stu.marks}
                          onChange={(e) =>
                            handleMarksChange(stu.rno, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="d-flex justify-content-end mt-3">
                <button className="btn neon-btn" onClick={handleSubmit}>
                  Save All Marks
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
