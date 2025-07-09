const mongoose = require("mongoose");

const student = new mongoose.Schema({
  rno: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
});

const stu_object = mongoose.model("student", student);
module.exports = stu_object;
