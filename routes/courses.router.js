const express = require("express");
const { body } = require("express-validator");

let router = express.Router();

let controllers = require("../controllers/courses.controlle");
const verifyToken = require("../middleware/verify.token");
const USER_ROLES = require("../utils/user.Role");
const allowedTo = require("../middleware/allowedTo");

router
  .route("/")
  .get(verifyToken,controllers.getCourses)
  .post(
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters"),
    body("price").isNumeric().withMessage("Price must be a number"),
    controllers.createCourse
  );

router
  .route("/:courseId")
  .get(controllers.getCourse)
  .patch(controllers.updateCourse)
  .delete(verifyToken,allowedTo(USER_ROLES.ADMIN,USER_ROLES.MANGER),controllers.deleteCourse);

module.exports = router;