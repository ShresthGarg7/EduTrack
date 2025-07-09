const express = require("express");
const router = express.Router();

const teacher = require("../api/Teacher/TeachApi");
const admin = require("../api/Admin/AdminApi");
const student = require("../api/Student/StuApi");

const jwt = require("jsonwebtoken");
SECRET_KEY = "Project";
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Upload/");
  },
  filename: (req, file, cb) => {
    var temp = file.originalname.split(".");
    const file_name = `${Date.now()}.${temp[1]}`;
    cb(null, file_name);
  },
});
var upload = multer({ storage: storage }).single("smfile");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

router.get("/", (req, res) => {
  res.send({ title: "Welcome Here" });
});
router.get("/tdisplay", (req, res) => {
  teacher(req, res);
});

router.get("/tsearch/:tid", (req, res) => {
  teacher(req, res);
});
router.post("/tsave", (req, res) => {
  teacher(req, res);
});
router.put("/tedit", (req, res) => {
  teacher(req, res);
});
router.delete("/tdelete", (req, res) => {
  teacher(req, res);
});
router.post("/tlogin", (req, res) => {
  teacher(req, res);
});
router.put("/tactivate", (req, res) => {
  teacher(req, res);
});

router.get("/sdisplay", (req, res) => {
  student(req, res);
});
router.get("/ssearch/:rno", (req, res) => {
  student(req, res);
});
router.post("/ssave", (req, res) => {
  student(req, res);
});
router.put("/sedit", (req, res) => {
  student(req, res);
});
router.delete("/sdelete", (req, res) => {
  student(req, res);
});
router.post("/slogin", (req, res) => {
  student(req, res);
});

router.get("/adisplay", (req, res) => {
  admin(req, res);
});
router.get("/asearch/:aid", (req, res) => {
  admin(req, res);
});
router.post("/asave", (req, res) => {
  admin(req, res);
});
router.put("/aedit", (req, res) => {
  admin(req, res);
});
router.delete("/adelete", (req, res) => {
  admin(req, res);
});
router.post("/alogin", (req, res) => {
  admin(req, res);
});

router.get("/classlist", (req, res) => {
  student(req, res);
});
router.post("/classadd", (req, res) => {
  student(req, res);
});
router.put("/classupdate", (req, res) => {
  student(req, res);
});
router.delete("/classdelete", (req, res) => {
  student(req, res);
});

router.get("/subjectlist", (req, res) => {
  student(req, res);
});
router.post("/subjectadd", (req, res) => {
  student(req, res);
});
router.put("/subjectupdate", (req, res) => {
  student(req, res);
});
router.delete("/subjectdelete", (req, res) => {
  student(req, res);
});
router.post("/studentmarks", (req, res) => {
  student(req, res);
});

router.get("/stuinfo", (req, res) => {
  student(req, res);
});
router.post("/stuinfoadd", (req, res) => {
  student(req, res);
});
router.delete("/stuinfodelete", (req, res) => {
  student(req, res);
});
router.post("/filterstudents", (req, res) => {
  student(req, res);
});

router.post("/markattendance", (req, res) => {
  student(req, res);
});
router.get("/attendancelist", (req, res) => {
  student(req, res);
});
router.post("/getattendance", (req, res) => {
  student(req, res);
});
router.post("/updateattendance", (req, res) => {
  student(req, res);
});
router.post("/studentattendance", (req, res) => {
  student(req, res);
});

router.post("/uploadnotes", upload, (req, res) => {
  if (!req.file) {
    res.send({ error: "Please Select A File" });
  } else {
    teacher(req, res);
  }
});
router.get("/readnotes", (req, res) => {
  teacher(req, res);
});
router.delete("/notesdelete", (req, res) => {
  teacher(req, res);
});

module.exports = router;
