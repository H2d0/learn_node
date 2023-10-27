require("dotenv").config();

const express = require("express");
const cors = require("cors");



const app = express();
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());



const mongoose = require("mongoose");
const httpTextStatus = require("./utils/httpTextStatus");

const url = process.env.MONGO_URL;

  
mongoose.connect(url).then(() => {
  console.log("connected");
})

app.use(cors());

const coursesRouter = require("./routes/courses.router");
const usersRouter = require("./routes/user.router");

app.use("/api/courses", coursesRouter); // /api/courses
app.use("/api/users", usersRouter);  // /api/users

app.all("*", (req, res) => {
  res.status(404).json({
    status: httpTextStatus.ERROR,
    message: `Can't find ${req.originalUrl} on this server!`,
  });
})

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    Stutas: err.statusCode || httpTextStatus.ERROR,
    data: null,
    Code: err.statusCode||500,
    message: err.message,
  });
}) 

app.listen(process.env.PORT || 5000, () => {
  console.log(`Example app listening on port ${process.env.PORT || 5000}`);
});