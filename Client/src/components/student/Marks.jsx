import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import SSidebar from "./SideBar";

export default function StudentMarks(props) {
  const [rno, setRno] = useState(null);
  const [className, setClassName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [marksData, setMarksData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("IsLogin");
    if (!token) return (window.location.href = "/");

    try {
      const decoded = jwtDecode(token);
      setRno(decoded.rno);
    } catch {
      return (window.location.href = "/");
    }
  }, []);

  useEffect(() => {
    if (!rno) return;
    axios
      .post("http://localhost:5555/studentmarks", { rno })
      .then((res) => {
        setClassName(res.data.class);
        setStudentName(res.data.name);
        setMarksData(res.data.marks);
      })
      .catch((err) => {
        console.error("Error fetching marks", err);
      });
  }, [rno]);

  return (
    <div className="d-flex min-vh-100">
      <SSidebar />
      <div className="flex-grow-1 p-4">
        <div className="glass p-4 dashboard-panel">
          <h2 className="panel-title mb-4">🎓 My Marks</h2>
          <h5 className="mb-2">
            👤 Name: <span className="text-info">{studentName}</span>
          </h5>
          <h5 className="mb-4">
            🏫 Class: <span className="text-success">{className}</span>
          </h5>

          {marksData.length > 0 ? (
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {marksData.map((entry, idx) => (
                  <tr key={idx}>
                    <td>{entry.subject}</td>
                    <td>{entry.marks !== null ? entry.marks : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted text-center mt-3">
              No marks available for your class and subjects.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
