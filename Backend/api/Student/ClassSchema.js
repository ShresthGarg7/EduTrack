const mongoose = require("mongoose");

const stu_class = new mongoose.Schema({
  cid: {
    type: Number,
    required: true,
    unique: true,
  },
  cname: {
    type: String,
    required: true,
  },
});

const class_object = mongoose.model("stu_class", stu_class);
module.exports = class_object;
