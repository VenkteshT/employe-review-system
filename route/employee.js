const router = require("express").Router();
const employeeController = require("../controller/employee");
const authController = require("../controller/auth");

/* GET ROUTE*/

// 1) employe dashboard
router.get("/", employeeController.userPage);

// 2) assigned reviews
router.get(
  "/review",
  authController.checkAuthentication,
  employeeController.review
);

/*  POST ROUTE */

// post review
router.post(
  "/postReview/:id",
  authController.checkAuthentication,
  employeeController.postReview
);

module.exports = router;
