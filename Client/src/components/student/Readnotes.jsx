import React, { useEffect, useState } from "react";
import axios from "axios";
import SSidebar from "./SideBar";
import { jwtDecode } from "jwt-decode";
import { RingLoader } from "react-spinners";

export default function SStudyMaterial(props) {
  const [loading, setLoading] = useState(true);
  const [rno, setRno] = useState(null);
  const [materialList, setMaterialList] = useState([]);
  const [className, setClassName] = useState("");
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("IsLogin");
    if (!token) return window.location.replace("/");

    try {
      const decoded = jwtDecode(token);
      setRno(decoded.rno);
    } catch {
      return window.location.replace("/");
    }
  }, []);

  useEffect(() => {
    if (!rno) return;

    // Get student's class & subjects
    axios
      .get("http://localhost:5555/stuinfo")
      .then((res) => {
        const stu = res.data.find((s) => s.rno == rno);
        if (stu) {
          setClassName(stu.class);
          setSubjects(stu.subjects.map((s) => s.subject));
        }
      })
      .catch((err) => {
        console.error("Error loading student info", err);
      });
  }, [rno]);

  useEffect(() => {
    if (!className || subjects.length === 0) return;

    // Get study material list
    axios
      .get("http://localhost:5555/readnotes")
      .then((res) => {
        const filtered = res.data.filter(
          (mat) =>
            mat.class_name === className && subjects.includes(mat.subject)
        );
        setMaterialList(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading materials", err);
        setLoading(false);
      });
  }, [className, subjects]);

  if (loading) {
    return (
      <div className="fullscreen-loader">
        <RingLoader color="#00f2ff" size={100} />
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100">
      <SSidebar />
      <div className="flex-grow-1 p-4">
        <div className="glass p-4 dashboard-panel">
          <h2 className="panel-title mb-4">📘 Study Material</h2>
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
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted text-center">
              No study materials available for your class and subjects.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
