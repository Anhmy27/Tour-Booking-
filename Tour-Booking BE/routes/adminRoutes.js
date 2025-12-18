const express = require("express");
const {
  getAllUserForAdmin,
  createPartnerAccount,
  approveTour,
  getActiveTours,
  getPendingTours,
  getOneActiveTour,
  banUser,
  getAllBlogs,
  getOneBlog,
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
router.get("/pendingTour", getPendingTours);
router.patch("/pendingTour/:tourId/approve", approveTour);
router.get("/stats/view-new-user", getNewUsersAndPartners);
router.patch("/users/:userId/ban", banUser);
router.get("/stats/revenue", getRevenueStats);

module.exports = router;
