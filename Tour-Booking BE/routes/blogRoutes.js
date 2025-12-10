const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const blogController = require("../controllers/blogController");
const authController = require("../controllers/authController");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

// Multer config cho upload ảnh
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép upload ảnh!"), false);/*.*/
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Resize ảnh trước khi upload
const resizeBlogImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  
  req.file.buffer = await sharp(req.file.buffer)
    .resize(1200, 630) // 16:9 ratio cho cover image
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();
  
  next();
});

// Public routes (không cần authentication)
router.get("/public", blogController.getPublicBlogs);
router.get("/public/:slug", blogController.getPublicBlog);
router.patch("/public/:id/view", blogController.incrementView);
router.patch("/public/:id/like", blogController.toggleLike);

// Protected routes - chỉ partner và admin
router.use(authController.protect);
router.use(authController.restrictTo("partner", "admin"));

// CRUD routes
router
  .route("/")
  .get(blogController.getMyBlogs)
  .post(upload.single("coverImage"), resizeBlogImage, blogController.createBlog);

router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(upload.single("coverImage"), resizeBlogImage, blogController.updateBlog)
  .delete(blogController.deleteBlog);

module.exports = router;
