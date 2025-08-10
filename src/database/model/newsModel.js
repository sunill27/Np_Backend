const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [5, "Title must be at least 5 characters"],
    },
    excerpt: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    imageUrl: {
      type: String,
    },
    imageId: {
      type: String,
    },
    author: {
      type: String,
    },
    publishedAt: {
      type: Date,
    },
    tags: [String],
    comments: [commentSchema],

    // Add reference to Category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    // Add subCategory name directly (or as an ID if needed)
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

const News = mongoose.model("News", newsSchema);
module.exports = News;
