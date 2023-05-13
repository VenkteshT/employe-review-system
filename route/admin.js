const router = require("express").Router();
const adminController = require("../controller/admin");
const authController = require("../controller/auth");

/* GET ROUE */

// 1) admin dashboard
router.get("/", adminController.adminPage);

// 2) add employee page
router.get(
  "/addUserPage",
  authController.restrictTo("admin"),
  adminController.addUserPage
);

// 3) delete employee page
router.get(
  "/deleteUser/:id",
  authController.checkAuthentication,
  adminController.deleteUser
);

// 4) edit employee page
router.get(
  "/editUser/:id",
  authController.checkAuthentication,
  adminController.editUserPage
);

// 5) assign review page
router.get(
  "/assignReviewPage/:id",
  authController.checkAuthentication,
  adminController.assignReviewPage
);

/*  POST ROUTE */

// 1) add Employee
router.post(
  "/addUser",
  authController.checkAuthentication,
  authController.restrictTo("admin"),
  adminController.addUser
);

// 2) edit Employee
router.post(
  "/updateUser/:id",
  authController.checkAuthentication,
  adminController.updateUser
);

// 3) assign review to employee
router.post(
  "/reviewEmployee/:id",
  authController.checkAuthentication,
  adminController.assignReview
);
module.exports = router;
