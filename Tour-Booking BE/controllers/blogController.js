const Blog = require("../models/blogModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { uploadToCloudinary } = require("../config/cloudinary");

// Public: Lấy tất cả blog đã xuất bản
exports.getPublicBlogs = catchAsync(async (req, res, next) => {
  const { category, search, sort } = req.query;
  
  const filter = { status: "published" };
  
  if (category) filter.category = category;
  if (search) {
    filter.$text = { $search: search };
  }
  
  let query = Blog.find(filter).populate("author", "name email");
  
  // Sort
  if (sort === "newest") query = query.sort("-createdAt");
  else if (sort === "oldest") query = query.sort("createdAt");
  else query = query.sort("-createdAt");
  
  const blogs = await query.populate("linkedTour", "name slug");
  
  res.status(200).json({
    status: "success",
    results: blogs.length,
    data: { blogs },
  });
});

// Public: Lấy 1 blog đã xuất bản theo slug
exports.getPublicBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findOne({ 
    slug: req.params.slug,
    status: "published"
  })
    .populate("author", "name email")
    .populate("linkedTour", "name slug");
  
  if (!blog) {
    return next(new AppError("Không tìm thấy blog", 404));
  }
  
  res.status(200).json({
    status: "success",
    data: { blog },
  });
});

// Lấy tất cả blog của partner
exports.getMyBlogs = catchAsync(async (req, res, next) => {
  const { status, category, search, sort } = req.query;
  
  const filter = { author: req.user.id };
  
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) {
    filter.$text = { $search: search };
  }
  
  let query = Blog.find(filter);
  
  // Sort
  if (sort === "newest") query = query.sort("-createdAt");
  else if (sort === "oldest") query = query.sort("createdAt");
  else query = query.sort("-createdAt");
  
  const blogs = await query.populate("linkedTour", "name slug");
  
  res.status(200).json({
    status: "success",
    results: blogs.length,
    data: { blogs },
  });
});

// Lấy 1 blog để edit
exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).populate("linkedTour", "name slug");
  
  if (!blog) {
    return next(new AppError("Không tìm thấy blog", 404));
  }
  
  // Kiểm tra quyền
  if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new AppError("Bạn không có quyền xem blog này", 403));
  }
  
  res.status(200).json({
    status: "success",
    data: { blog },
  });
});

// Tạo blog mới
exports.createBlog = catchAsync(async (req, res, next) => {
  const blogData = {
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    tags: req.body.tags,
    status: req.body.status || "published",
    linkedTour: req.body.linkedTour,
    author: req.user.id,
  };
  
  // Upload cover image nếu có
  if (req.file) {
    const uploadedImage = await uploadToCloudinary(
      "blogs",
      req.file.buffer,
      `blog-${Date.now()}.jpeg`
    );
    blogData.coverImage = uploadedImage.secure_url;
  }
  
  const blog = await Blog.create(blogData);
  
  res.status(201).json({
    status: "success",
    data: { blog },
  });
});

// Cập nhật blog
exports.updateBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    return next(new AppError("Không tìm thấy blog", 404));
  }
  
  // Kiểm tra quyền
  if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new AppError("Bạn không có quyền chỉnh sửa blog này", 403));
  }
  
  const allowedFields = ["title", "content", "category", "tags", "status", "linkedTour"];
  const updates = {};
  
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });
  
  // Upload cover image mới nếu có
  if (req.file) {
    const uploadedImage = await uploadToCloudinary(
      "blogs",
      req.file.buffer,
      `blog-${blog._id}-${Date.now()}.jpeg`
    );
    updates.coverImage = uploadedImage.secure_url;
  }
  
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  
  res.status(200).json({
    status: "success",
    data: { blog: updatedBlog },
  });
});

// Xóa blog
exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) {
    return next(new AppError("Không tìm thấy blog", 404));
  }
  
  // Kiểm tra quyền
  if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new AppError("Bạn không có quyền xóa blog này", 403));
  }
  
  await Blog.findByIdAndDelete(req.params.id);
  
  res.status(204).json({
    status: "success",
    data: null,
  });
});



// Upload ảnh vào nội dung blog
exports.uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Vui lòng chọn ảnh!", 400));
  }
  
  // Upload ảnh lên Cloudinary
  const uploadedImage = await uploadToCloudinary(
    "blogs",
    req.file.buffer,
    `blog-content-${Date.now()}.jpeg`
  );
  
  res.status(200).json({
    status: "success",
    data: { imageUrl: uploadedImage.secure_url },
  });
});
