const Async = require("../util/Async");
const AppError = require("../util/AppError");

// sign in page
exports.signin = Async(async (req, res, next) => {
  res.render("signin", { title: "sign in page" });
});

// sign up page
exports.signup = Async(async (req, res, next) => {
  res.render("signup", { title: "sign up page" });
});
