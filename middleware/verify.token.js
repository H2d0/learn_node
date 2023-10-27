const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const httpTextStatus = require("../utils/httpTextStatus");
const verifyToken = (req, res, next) => {
  const autHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!autHeader) {
    const error = appError.create("token is missing", 400, httpTextStatus.FAIL);
    return next(error);
  }
    const token = autHeader.split(" ")[1];
    
  try {
    const currentJwt = jwt.verify(token, process.env.JWT_SECRET);
    req.currentJwt = currentJwt;
      next();
  } catch (err) {
    const error = appError.create(
      "token is not valid",
      400,
      httpTextStatus.FAIL
    );
    return next(error);
  }
};
module.exports = verifyToken;
