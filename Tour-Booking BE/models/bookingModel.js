const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Booking phải liên kết với một tour."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Booking phải liên kết với một người dùng."],
    },
    startDate: {
      type: Date,
      required: [true, "Phải có ngày bắt đầu tour."],
    },
    numberOfPeople: {
      type: Number,
      required: [true, "Phải có số người tham gia."],
      min: [1, "Ít nhất 1 người tham gia."],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    price: {
      type: Number,
      required: [true, "Giá booking là bắt buộc."],
      min: [0, "Giá phải lớn hơn hoặc bằng 0."],
    },
    paid: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    cancelledAt: {
      type: Date,
    },
    refundStatus: {
      type: String,
      enum: ["none", "pending", "processing", "completed", "failed"],
      default: "none",
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundDate: {
      type: Date,
    },
    momoTransId: {
      type: String,
    },
    momoRequestId: {
      type: String,
    },
    price_snapshot: {
      type: Number,
    },
    duration_snapshot: {
      type: Number,
    },
    tour_title_snapshot: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

// Không dùng auto-populate để tránh xung đột
// Sẽ populate thủ công khi cần thiết trong controller

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
