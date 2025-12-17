const express = require("express");
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/:tourId/start-dates", bookingController.getTourStartDates);

// MoMo return handler (public - no auth)
router.post("/momo-return", bookingController.handleMoMoReturn);

router.use(authController.protect);

router.post("/", bookingController.createBooking);
router.get("/my", bookingController.getMyBookings);
router.post("/checkout-session", bookingController.getCheckoutSession);
router.post("/momo-payment", bookingController.createMoMoPayment);
router.patch("/:id/cancel", bookingController.cancelBooking);
router.get(
  "/partner",
  authController.protect,
  authController.restrictTo("partner"),
  bookingController.getPartnerBookings
);
module.exports = router;
