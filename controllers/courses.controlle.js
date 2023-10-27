
const { validationResult } = require("express-validator");
const Course = require("../model/courses.model");
const httpStatus = require("../utils/httpTextStatus");
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../utils/appError");


const getCourses = asyncWrapper(async (req, res) => {
    const limit = req.query.limit;
    const page = req.query.page;
    const skip = (page - 1) * limit;
    const courses = await Course.find({}, { __v: false }).skip(skip).limit(limit);
    res.json({ Status:httpStatus.SUCCESS, data:{courses}});
    
})

const getCourse = asyncWrapper(
  async (req, res, next) => {
  const courseId = req.params.courseId;
  const courses = await Course.findById(courseId, { __v: false });
    if (!courses) {
      const error = appError.create("Course not found", 404 , httpStatus.FAIL);
     return next(error);
  }
  return res
    .status(200)
    .json({ Status: httpStatus.SUCCESS, data: { course: courses } });
});

const createCourse = asyncWrapper (async (req, res , next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const err = appError.create( error.array(), 400, httpStatus.FAIL);
    return next(err);
  }
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
});
const updateCourse = asyncWrapper(async (req, res) => {
    const courseId = req.params.courseId;
    const updatedCourse = await Course.updateOne(
      { _id: courseId },
      { $set: { ...req.body } },
    );
    const responseData = {
      status: httpStatus.SUCCESS,
      data: { course: updatedCourse },
    };
    res.status(200).json(responseData);

})
 
const deleteCourse =asyncWrapper (async (req, res) => {
     await Course.deleteOne({ _id: req.params.courseId })//.writeConcern({ w: "majority" });
    res.status(200).json({ Status: httpStatus.SUCCESS, data:null});
})


module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};