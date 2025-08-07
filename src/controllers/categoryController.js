const Category = require("../database/model/categoryModel");

class categoryController {
  categoryData = [
    { categoryName: "Politics" },
    { categoryName: "Administration" },
    {
      categoryName: "Finance",
      subcategories: [
        { subCategoryName: "Bank" },
        { subCategoryName: "Other" },
      ],
    },
    { categoryName: "Agriculture" },
    { categoryName: "Energy" },
    { categoryName: "Infrastructure" },
    { categoryName: "Corporate" },
    { categoryName: "Technology" },
    { categoryName: "Automobiles" },
    {
      categoryName: "Sports",
      subcategories: [
        { subCategoryName: "Cricket" },
        { subCategoryName: "Football" },
        { subCategoryName: "Other" },
      ],
    },
    {
      categoryName: "Other",
      subcategories: [
        { subCategoryName: "Opinion" },
        { subCategoryName: "Interview" },
      ],
    },
  ];

  // Seeding Categories:
  async seedCategories() {
    const categoryData = await Category.find();
    if (categoryData.length === 0) {
      const data = await Category.create(this.categoryData);
      console.log("Categorie seeded succesfully!");
    } else {
      console.log("Categories already seeded!");
    }
  }

  // Add Category API:
  async addCategory(req, res) {
    const { categoryName } = req.body;
    if (!categoryName) {
      return res.status(400).json({
        message: "Category name is required!",
      });
    }
    try {
      const data = await Category.create({
        categoryName: categoryName,
      });
      res.status(200).json({
        message: "New category added successfully!",
        data: data,
      });
    } catch (error) {
      console.error("Add category error:", error);
      res.status(500).json({ message: "Error adding category", error });
    }
  }

  // Fetch Categories API:
  async fetchCategories(req, res) {
    try {
      const categories = await Category.find();
      if (!categories) {
        res.status(4004).json({
          message: "Categories not found!",
        });
      }
      res.status(200).json({
        message: "Categories fetched successfully!",
        data: categories,
      });
    } catch (error) {
      console.error("Categories fetch error:", error);
      res.status(500).json({ message: "Error fetching categories", error });
    }
  }

  // Fetch Single Cateory API:
  async singleCategory(req, res) {
    const { categoryId } = req.params;
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          message: "Category not found!",
        });
      }
      res.status(200).json({
        message: "Single category fetched successfully!",
        data: category,
      });
    } catch (error) {
      console.error("Single category fetch error:", error);
      res
        .status(500)
        .json({ message: "Error fetching single category", error });
    }
  }

  // Update Category API:
  async updateCategory(req, res) {
    const { categoryId } = req.params;
    const { categoryName } = req.body;
    try {
      const category = await Category.findByIdAndUpdate(categoryId, req.body, {
        new: true,
        runValidators: true,
      });
      if (!category) {
        return res.status(404).json({ message: "Category not found." });
      }
      res.status(200).json({
        message: "Category updated successfully!",
        data: category,
      });
    } catch (error) {
      console.error("Category update error:", error);
      res.status(500).json({ message: "Error updating category", error });
    }
  }

  // Delete Category API:
  async deleteCategory(req, res) {
    const { id } = req.params;
    try {
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).json({
          message: "No category found!",
        });
      }
      res.status(200).json({
        message: "Category deleted successfully!",
      });
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({ message: "Error deleting category", error });
    }
  }

  // Sub categories API:
  async addSubcategory(req, res) {
    const { categoryId } = req.params;
    const { subCategoryName } = req.body;
    if (!subCategoryName) {
      return res.status(400).json({
        message: "Subcategory name is required!",
      });
    }
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { $push: { subcategories: { subCategoryName } } },
        { new: true, runValidators: true }
      );
      if (!updatedCategory) {
        return res.status(404).json({
          message: "Category not found!",
        });
      }
      res.status(200).json({
        message: "Subcategory added successfully!",
        data: updatedCategory,
      });
    } catch (error) {
      console.log("Add  subcategory error:", error);
      res.status(500).json({
        message: "Error adding subcategory:",
        error,
      });
    }
  }

  // Fetch single subcategory:
  async singleSubcategory(req, res) {
    const { categoryId, subcategoryId } = req.params;
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          message: "Category not found!",
        });
      }
      const subcategory = await category.subcategories.id(subcategoryId);
      if (!subcategory) {
        return res.status(404).json({
          message: "Subcategory not found!",
        });
      }
      res.status(200).json({
        message: "Subcategory fetched successfully!",
        data: subcategory,
      });
    } catch (error) {
      console.log("Single subcategory fetch error:", error);
      res
        .status(500)
        .json({ message: "Error fetching single subcategory:", error });
    }
  }

  // Fetch subcategories:
  async fetchSubcategories(req, res) {
    const { categoryId } = req.params;
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          message: "Category not found!",
        });
      }
      const subcategories = category.subcategories || [];
      if (subcategories.length === 0) {
        return res.status(200).json({
          message: "No subcategories found for this category.",
          data: [],
        });
      }
      res.status(200).json({
        message: "Subcategories fetched successfully!",
        data: subcategories,
      });
    } catch (error) {
      console.log("Fetch subcategories error:", error);
      res.status(500).json({
        message: "Error fetching subcategories:",
        error,
      });
    }
  }

  // Update Subcategory:
  async updateSubcategory(req, res) {
    const { categoryId, subcategoryId } = req.params;
    const { subCategoryName } = req.body;
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          message: "Category not found!",
        });
      }
      // Find subcategory by ID inside the category's subcategories array
      const subcategory = category.subcategories.id(subcategoryId);
      if (!subcategory) {
        return res.status(404).json({
          message: "Subcategory not found!",
        });
      }
      if (subCategoryName) {
        subcategory.subCategoryName = subCategoryName;
      }
      await category.save();
      res.status(200).json({
        message: "Subcategory updated successfully!",
        data: subcategory,
      });
    } catch (error) {
      console.log("update subcategory error!", error);
      res.status(500).json({
        message: " Error updating subcategory:",
        error,
      });
    }
  }

  // Delete Subcategory:
  async deleteSubcategory(req, res) {
    const { categoryId, subcategoryId } = req.params;
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { $pull: { subcategories: { _id: subcategoryId } } },
        { new: true }
      );
      if (!updatedCategory) {
        return res.status(404).json({
          message: "Category not found!",
        });
      }
      res.status(200).json({
        message: "Subcategory deleted successfully!",
      });
    } catch (error) {
      console.log("Delete subcategory error:", error);
      res.status(500).json({
        message: "Error deleting subcategory",
        error,
      });
    }
  }
}

module.exports = new categoryController();
