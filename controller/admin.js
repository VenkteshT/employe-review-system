const Async = require("../util/Async");
const AppError = require("../util/AppError");
const User = require("../model/user");
const Review = require("../model/review");

// render add user page for admin
exports.addUserPage = Async(async (req, res, next) => {
  res.render("addUser");
});

// add user
exports.addUser = Async(async (req, res, next) => {
  const checkUserExist = await User.findOne({ email: req.body.email });
  // check user exist
  if (checkUserExist) {
    req.flash("error", "user already exist");
  } else if (req.body.password !== req.body.confirm_password) {
    return next(new AppError("Password mismatch", 400));
  } else {
    const newUser = await User.create(req.body);
    req.flash("success", "new user Added");
  }
  res.redirect("/admin/addUserPage");
});

// admin home page

exports.adminPage = Async(async (req, res, next) => {
  const users = await User.find({
    _id: { $ne: req.user._id },
  });
  res.render("adminPage", { title: "admin Page", users });
});

// delete employee
exports.deleteUser = Async(async (req, res, next) => {
  const { id } = req.params;

  // remove user from recipiant list
  await Review.deleteMany({ recipiant: id });

  // remove user from reviewer list
  await Review.deleteMany({ reviewer: id });

  // delete user
  const user = await User.findByIdAndDelete(id);
  req.flash("success", "user and associated reviews are deleted");
  res.redirect("/admin");
});

// render from to  update user
exports.editUserPage = Async(async (req, res, next) => {
  const { id } = req.params;
  const employee = await User.findById(id);
  res.render("editUserPage", { id, employee });
});

exports.updateUser = Async(async (req, res, next) => {
  const { id } = req.params;
  const { email, name, role } = req.body;
  const user = await User.findByIdAndUpdate(id, { email, name, role });
  if (user) req.flash("success", "User updated successfully");
  res.redirect("/admin");
});

// render assignreview page to admin
exports.assignReviewPage = Async(async (req, res, next) => {
  const { id } = req.params;
  const employee = await User.findById(id);
  const recipiants = await User.find({
    $and: [{ _id: { $ne: id } }, { _id: { $ne: req.user._id } }],
  });
  res.render("assignReviewPage", {
    title: "assign review",
    id,
    employee,
    recipiants,
  });
});

// assign review to employe
exports.assignReview = Async(async (req, res, next) => {
  const { reviewer, recipiant } = req.body;
  const user = await User.findOne({ email: reviewer });
  if (user.assignedReviews.includes(recipiant)) {
    return next(new AppError("review already assigned current recipinat", 400));
  }
  user.assignedReviews.push(recipiant);
  user.save();
  req.flash("success", "review assigned");
  res.redirect("/admin");
});
