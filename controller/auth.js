const Async = require("../util/Async");
const AppError = require("../util/AppError");
const User = require("../model/user");

// Authentication
exports.checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/signin");
};

//set user
exports.setAuthenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

// create / signup
exports.create = Async(async (req, res, next) => {
  const { name, email, password, confirm_password } = req.body;
  const user = await User.findOne({ email });
  if (user) return next(new AppError("user or email already exist", 400));
  if (password !== confirm_password)
    return next(new AppError("password mismatch", 401));
  const newUser = await User.create(req.body);
  if (newUser) req.flash("success", "Sign Up Successfully");
  res.redirect("/signin");
});

// create session / sign in
exports.crateSession = Async(async (req, res, next) => {
  req.flash("success", "Login successfull");
  if (req.user.role === "admin") return res.redirect("/admin");
  else res.redirect("/employee");
});

// logout
exports.logout = Async(async (req, res, next) => {
  req.flash("success", "logout successfull");
  req.logout(next);
  res.redirect("/signin");
});

// restrict permissions
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      req.flash("error", "Access Denied");
      return res.redirect("/");
      // return next(new AppError("Access Denied", 400));
    }
    next();
  };
};
