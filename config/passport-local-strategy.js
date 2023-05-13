const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../model/user");
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
          req.flash(
            "error",
            !user ? "user dose not exist" : "Invalid Password or username"
          );
          done(null, false);
          return;
        } else {
          return done(null, user);
        }
      } catch (err) {
        console.log("found error in passport js file:", err.message);
        done(err);
      }
    }
  )
);

// serilize user
passport.serializeUser((user, done) => {
  done(null, user);
});

// deserilize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.log("error in deserilizer", err.message);
    cone(err);
  }
});

module.exports = passport;
