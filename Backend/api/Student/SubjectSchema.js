const mongoose = require("mongoose");

const subject = new mongoose.Schema({
  sid: {
    type: Number,
    required: true,
    unique: true,
  },
  sname: {
    type: String,
    required: true,
  },
  classnames: [
    {
      classname: {
        type: String,
        required: true,
      },
    },
  ],
});

const sub_object = mongoose.model("subject", subject);
module.exports = sub_object;
