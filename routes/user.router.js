const express = require("express");
const router = express.Router();
const controllers = require("../controllers/user.controllers");
const verifyToken = require("../middleware/verify.token");

const multer = require("multer");
const appError = require("../utils/appError");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, "uploads");
  },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
      const fileName = `user_${Date.now()}.${ext}`;
      cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
    const imageTypes =file.mimetype.split("/")[0];
  if (imageTypes === "image") {
    cb(null, true);
  } else {
    cb(appError.create("Only images are allowed", 400), false);
  }
}

const upload = multer({ storage: diskStorage , fileFilter});

router.route("/").get(verifyToken, controllers.getAllUsers);


router.route("/register").post(upload.single("avater"), controllers.register);


router.route("/login").post(controllers.login);



module.exports = router;