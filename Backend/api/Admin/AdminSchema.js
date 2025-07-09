const mongoose = require("mongoose");

const admin = new mongoose.Schema({
  aid: {
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

const admin_object = mongoose.model("admin", admin);
module.exports = admin_object;
