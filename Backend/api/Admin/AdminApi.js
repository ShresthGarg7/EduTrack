const mongoose = require("../config");
const admin_object = require("./AdminSchema");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = async (req, res) => {
  function generateToken(user) {
    return jwt.sign(
      { aid: user.aid, name: user.name, email: user.email },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
  }

  if (req.url == "/adisplay") {
    admin_object
      .find({})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else if (req.url == `/asearch/${req.params.aid}`) {
    var aid = req.params.aid;
    admin_object
      .find({ aid: aid })
      .then((data) => {
        if (data.length > 0) {
          res.send({ data, message: "Found" });
        } else res.status(200).json({ message: "Record not found" });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else if (req.url == "/asave") {
    const result = await admin_object.find().sort({ aid: -1 }).limit(1);

    const maxValue = result[0]?.aid || 0;
    var aid = maxValue + 1;
    const { name, email, password, contact } = req.body;
    var isActive = false;
    admin_object_ref = new admin_object({
      aid,
      name,
      email,
      password,
      contact,
      isActive,
    });
    admin_object_ref
      .save()
      .then(() => {
        res.status(201).json({ message: "Record Saved" });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else if (req.url == "/aedit") {
    const { aid, name, email, password, contact } = req.body;
    admin_object
      .find({ aid: aid })
      .then((data) => {
        if (data.length > 0) {
          admin_object
            .updateOne(
              { aid: aid },
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
  } else if (req.url == "/adelete") {
    var aid = req.body.aid;
    admin_object
      .find({ aid: aid })
      .then((data) => {
        if (data.length > 0) {
          admin_object
            .deleteOne({ aid: aid })
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
  } else if (req.url == "/alogin") {
    const { email, password } = req.body;

    admin_object
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
};
