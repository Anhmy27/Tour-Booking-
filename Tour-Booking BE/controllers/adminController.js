const User = require("../models/userModel");
const Tour = require("../models/tourModel");
const Booking = require("../models/bookingModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const { generateRandomPassword } = require("./../utils/passwordUtils");
const { buildPaginatedQuery } = require("../utils/queryHelper");
const Email = require("../utils/email");
const Blog = require("../models/blogModel");
// booking model already required above

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
    description: description,
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

const getOneActiveTour = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const tour = await Tour.findById(tourId).populate("partner", "name email");
  if (!tour) {
    return next(new AppError("Không tìm thấy tour", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

const getActiveTours = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, partner } = req.query;

  const { finalQuery, paginationOptions } = buildPaginatedQuery({
    query: req.query,
    filters: { status: "active", ...(partner && { partner }) },
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

const getAllBlogs = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, partner, category, status } = req.query;

  const { finalQuery, paginationOptions } = buildPaginatedQuery({
    query: req.query,
    filters: {
      ...(status && { status }),
      ...(category && { category }),
      ...(partner && { partner }),
    },
    searchFields: ["title"],
    page,
    limit,
    sort: "-createdAt",
  });
  const [totalBlogs, blogs] = await Promise.all([
    Blog.countDocuments(finalQuery),
    Blog.find(finalQuery)
      .populate("author", "name email")
      .skip(paginationOptions.skip)
      .limit(paginationOptions.limit)
      .sort(paginationOptions.sort),
  ]);

  res.status(200).json({
    status: "success",
    results: blogs.length,
    total: totalBlogs,
    currentPage: Number(page),
    totalPages: Math.ceil(totalBlogs / limit),
    data: { blogs },
  });
});

const getOneBlog = catchAsync(async (req, res, next) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId).populate("author", "name email");
  if (!blog) {
    return next(new AppError("Không tìm thấy blog", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

const getAllBookings = catchAsync(async (req, res, next) => {
  const { year } = req.query;

  try {

  const bookings = await Booking.find({
    ...(year && {
      createdAt: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    }),
  })
    .populate("tour", "name")
    .populate("user", "name email")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    data: bookings,
  });

  } catch (error) {
    console.log("error", error);
    return next(new AppError("Có lỗi xảy ra khi lấy bookings", 500));
  }
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

const getAllActiveTours = catchAsync(async (req, res) => {
  const { partner, search } = req.query;

  const filters = { status: "active", ...(partner && { partner }) };

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { summary: { $regex: search, $options: "i" } },
    ];
  }

  const tours = await Tour.find(filters)
    .populate("partner", "name email")
    .sort("-createdAt")
    .lean();

  res.status(200).json({
    status: "success",
    results: tours.length,
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

const getAllBooking = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, paid, startDate, endDate } = req.query;

  // Robust date parsing: accept ISO (yyyy-mm-dd) and localized dd/mm/yyyy
  const parseDateParam = (s, endOfDay = false) => {
    if (!s) return null;
    let d = null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      d = new Date(s);
    } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
      const [dd, mm, yyyy] = s.split("/");
      d = new Date(`${yyyy}-${mm}-${dd}`);
    } else {
      d = new Date(s);
    }
    if (!d || isNaN(d.getTime())) return null;
    if (endOfDay) d.setHours(23, 59, 59, 999);
    else d.setHours(0, 0, 0, 0);
    return d;
  };

  // Tạo filter
  const filters = {};
  if (paid !== undefined) {
    filters.paid = paid === "true";
  }

  const sd = parseDateParam(startDate, false);
  const ed = parseDateParam(endDate, true);
  if (sd || ed) {
    filters.startDate = {};
    if (sd) filters.startDate.$gte = sd;
    if (ed) filters.startDate.$lte = ed;
  }

  const { finalQuery, paginationOptions } = buildPaginatedQuery({
    query: req.query,
    filters,
    searchFields: [],
    page,
    limit,
    sort: "-createdAt",
  });

  // debug: log incoming query and computed filters
  console.log("[admin/all-bookings] query:", { paid, startDate, endDate });
  console.log("[admin/all-bookings] computed filters:", filters);

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

  // debug: log matched booking startDates to inspect boundaries
  try {
    const startDates = bookings.map((b) => b.startDate && b.startDate.toISOString());
    console.log("[admin/all-bookings] matched booking count:", bookings.length);
    console.log("[admin/all-bookings] matched startDates:", startDates.slice(0, 10));
  } catch (err) {
    console.log("[admin/all-bookings] debug log error:", err);
  }

  res.status(200).json({
    status: "success",
    results: bookings.length,
    total: totalBookings,
    currentPage: Number(page),
    totalPages: Math.ceil(totalBookings / limit),
    data: { bookings },
    debug: {
      parsedStartDate: sd ? sd.toISOString() : null,
      parsedEndDate: ed ? ed.toISOString() : null,
      appliedFilters: filters,
    },
  });
});

module.exports = {
  getAllUserForAdmin,
  createPartnerAccount,
  getOneActiveTour,
  getActiveTours,
  getAllActiveTours,
  getAllBlogs,
  getOneBlog,
  // export the paginated/filterable handler under the expected name
  getAllBookings: getAllBooking,
  toggleUserStatus,
};
