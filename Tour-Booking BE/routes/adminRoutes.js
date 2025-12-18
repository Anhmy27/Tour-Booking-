const express = require("express");
const {
  getAllUserForAdmin,
  createPartnerAccount,
  getActiveTours,
  getAllActiveTours,
  getOneActiveTour,
  getAllBlogs,
  getOneBlog,
  toggleUserStatus,
  getAllBookings,
} = require("./../controllers/adminController");
const {
  getNewUsersAndPartners,
  getRevenueStats,
} = require("./../controllers/dashboardAdminController");

const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect, authController.restrictTo("admin"));

router.get("/users", getAllUserForAdmin);
router.post("/createPartner", createPartnerAccount);
router.get("/activeTours", getActiveTours);
router.get("/activeTours/:tourId", getOneActiveTour);
router.get("/blogs", getAllBlogs);
router.get("/blogs/:blogId", getOneBlog);
router.get("/all-bookings", getAllBookings);
// expose endpoint to get all active tours (for admin listing/filtering)
router.get("/activeTours/all", getAllActiveTours);
// Note: approve route removed — admin UI now only views/filters active tours
router.get("/stats/view-new-user", getNewUsersAndPartners);
router.patch("/users/:userId/toggle-status", toggleUserStatus);
router.get("/stats/revenue", getRevenueStats);
router.get("/bookings", getAllBookings);

module.exports = router;
