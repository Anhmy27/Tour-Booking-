const express = require("express");

const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const tourRoutes = require("./tourRoutes");
const bookingRoutes = require("./bookingRoutes");
const reviewRoutes = require("./reviewRoutes");
const reportRoutes = require("./reportRoutes");
const blogRoutes = require("./blogRoutes");

const route = express.Router();

route.use("/auth", authRoutes);
route.use("/admin", adminRoutes);
route.use("/tours", tourRoutes);

route.use("/bookings", bookingRoutes);
route.use("/reviews", reviewRoutes);

route.use("/reports", reportRoutes);
route.use("/blogs", blogRoutes);

module.exports = route;
