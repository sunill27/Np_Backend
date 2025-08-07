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
    author: {
      type: String,
    },
    publishedAt: {
      type: Date,
    },
    tags: [String],
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const News = mongoose.model("News", newsSchema);
module.exports = News;
