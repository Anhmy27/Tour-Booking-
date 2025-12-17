const User = require("../models/userModel");
const Tour = require("../models/tourModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const { generateRandomPassword } = require("./../utils/passwordUtils");
const { buildPaginatedQuery } = require("../utils/queryHelper");
const Email = require("../utils/email");

const getAllUserForAdmin = catchAsync(async (req, res) => {
  // Lấy tất cả users (không phải admin)
  const users = await User.find({ role: { $ne: "admin" } })
    .select("name email role active photo description")
    .sort("-createdAt")
    .lean();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

const createPartnerAccount = catchAsync(async (req, res, next) => {
  const { name, email, description } = req.body;

  //validate email exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email này đã được sử dụng", 400));
  }

  const temporaryPassword = generateRandomPassword();
  //create Partner
  const newPartner = await User.create({
    name,
    email,
    role: "partner",
    password: temporaryPassword,
    passwordConfirm: temporaryPassword,
    description: description ,
    active: true,
  });
  console.log(
    `Partner created - Email: ${email},Password: ${temporaryPassword}`
  );

  //send mail welcome
  let emailFailed = false;
  try {
    const emailService = new Email(newPartner, {
      email: newPartner.email,
      password: temporaryPassword,
    });
    await emailService.sendPartnerWelcome();
  } catch (err) {
    console.error("gửi email thất bại:", err);
    emailFailed = true;
  }

  //response

  res.status(201).json({
    status: "success",
    message: emailFailed
      ? "Tạo tài khoản partner thành công, nhưng gửi email thất bại. Vui lòng gửi email thủ công cho partner"
      : "Tạo tài khoản partner thành công",
    data: {
      user: {
        id: newPartner._id,
        name: newPartner.name,
        email: newPartner.email,
        role: newPartner.role,
        description: newPartner.description,
        active: newPartner.active,
      },
      emailStatus: emailFailed ? "failed" : "sent",
    },
  });
});

const getPendingTours = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, partner } = req.query;

  const { finalQuery, paginationOptions } = buildPaginatedQuery({
    query: req.query,
    filters: { status: "pending", ...(partner && { partner }) },
    searchFields: ["name", "summary"],
    page,
    limit,
    sort: "-createdAt",
  });
  const [totalTours, tours] = await Promise.all([
    Tour.countDocuments(finalQuery),
    Tour.find(finalQuery)
      .populate("partner", "name email")
      .skip(paginationOptions.skip)
      .limit(paginationOptions.limit)
      .sort(paginationOptions.sort),
  ]);

  res.status(200).json({
    status: "success",
    results: tours.length,
    total: totalTours,
    currentPage: Number(page),
    totalPages: Math.ceil(totalTours / limit),
    data: { tours },
  });
});
const approveTour = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const { decision } = req.body;

  if (!["active", "inactive"].includes(decision)) {
    return next(new AppError('Decision phải là "active" hoặc "inactive"', 400));
  }

  const tour = await Tour.findById(tourId).populate("partner", "name email");
  if (!tour) return next(new AppError("Không tìm thấy tour", 404));
  if (tour.status !== "pending")
    return next(new AppError("Tour này đã được xử lý", 400));

  const updatedTour = await Tour.findByIdAndUpdate(
    tourId,
    { status: decision },
    { new: true, runValidators: true }
  );
  //send email to partner
  if (tour.partner && tour.partner.email) {
    const data = {
      tourName: tour.name,
      decision: decision,
    };
    const email = new Email(tour.partner, data);
    try {
      await email.sendTourApproval();
      /*eslint-disable-next-line*/
    } catch (error) {
      return next(new AppError("Có lỗi khi gửi email. Hãy thử lại sau!"), 500);
    }
  }

  res.status(200).json({
    status: "success",
    message: `Tour đã được ${decision === "active" ? "phê duyệt" : "từ chối"} thành công`,
    data: { updatedTour },
  });
});

const toggleUserStatus = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("Không tìm thấy người dùng", 404));
  }

  if (user.role === "admin") {
    return next(new AppError("Không thể thay đổi trạng thái admin", 403));
  }

  // Toggle active status
  user.active = !user.active;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: `Đã ${user.active ? "kích hoạt" : "vô hiệu hóa"} người dùng`,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        active: user.active,
      },
    },
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, paid, startDate, endDate } = req.query;

  // Tạo filter
  const filters = {};
  if (paid !== undefined) {
    filters.paid = paid === "true";
  }
  if (startDate || endDate) {
    filters.startDate = {};
    if (startDate) filters.startDate.$gte = new Date(startDate);
    if (endDate) filters.startDate.$lte = new Date(endDate);
  }

  const { finalQuery, paginationOptions } = buildPaginatedQuery({
    query: req.query,
    filters,
    searchFields: [],
    page,
    limit,
    sort: "-createdAt",
  });

  const [totalBookings, bookings] = await Promise.all([
    Booking.countDocuments(finalQuery),
    Booking.find(finalQuery)
      .select("tour user startDate numberOfPeople price paid createdAt")
      .populate({
        path: "user",
        select: "name email photo role",
      })
      .populate({
        path: "tour",
        select: "name price imageCover duration partner",
        populate: {
          path: "partner",
          select: "name email",
        },
      })
      .skip(paginationOptions.skip)
      .limit(paginationOptions.limit)
      .sort(paginationOptions.sort),
  ]);

  res.status(200).json({
    status: "success",
    results: bookings.length,
    total: totalBookings,
    currentPage: Number(page),
    totalPages: Math.ceil(totalBookings / limit),
    data: { bookings },
  });
});

module.exports = {
  getAllUserForAdmin,
  createPartnerAccount,
  approveTour,
  getPendingTours,
  toggleUserStatus,
  getAllBookings,
};
