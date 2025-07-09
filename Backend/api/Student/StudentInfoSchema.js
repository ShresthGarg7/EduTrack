const mongoose = require("mongoose");

const stu_info = new mongoose.Schema({
  rno: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  subjects: [
    {
      subject: {
        type: String,
        required: true,
      },
      marks: {
        type: Number,
        default: null,
      },
    },
  ],
});

const info_object = mongoose.model("stu_info", stu_info);
module.exports = info_object;
