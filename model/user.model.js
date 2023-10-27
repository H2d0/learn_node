const mongoose = require("mongoose");
const validator = require("validator");
const USER_ROLES =require("../utils/user.Role")

const usersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    role: {
      type: String,
      enum: [USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.MANGER],
      default: "user",
    },
    avater: {
      type: String,
      default: "upload/profile.jpg",
    },
  },
  {
    writeConcern: {
      w: "majority",
    },
  }
);


module.exports = mongoose.model("User", usersSchema);