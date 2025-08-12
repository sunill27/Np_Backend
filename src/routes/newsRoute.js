const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");
const parser = require("../middleware/upload");

const {
  authenticate,
  restrictTo,
  ADMIN,
} = require("../middleware/authMiddleware");

//News
router
  .route("/")
  .post(
    authenticate,
    restrictTo(ADMIN),
    parser.single("image"),
    newsController.addNews
  );
router.route("/").get(newsController.fetchNews);
router.route("/:_id").get(newsController.singleNews);
router.get("/category/:categoryName", newsController.getNewsByCategoryName);

router
  .route("/:_id")
  .patch(
    authenticate,
    restrictTo(ADMIN),
    parser.single("image"),
    newsController.updateNews
  );
router
  .route("/:_id")
  .delete(authenticate, restrictTo(ADMIN), newsController.deleteNews);

// Comments:
router.route("/:_id/comments").post(newsController.addComment);
router.route("/:_id/comments").get(newsController.fetchComments);
router
  .route("/:_id/comments/:commentId")
  .delete(authenticate, restrictTo(ADMIN), newsController.deleteComment);

module.exports = router;
