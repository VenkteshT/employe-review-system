const errorHandler = (err, req, res, next) => {
  req.flash("error", err.message);
  res.redirect("back");
};

module.exports = errorHandler;
