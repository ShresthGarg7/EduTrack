const mongoose = require("mongoose");

const teacher = new mongoose.Schema({
  tid: {
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
  isActive: {
    type: Boolean,
    required: true,
  },
});

const teach_object = mongoose.model("teacher", teacher);
module.exports = teach_object;
