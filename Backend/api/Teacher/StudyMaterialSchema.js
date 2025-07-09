const mongoose = require("mongoose");

const studyMaterial = new mongoose.Schema({
  smid: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  class_name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  filepath: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const sm_object = mongoose.model("studyMaterial", studyMaterial);
module.exports = sm_object;
