const Async = require("../util/Async");
const AppError = require("../util/AppError");
const User = require("../model/user");
const Review = require("../model/review");
// home page
exports.userPage = Async(async (req, res, next) => {
  const employee = await User.findById(req.user._id).populate({
    path: "reviewFromOthers",
    populate: {
      path: "reviewer",
    },
  });
  res.render("employeePage", {
    title: `employee Dashboard`,
    employee,
    reviewFromOthers: employee.reviewFromOthers,
  });
});

// render assigned review page
exports.review = Async(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: "assignedReviews",
  });

  res.render("review", {
    title: "assigned Reviews",
    assignedReviews: user.assignedReviews,
  });
});

// post review
exports.postReview = Async(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body.review.trim();

  // find recipiant
  const recipiant = await User.findById(id);

  // find reviewer
  const reviewer = await User.findById(req.user._id);

  const review = await Review.create({
    review: data,
    reviewer: req.user._id,
    recipiant: id,
  });

  if (review) req.flash("success", "review posted");

  // push the reviewer id into recipiant reviewfromother array
  await recipiant.updateOne({ $push: { reviewFromOthers: review._id } });

  // after posting review remove the assigned review from assigned remove array
  await reviewer.updateOne({ $pull: { assignedReviews: id } });

  res.redirect("back");
});
