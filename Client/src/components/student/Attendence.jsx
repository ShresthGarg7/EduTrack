import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Bar } from "react-chartjs-2";
import SSidebar from "./SideBar";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StudentAttendance(props) {
  const [rno, setRno] = useState(null);
  const [className, setClassName] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);

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
      .post("http://localhost:5555/studentattendance", { rno })
      .then((res) => {
        setClassName(res.data.class);
        setAttendanceData(res.data.attendance);
      })
      .catch((err) => {
        console.error("Error fetching attendance", err);
      });
  }, [rno]);

  const data = {
    labels: attendanceData.map((a) => a.subject),
    datasets: [
      {
        label: "Attendance %",
        data: attendanceData.map((a) => a.percentage),
        backgroundColor: "#00c3ff",
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10,
          callback: (val) => `${val}%`,
        },
        title: {
          display: true,
          text: "Attendance (%)",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw}% attendance`,
        },
      },
    },
  };

  return (
    <div className="d-flex min-vh-100">
      <SSidebar />
      <div className="flex-grow-1 p-4">
        <div className="glass dashboard-panel p-4">
          <h2 className="panel-title mb-4">📊 My Attendance Overview</h2>
          <h5 className="text-muted mb-4">
            🏫 Enrolled Class: <strong>{className}</strong>
          </h5>

          {attendanceData.length > 0 ? (
            <>
              <div
                className="chart-container mb-4 p-4 bg-white shadow rounded"
                style={{ maxWidth: "800px", height: "400px" }}
              >
                <Bar data={data} options={options} />
              </div>

              <div className="mt-4">
                <h6 className="mb-3 fw-bold" style={{ color: "#00f2ff" }}>
                  📋 Subject-wise Summary
                </h6>

                <ul className="list-group">
                  {attendanceData.map((record, idx) => (
                    <li
                      key={idx}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>{record.subject}</span>
                      <span className="badge bg-primary rounded-pill">
                        {record.percentage}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="text-muted text-center mt-5">
              ⛔ No attendance records found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
