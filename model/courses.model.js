const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    writeConcern: {
      w: "majority",
    },
  }
);

module.exports = mongoose.model("Course", coursesSchema);