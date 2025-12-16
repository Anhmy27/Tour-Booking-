const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog phải có tiêu đề"],
      trim: true,
      maxlength: [200, "Tiêu đề không được quá 200 ký tự"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Blog phải có nội dung"],
    },
    coverImage: {
      type: String,
      default: "https://res.cloudinary.com/dmskqrjiu/image/upload/v1742210170/blogs/default.jpg",
    },
    images: [String], // Thêm nhiều ảnh
    category: {
      type: String,
      enum: ["du-lich", "am-thuc", "khach-san", "trai-nghiem", "meo-hay", "khac"],
      default: "khac",
    },
    tags: [String],
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Blog phải có tác giả"],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    linkedTour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
    },
    publishedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index để search nhanh
blogSchema.index({ title: "text", content: "text" });
blogSchema.index({ author: 1, status: 1 });
blogSchema.index({ slug: 1 });
blogSchema.index({ publishedAt: -1 });

// Tự động tạo slug từ title
blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  
  next();
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
