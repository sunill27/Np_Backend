const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  subCategoryName: {
    type: String,
  },
});
const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, "Category name is required"],
  },
  subcategories: [subCategorySchema],
});

const Category = new mongoose.model("Category", categorySchema);
module.exports = Category;
