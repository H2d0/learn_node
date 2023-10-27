const asyncWrapper = require("../middleware/asyncWrapper");
const httpStatus = require("../utils/httpTextStatus");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");

const Users = require("../model/user.model");
const genretJWT = require("../utils/genret-JWT");

const getAllUsers = asyncWrapper(async (req, res) => {
  const limit = req.query.limit;
  const page = req.query.page;
  const skip = (page - 1) * limit;
  const users = await Users.find({}, { __v: false, password: false })
    .skip(skip)
    .limit(limit);
  res.json({ Status: httpStatus.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role, avater } = req.body;

  const oldUser = await Users.findOne({ email });
  if (oldUser) {
    const error = appError.create("User already exists", 400, httpStatus.FAIL);
    return next(error);
  }

  // Hashing the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new Users({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avater: req.file.filename,
  });

  const token = await genretJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });

  newUser.token = token;

  await newUser.save();

  res.json({ status: httpStatus.SUCCESS, data: { user: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    const error = appError.create(
      "Please provide email and password",
      400,
      httpStatus.FAIL
    );
    return next(error);
  }
  const user = await Users.findOne({ email });
  if (!user) {
    const error = appError.create("user not found ", 400, httpStatus.FAIL);
    return next(error);
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (user && matchPassword) {
    const token = await genretJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });
    user.token = token;
    return res.json({ Status: httpStatus.SUCCESS, data: { token } });
  } else {
    const error = appError.create(
      "something went wrong",
      500,
      httpStatus.ERROR
    );
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};
