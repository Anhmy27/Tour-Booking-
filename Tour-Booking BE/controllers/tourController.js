const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");

const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const { uploadToCloudinary } = require("../config/cloudinary");
const Booking = require("../models/bookingModel");
const { Types } = require("mongoose");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError("Không phải ảnh! Xin hãy đăng đúng định dạng ảnh.", 400),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  console.log("=== resizeTourImages START ===");
  console.log("req.files:", req.files);

  // Nếu không có file nào thì bỏ qua
  if (!req.files || (!req.files.imageCover && !req.files.images)) {
    console.log("No files found, skipping...");
    return next();
  }

  try {
    // 1) Upload Cover image (nếu có)
    if (req.files.imageCover && req.files.imageCover[0]) {
      console.log("Uploading cover image...");
      const coverFilename = `tour-cover-${Date.now()}.jpeg`;
      const uploadCover = await uploadToCloudinary(
        "tours",
        req.files.imageCover[0].buffer,
        coverFilename
      );
      req.body.imageCover = uploadCover.secure_url;
      console.log("Cover uploaded:", uploadCover.secure_url);
    }

    // 2) Upload Images (nếu có)
    if (req.files.images && req.files.images.length > 0) {
      console.log(`Uploading ${req.files.images.length} images...`);
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (file, i) => {
          const filename = `tour-image-${Date.now()}-${i + 1}.jpeg`;
          const uploadedImage = await uploadToCloudinary(
            "tours",
            file.buffer,
            filename
          );
          req.body.images.push(uploadedImage.secure_url);
          console.log(`Image ${i + 1} uploaded:`, uploadedImage.secure_url);
        })
      );
    }

    console.log("=== resizeTourImages SUCCESS ===");
    next();
  } catch (error) {
    console.error("=== resizeTourImages ERROR ===");
    console.error("Error:", error);
    return next(new AppError("Lỗi upload ảnh: " + error.message, 500));
  }
});

//POST
exports.createTour = catchAsync(async (req, res, next) => {
  if (req.user.role !== "partner") {
    return next(new AppError("Chỉ partner mới được tạo tour", 403));
  }

  // Parse JSON strings từ FormData
  if (typeof req.body.startLocation === "string") {
    req.body.startLocation = JSON.parse(req.body.startLocation);
  }
  if (typeof req.body.locations === "string") {
    req.body.locations = JSON.parse(req.body.locations);
  }

  // Parse startDates array
  if (req.body["startDates[]"]) {
    req.body.startDates = Array.isArray(req.body["startDates[]"])
      ? req.body["startDates[]"]
      : [req.body["startDates[]"]];
    delete req.body["startDates[]"];
  }

  const tourData = {
    ...req.body,
    partner: req.user._id,
    status: "active",
  };

  const newTour = await Tour.create(tourData);
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

exports.getPartnerTours = catchAsync(async (req, res) => {
  const partnerId = req.user.id;

  let query = Tour.find({ partner: partnerId });

  query = query.sort("-createdAt");

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  const tours = await query;

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: { tours },
  });
});
//GET
exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError("Không tìm thấy tour", 404));
  }
  res.status(200).json({ status: "success", data: { tour } });
});

//Patch
exports.updateTour = catchAsync(async (req, res, next) => {
  console.log(req.body.description);
  const tourId = req.params.id;
  const tour = await Tour.findById(tourId);

  if (!tour) {
    return next(new AppError("Không tìm thấy tour", 404));
  }
  //Check role moi duoc update
  if (req.user.role === "partner") {
    if (tour.partner.toString() !== req.user._id.toString()) {
      return next(
        new AppError("Bạn chỉ được quyền chỉnh sửa tour cá nhân", 403)
      );
    }
    if (req.body.status === "active") {
      return next(
        new AppError("Bạn không có quyền sửa trạng thái tour sang active", 403)
      );
    }
    delete req.body.status;
  } else if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "You are not allowed to update this tour",
    });
  }

  Object.keys(req.body).forEach((key) => {
    tour[key] = req.body[key];
  });

  const updatedTour = await tour.save();

  res.status(200).json({
    status: "success",
    data: {
      tour: updatedTour,
    },
  });
});

//Delete
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError("Không tìm thấy tour", 404));
  }

  if (
    req.user.role === "partner" &&
    tour.partner.toString() !== req.user._id.toString()
  ) {
    return next(new AppError("Bạn chỉ có thể xóa tour của mình!", 403));
  }

  await Tour.findByIdAndDelete(req.params.id);

  res.status(200).json({ status: "success", message: "Tour đã bị xóa!" });
});

exports.getAllTours = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 6,
    sort = "-createdAt",
    search = "",
    minPrice,
    maxPrice,
    duration,
    maxGroupSize,
    startDate,
  } = req.query;

  const skip = (page - 1) * limit;

  // Tìm kiếm chung
  const searchConditions = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { summary: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  // Lọc theo giá
  const priceConditions = {};
  if (minPrice) priceConditions.$gte = Number(minPrice);
  if (maxPrice) priceConditions.$lte = Number(maxPrice);

  // Lọc theo ratingsAverage
  let ratingsConditions = {};
  if (
    req.query.ratingsAverage &&
    req.query.ratingsAverage !== "Tất cả đánh giá"
  ) {
    const rating = Number(req.query.ratingsAverage);
    if (rating === 5) {
      ratingsConditions = { $eq: 5 };
    } else if (rating === 4) {
      ratingsConditions = { $gte: 4 };
    } else if (rating === 3) {
      ratingsConditions = { $gte: 3 };
    }
  }

  // Tổng hợp điều kiện
  const filterQuery = {
    ...searchConditions,
    status: "active",
  };

  if (Object.keys(priceConditions).length > 0) {
    filterQuery.price = priceConditions;
  }
  if (Object.keys(ratingsConditions).length > 0) {
    filterQuery.ratingsAverage = ratingsConditions;
  }

  // Lọc theo thời gian tour (duration)
  if (duration) {
    filterQuery.duration = Number(duration);
  }

  // Lọc theo số người tối đa (maxGroupSize)
  if (maxGroupSize) {
    filterQuery.maxGroupSize = { $gte: Number(maxGroupSize) };
  }

  // Lọc theo ngày khởi hành (startDate)
  if (startDate) {
    filterQuery.startDates = {
      $elemMatch: {
        $gte: new Date(startDate),
      },
    };
  }

  // Truy vấn database
  const tours = await Tour.find(filterQuery)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Tour.countDocuments(filterQuery);

  res.status(200).json({
    status: "success",
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    results: tours.length,
    data: {
      tours,
    },
  });
});

// Get tour by slug
exports.getTourBySlug = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const tour = await Tour.findOne({ slug, status: "active" });

  if (!tour) {
    return next(new AppError("Không tìm thấy tour", 404));
  }

  const tourResponse = {
    id: tour._id,
    name: tour.name,
    duration: tour.duration,
    maxGroupSize: tour.maxGroupSize,
    rating: tour.ratingsAverage,
    reviews: tour.ratingsQuantity,
    price: tour.price,
    summary: tour.summary,
    description: tour.description,
    imageCover: tour.imageCover,
    images: tour.images,
    startDates: tour.startDates,
    startLocation: tour.startLocation
      ? {
          type: tour.startLocation.type,
          coordinates: tour.startLocation.coordinates,
          address: tour.startLocation.address,
          description: tour.startLocation.description,
        }
      : null,
    locations: tour.locations.map((loc) => ({
      type: loc.type,
      coordinates: loc.coordinates,
      address: loc.address,
      description: loc.description,
      day: loc.day,
    })),
  };

  res.status(200).json({
    status: 200,
    message: "Lấy thông tin tour thành công",
    data: {
      tour: tourResponse,
    },
  });
});

// Update tour status by partner if it is active
exports.updateTourStatusByPartner = catchAsync(async (req, res, next) => {
  const tourId = req.params.tourId;
  const tour = await Tour.findById(tourId);
  if (!tour) {
    return next(new AppError("Không tìm thấy tour với ID này", 404));
  }

  // Check if user is partner and owns the tour
  if (tour.partner.toString() !== req.user._id.toString()) {
    return next(new AppError("Bạn không có quyền cập nhật tour này", 403));
  }

  // Check tour status
  if (tour.status === "active") {
    tour.status = "inactive";
    await tour.save();
    res.status(200).json({
      status: "success",
      message: "Tour đã được cập nhật thành không hoạt động",
    });
  } else {
    return next(new AppError("Tour đã ở trạng thái không hoạt động", 400));
  }
});

exports.getRemainingSlots = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;
  const { startDate } = req.body;

  const tour = await Tour.findById(tourId);
  if (!tour) return next(new AppError("Không tìm thấy tour", 404));
  const inputDate = new Date(startDate);

  const targetDateString = inputDate.toISOString().split("T")[0];

  const result = await Booking.aggregate([
    {
      $match: {
        tour: new Types.ObjectId(tourId),
        paid: true, // Chỉ tính booking đã thanh toán
      },
    },
    {
      $addFields: {
        startDateString: {
          $dateToString: { format: "%Y-%m-%d", date: "$startDate" },
        },
      },
    },
    {
      $match: {
        startDateString: targetDateString,
      },
    },
    {
      $group: {
        _id: null,
        totalPeople: { $sum: "$numberOfPeople" },
      },
    },
  ]);

  const takenSlots = result[0]?.totalPeople ?? 0;

  res.status(200).json({
    status: "success",
    data: {
      bookedSlots: takenSlots,
      remainingSlots: tour.maxGroupSize - takenSlots,
      maxGroupSize: tour.maxGroupSize,
    },
  });
});
