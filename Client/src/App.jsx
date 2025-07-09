import Frontpage from "./components/Frontpage";

import TLogin from "./components/teacher/Login";
import TRegister from "./components/teacher/Register";
import TPortal from "./components/teacher/Portal";
import TDashboard from "./components/teacher/Dashboard";
import TProfile from "./components/teacher/Profile";
import TAttendence from "./components/teacher/Attendence";
import TMarks from "./components/teacher/Marks";

import SLogin from "./components/student/Login";
import SRegister from "./components/student/Register";
import SPortal from "./components/student/Portal";
import SDashboard from "./components/student/Dashboard";
import SProfile from "./components/student/Profile";
import StudentAttendance from "./components/student/Attendence";
import StudentMarks from "./components/student/Marks";

import ALogin from "./components/admin/Login";
import ARegister from "./components/admin/Register";
import APortal from "./components/admin/Portal";
import ADashboard from "./components/admin/Dashboard";
import AProfile from "./components/admin/Profile";
import ManageTeacher from "./components/admin/ManageTeacher";
import ManageClass from "./components/admin/ManageClass";
import ManageSubject from "./components/admin/ManageSubject";
import ManageStudent from "./components/admin/ManageStudent";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import TStudyMaterial from "./components/teacher/Uploadnotes";
import SStudyMaterial from "./components/student/Readnotes";

function App() {
  return (
    <div className="bg-img">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Frontpage title="FrontPage" />} />

          {/* Teacher */}

          <Route
            path="/teacher/portal"
            element={<TPortal title="Teacher's Panel" />}
          />
          <Route path="/teacher/login" element={<TLogin title="Login" />} />
          <Route
            path="/teacher/attendence"
            element={<TAttendence title="Attendence" />}
          />
          <Route
            path="/teacher/profile"
            element={<TProfile title="Profile" />}
          />
          <Route
            path="/teacher/register"
            element={<TRegister title="Register" />}
          />
          <Route path="/teacher/marks" element={<TMarks title="Marks" />} />
          <Route path="/teacher/data" element={<TStudyMaterial title="Study Material" />} />
          <Route
            path="/teacher/dashboard"
            element={<TDashboard title="Teacher Dashboard" />}
          />

          {/* Student */}

          <Route
            path="/student/portal"
            element={<SPortal title="Student's Panel" />}
          />
          <Route path="/student/login" element={<SLogin title="Login" />} />
          <Route path="/student/data" element={<SStudyMaterial title="Study Material" />} />
          <Route
            path="/student/marks"
            element={<StudentMarks title="Marks" />}
          />
          <Route
            path="/student/attendance"
            element={<StudentAttendance title="Attendance" />}
          />
          <Route
            path="/student/profile"
            element={<SProfile title="Profile" />}
          />
          <Route
            path="/student/register"
            element={<SRegister title="Register" />}
          />
          <Route
            path="/student/dashboard"
            element={<SDashboard title="Student Dashboard" />}
          />

          {/* Admin */}

          <Route
            path="/admin/portal"
            element={<APortal title="Admin's Panel" />}
          />
          <Route path="/admin/login" element={<ALogin title="Login" />} />
          <Route path="/admin/profile" element={<AProfile title="Profile" />} />
          <Route
            path="/admin/class"
            element={<ManageClass title="Manage Class" />}
          />
          <Route
            path="/admin/subject"
            element={<ManageSubject title="Manage Subject" />}
          />
          <Route
            path="/admin/student"
            element={<ManageStudent title="Manage Student" />}
          />
          <Route
            path="/admin/teacher"
            element={<ManageTeacher title="Manage Teacher" />}
          />
          <Route
            path="/admin/register"
            element={<ARegister title="Register" />}
          />
          <Route
            path="/admin/dashboard"
            element={<ADashboard title="Admin Dashboard" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
