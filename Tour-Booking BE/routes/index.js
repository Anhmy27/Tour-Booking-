const express = require("express");

const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const tourRoutes = require("./tourRoutes");
const bookingRoutes = require("./bookingRoutes");
const reviewRoutes = require("./reviewRoutes");
const reportRoutes = require("./reportRoutes");
const reportController = require("../controllers/reportController");
const blogRoutes = require("./blogRoutes");

const route = express.Router();

route.use("/auth", authRoutes);
route.use("/admin", adminRoutes);
route.use("/tours", tourRoutes);

route.use("/bookings", bookingRoutes);
route.use("/reviews", reviewRoutes);

// DEV TEST route (no auth) to fetch top-rated tours for a partnerId
// Usage: GET /api/v1/reports/test/top-rated?partnerId=<partnerId>
route.get("/reports/test/top-rated", reportController.getTopRatedToursPublic);

route.use("/reports", reportRoutes);
route.use("/blogs", blogRoutes);

module.exports = route;
