const mongoose = require("../config");
const stu_object = require("./StuSchema");
const class_object = require("./ClassSchema");
const subject_object = require("./SubjectSchema");
const info_object = require("./StudentInfoSchema");
const att_object = require("./attendenceschema");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = async (req, res) => {
  function generateToken(user) {
    return jwt.sign(
      { rno: user.rno, name: user.name, email: user.email },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
  }

  // Student
  if (req.url == "/sdisplay") {
    stu_object
      .find({})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else if (req.url == `/ssearch/${req.params.rno}`) {
    var rno = req.params.rno;
    stu_object
      .find({ rno: rno })
      .then((data) => {
        if (data.length > 0) {
          res.send({ data, message: "Found" });
        } else res.status(200).json({ message: "Record not found" });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else if (req.url == "/ssave") {
    const result = await stu_object.find().sort({ rno: -1 }).limit(1);
    const maxValue = result[0]?.rno || 0;
    var rno = maxValue + 1;
    const { name, email, password, contact } = req.body;
    stu_object_ref = new stu_object({
      rno,
      name,
      email,
      password,
      contact,
    });
    stu_object_ref
      .save()
      .then(() => {
        res.status(201).json({ message: "Record Saved" });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else if (req.url == "/sedit") {
    const { rno, name, email, password, contact } = req.body;
    stu_object
      .find({ rno: rno })
      .then((data) => {
        if (data.length > 0) {
          stu_object
            .updateOne(
              { rno: rno },
              {
                $set: {
                  name: name,
                  email: email,
                  password: password,
                  contact: contact,
                },
              }
            )
            .then(() => {
              res.status(200).json({ message: "Updated" });
            })
            .catch((err) => {
              res.status(200).json({ message: "Record not Updated" });
            });
        } else res.status(200).json({ message: "Record not found" });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else if (req.url == "/sdelete") {
    var rno = req.body.rno;
    stu_object
      .find({ rno: rno })
      .then((data) => {
        if (data.length > 0) {
          stu_object
            .deleteOne({ rno: rno })
            .then(() => {
              res.status(200).json({ message: "Record Deleted" });
            })
            .catch((err) => {
              res.status(200).json({ message: "Record not Deleted" });
            });
        } else res.status(200).json({ message: "Record not found" });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else if (req.url == "/slogin") {
    const { email, password } = req.body;

    stu_object
      .findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res.status(200).json({ message: "Record not found" });
        }

        if (user.password !== password) {
          return res.status(200).json({ message: "Incorrect password" });
        }

        const token = generateToken(user);
        return res.status(200).json({ token, message: "Success" });
      })
      .catch((err) => {
        res.status(500).json({ message: "Server error", error: err });
      });
  }
  // Class
  else if (req.url === "/classlist") {
    class_object
      .find({})
      .sort({ cid: 1 })
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json({ message: err.message }));
  } else if (req.url === "/classadd") {
    const { cid, cname } = req.body;
    const existing = await class_object.findOne({ cid });
    if (existing) {
      return res.status(200).json({ message: "Class ID already exists" });
    }
    const newClass = new class_object({
      cid,
      cname,
    });
    newClass
      .save()
      .then(() => res.status(201).json({ message: "Class added" }))
      .catch((err) => res.status(500).json({ message: err.message }));
  } else if (req.url === "/classupdate") {
    const { cid, cname } = req.body;
    class_object
      .findOneAndUpdate({ cid: cid }, { $set: { cname: cname } }, { new: true })
      .then((updated) => {
        if (!updated)
          return res.status(404).json({ message: "Class not found" });
        res.status(200).json({ message: "Class updated" });
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  } else if (req.url === "/classdelete") {
    var cid = req.body.cid;
    class_object
      .find({ cid: cid })
      .then((data) => {
        if (data.length > 0) {
          stu_object
            .deleteOne({ cid: cid })
            .then(() => {
              res.status(200).json({ message: "Record Deleted" });
            })
            .catch((err) => {
              res.status(200).json({ message: "Record not Deleted" });
            });
        } else res.status(200).json({ message: "Record not found" });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }
  // Subject
  else if (req.url === "/subjectlist") {
    subject_object
      .find({})
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json({ message: err.message }));
  } else if (req.path === "/subjectadd" && req.method === "POST") {
    const { sid, sname, classnames } = req.body;

    if (!sid || !sname || !Array.isArray(classnames)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await subject_object.findOne({ sid });
    if (existing) {
      return res.status(200).json({ message: "Subject ID already exists" });
    }

    const newSubject = new subject_object({
      sid,
      sname,
      classnames: classnames.map((cls) => ({ classname: cls })),
    });

    newSubject
      .save()
      .then(() => res.status(201).json({ message: "Subject added" }))
      .catch((err) => res.status(500).json({ message: err.message }));
  } else if (req.url === "/subjectupdate") {
    const { sid, sname, classnames } = req.body;
    subject_object
      .findOneAndUpdate(
        { sid },
        {
          $set: {
            sname,
            classnames: classnames.map((name) => ({ classname: name })),
          },
        },
        { new: true }
      )
      .then((updated) => {
        if (!updated)
          return res.status(404).json({ message: "Subject not found" });
        res.status(200).json({ message: "Subject updated" });
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  } else if (req.url === "/subjectdelete") {
    const { sid } = req.body;
    subject_object
      .findOneAndDelete({ sid })
      .then((deleted) => {
        if (!deleted)
          return res.status(404).json({ message: "Subject not found" });
        res.status(200).json({ message: "Subject deleted" });
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  } // Student Info
  else if (req.url === "/studentmarks" && req.method === "POST") {
    const { rno } = req.body;

    if (!rno) {
      return res.status(400).json({ message: "Roll number required" });
    }

    try {
      const student = await info_object.findOne({ rno });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      const subjectMarks = student.subjects.map((s) => ({
        subject: s.subject,
        marks: s.marks !== null ? s.marks : "Not Updated Yet",
      }));

      return res.status(200).json({
        name: student.name,
        class: student.class,
        marks: subjectMarks,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } else if (req.url === "/stuinfo" && req.method === "GET") {
    info_object
      .find({})
      .sort({ rno: 1 })
      .then((data) => {
        const sorted = data.map((record) => {
          record.subjects.sort((a, b) => a.subject.localeCompare(b.subject));
          return record;
        });
        res.status(200).json(sorted);
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  } else if (req.url === "/stuinfoadd" && req.method === "POST") {
    const { rno, name, class: className, subjects } = req.body;

    if (!rno || !name || !className || !Array.isArray(subjects)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await info_object.findOne({ rno });
    if (existing) {
      existing.class = className;

      for (const newSubj of subjects) {
        const existingSubj = existing.subjects.find(
          (s) => s.subject === newSubj.subject
        );

        if (existingSubj) {
          existingSubj.marks = newSubj.marks;
        } else {
          existing.subjects.push(newSubj);
        }
      }

      await existing.save();
      return res.status(200).json({ message: "Record updated" });
    }

    const newRecord = new info_object({
      rno,
      name,
      class: className,
      subjects,
    });

    newRecord
      .save()
      .then(() => res.status(201).json({ message: "Record added" }))
      .catch((err) => res.status(500).json({ message: err.message }));
  } else if (req.url === "/stuinfodelete" && req.method === "DELETE") {
    const { rno } = req.body;

    if (!rno) {
      return res.status(400).json({ message: "Roll number required" });
    }

    info_object
      .findOneAndDelete({ rno })
      .then((deleted) => {
        if (!deleted) {
          return res.status(404).json({ message: "Record not found" });
        }
        res.status(200).json({ message: "Record deleted" });
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  } else if (req.url === "/filterstudents" && req.method === "POST") {
    const { className, subjectName } = req.body;

    if (!className || !subjectName) {
      return res.status(400).json({ message: "Missing class or subject" });
    }

    info_object
      .find({
        class: className,
        subjects: { $elemMatch: { subject: subjectName } },
      })
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json({ message: err.message }));
  }

  // Attendance
  else if (req.url === "/markattendance" && req.method === "POST") {
    const { className, subjectName, attendance } = req.body;

    if (!className || !subjectName || !Array.isArray(attendance)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const records = attendance.map((entry) => ({
      rno: entry.rno,
      class: className,
      subject: subjectName,
      isAttend: entry.isAttend,
      attend_date: new Date(),
    }));

    att_object
      .insertMany(records)
      .then(() => {
        res.status(201).json({ message: "Attendance marked successfully" });
      })
      .catch((err) => {
        console.error("Attendance error:", err);
        res.status(500).json({ message: "Failed to save attendance" });
      });
  } else if (req.url === "/attendancelist" && req.method === "GET") {
    att_object
      .aggregate([
        {
          $group: {
            _id: {
              class: "$class",
              subject: "$subject",
              attend_date: "$attend_date",
            },
          },
        },
        {
          $project: {
            _id: 0,
            class: "$_id.class",
            subject: "$_id.subject",
            attend_date: {
              $dateToString: { format: "%Y-%m-%d", date: "$_id.attend_date" },
            },
          },
        },
      ])
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json({ message: err.message }));
  } else if (req.url === "/getattendance" && req.method === "POST") {
    const { class: className, subject, attend_date } = req.body;

    if (!className || !subject || !attend_date) {
      return res.status(400).json({ message: "Missing fields" });
    }

    att_object
      .aggregate([
        {
          $addFields: {
            formattedDate: {
              $dateToString: { format: "%Y-%m-%d", date: "$attend_date" },
            },
          },
        },
        {
          $match: {
            class: className,
            subject: subject,
            formattedDate: attend_date,
          },
        },
        {
          $project: {
            formattedDate: 0,
          },
        },
      ])
      .then((data) => res.status(200).json(data))
      .catch((err) => res.status(500).json({ message: err.message }));
  } else if (req.url === "/updateattendance" && req.method === "POST") {
    const { attendance } = req.body;

    if (!Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({ message: "No attendance data provided" });
    }

    const promises = attendance.map((entry) => {
      return att_object.findOneAndUpdate(
        {
          rno: entry.rno,
          class: entry.class,
          subject: entry.subject,
          attend_date: new Date(entry.attend_date),
        },
        { $set: { isAttend: entry.isAttend } },
        { new: true }
      );
    });

    Promise.all(promises)
      .then(() => res.status(200).json({ message: "Attendance updated" }))
      .catch((err) => res.status(500).json({ message: err.message }));
  } else if (req.url === "/studentattendance" && req.method === "POST") {
    const { rno } = req.body;

    if (!rno) {
      return res.status(400).json({ message: "Roll number is required" });
    }

    try {
      const student = await info_object.findOne({ rno });
      if (!student)
        return res.status(404).json({ message: "Student not found" });

      const attendanceRecords = await att_object.find({ rno });

      const attendanceSummary = student.subjects.map((subj) => {
        const total = attendanceRecords.filter(
          (a) => a.subject === subj.subject
        ).length;
        const present = attendanceRecords.filter(
          (a) => a.subject === subj.subject && a.isAttend
        ).length;
        return {
          subject: subj.subject,
          total,
          present,
          percentage: total > 0 ? Math.round((present / total) * 100) : 0,
        };
      });

      return res.status(200).json({
        class: student.class,
        attendance: attendanceSummary,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
};
