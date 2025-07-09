const mongoose = require("../config");
const sm_object = require("./StudyMaterialSchema");
const teach_object = require("./TeachSchema");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const fs = require("fs");

module.exports = async (req, res) => {
  function generateToken(user) {
    return jwt.sign(
      { tid: user.tid, name: user.name, email: user.email },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
  }

  if (req.url == "/tdisplay") {
    teach_object
      .find({})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else if (req.url == `/tsearch/${req.params.tid}`) {
    var tid = req.params.tid;
    teach_object
      .find({ tid: tid })
      .then((data) => {
        if (data.length > 0) {
          res.send({ data, message: "Found" });
        } else res.status(200).json({ message: "Record not found" });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else if (req.url == "/tsave") {
    const result = await teach_object.find().sort({ tid: -1 }).limit(1);

    const maxValue = result[0]?.tid || 0;
    var tid = maxValue + 1;
    const { name, email, password, contact } = req.body;
    var isActive = false;
    teach_object_ref = new teach_object({
      tid,
      name,
      email,
      password,
      contact,
      isActive,
    });
    teach_object_ref
      .save()
      .then(() => {
        res.status(201).json({ message: "Record Saved" });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else if (req.url == "/tedit") {
    const { tid, name, email, password, contact, isActive } = req.body;
    teach_object
      .find({ tid: tid })
      .then((data) => {
        if (data.length > 0) {
          teach_object
            .updateOne(
              { tid: tid },
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
  } else if (req.url == "/tdelete") {
    var tid = req.body.tid;
    teach_object
      .find({ tid: tid })
      .then((data) => {
        if (data.length > 0) {
          teach_object
            .deleteOne({ tid: tid })
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
  } else if (req.url == "/tlogin") {
    const { email, password } = req.body;

    teach_object
      .findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res.status(200).json({ message: "Record not found" });
        }

        if (user.password !== password) {
          return res.status(200).json({ message: "Incorrect password" });
        }

        if (!user.isActive) {
          return res.status(200).json({ message: "Not activated yet" });
        }

        const token = generateToken(user);
        return res.status(200).json({ token, message: "Success" });
      })
      .catch((err) => {
        res.status(500).json({ message: "Server error", error: err });
      });
  } else if (req.url == "/tactivate") {
    const { tid, isActive } = req.body;
    teach_object
      .updateOne({ tid }, { $set: { isActive } })
      .then(() => res.json({ message: "Status updated" }))
      .catch((err) =>
        res.status(500).json({ message: "Failed to update", error: err })
      );
  } else if (req.url == "/uploadnotes") {
    const result = await sm_object.find().sort({ smid: -1 }).limit(1);
    const maxValue = result[0]?.smid || 0;
    var smid = maxValue + 1;
    const { title, description, class_name, subject } = req.body;
    filepath = req.file["filename"];
    const sm_obj_ref = new sm_object({
      smid,
      title,
      description,
      class_name,
      subject,
      filepath,
      uploadDate: new Date(),
    });
    sm_obj_ref
      .save()
      .then(() => {
        res.status(201).json({ message: "Record Saved" });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else if (req.url == "/readnotes") {
    sm_object
      .find({})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else if (req.url == "/notesdelete") {
    var smid = req.body.smid;
    sm_object
      .find({ smid: smid })
      .then((data) => {
        if (data.length > 0) {
          var fname = "Upload/" + data[0].filepath;
          sm_object
            .deleteOne({ smid: smid })
            .then(() => {
              fs.unlinkSync(fname);
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
};
