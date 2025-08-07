const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const {
  authenticate,
  restrictTo,
  ADMIN,
} = require("../middleware/authMiddleware");

// Categories:
router.route("/").get(categoryController.fetchCategories);
router.route("/:categoryId").get(categoryController.singleCategory);
router
  .route("/")
  .post(authenticate, restrictTo(ADMIN), categoryController.addCategory);
router
  .route("/:categoryId")
  .patch(authenticate, restrictTo(ADMIN), categoryController.updateCategory);
router
  .route("/:categoryId")
  .delete(authenticate, restrictTo(ADMIN), categoryController.deleteCategory);

// Subcategories:
router
  .route("/:categoryId/subcategories")
  .get(categoryController.fetchSubcategories);
router
  .route("/:categoryId/subcategories/:subcategoryId")
  .get(categoryController.singleSubcategory);
router
  .route("/:categoryId/subcategories")
  .post(authenticate, restrictTo(ADMIN), categoryController.addSubcategory);
router
  .route("/:categoryId/subcategories/:subcategoryId")
  .patch(authenticate, restrictTo(ADMIN), categoryController.updateSubcategory);
router
  .route("/:categoryId/subcategories/:subcategoryId")
  .delete(
    authenticate,
    restrictTo(ADMIN),
    categoryController.deleteSubcategory
  );

module.exports = router;
