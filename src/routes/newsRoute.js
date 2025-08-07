const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");

const {
  authenticate,
  restrictTo,
  ADMIN,
} = require("../middleware/authMiddleware");

//News
router.route("/").post(authenticate, restrictTo(ADMIN), newsController.addNews);
router.route("/").get(newsController.fetchNews);
router.route("/:id").get(newsController.singleNews);
router
  .route("/:id")
  .patch(authenticate, restrictTo(ADMIN), newsController.updateNews);
router
  .route("/:id")
  .delete(authenticate, restrictTo(ADMIN), newsController.deleteNews);

// Comments:
router.route("/:id/comments").post(authenticate, newsController.addComment);
router.route("/:id/comments").get(newsController.fetchComments);
router
  .route("/:id/comments/:commentId")
  .delete(authenticate, restrictTo(ADMIN), newsController.deleteComment);

module.exports = router;
