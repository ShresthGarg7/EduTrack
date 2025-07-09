const mongoose = require("mongoose");

const attendance = new mongoose.Schema({
  rno: {
    type: Number,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  attend_date: {
    type: Date,
    required: true,
  },
  isAttend: {
    type: Boolean,
    default: false,
  },
});

const att_object = mongoose.model("attendance", attendance);
module.exports = att_object;
