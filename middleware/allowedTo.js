const appError = require("../utils/appError")

module.exports = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.currentJwt.role)) {
           return next(appError.create("You are not allowed to perform this action", 403))
        }
        next();
    }
}