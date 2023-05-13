const router = require("express").Router();
const authController = require("../controller/auth");
const passport = require("passport");
const home = require("../controller/home");

/*  ROUTES  */

// 1) user route
router.use(
  "/employee",
  authController.checkAuthentication,
  require("./employee")
);

// 2) admin route
router.use("/admin", authController.checkAuthentication, require("./admin"));

/* GET ROUTE */

// 1) redirect to sign in page
router.get("/", (req, res) => res.redirect("/signin"));

// 2) signup page
router.get("/signup", home.signup);

// 3) signin page
router.get("/signin", home.signin);

// 4) logout
router.get("/logout", authController.logout);

/*  POST ROUTES  */

// 1) sign up user
router.post("/create", authController.create);

// 2) sign in user
router.post(
  "/create-session",
  passport.authenticate("local", {
    failureRedirect: "/signin",
  }),
  authController.crateSession
);

module.exports = router;
