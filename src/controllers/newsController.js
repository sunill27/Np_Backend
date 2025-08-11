const Category = require("../database/model/categoryModel");
const News = require("../database/model/newsModel");
const cloudinary = require("../middleware/cloudinaryConfig");

class NewsController {
  // Add News API
  async addNews(req, res) {
    console.log("addNews called");
    const {
      title,
      excerpt,
      description,
      author,
      publishedAt,
      category,
      subcategory,
    } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are mandatory" });
    }
    try {
      const newsData = {
        title,
        excerpt,
        description,
        author,
        publishedAt,
        category,
        subcategory,
      };
      // If image was uploaded, add imageUrl and imageId
      if (req.file) {
        newsData.imageUrl = req.file.path;
        newsData.imageId = req.file.filename; // Cloudinary public_id
      }
      console.log("Uploaded file info:", req.file);

      const news = await News.create(newsData);
      res.status(200).json({
        message: "News created successfully!",
      });
    } catch (error) {
      console.error("Create error:", error);
      res.status(500).json({ message: "Error creating news", error });
    }
  }

  //Fetch API:
  async fetchNews(req, res) {
    try {
      const { category, sort = "latest", limit = 10 } = req.query;
      const query = {};
      if (category) {
        const categoryDoc = await Category.findOne({
          categoryName: category.toLowerCase(),
        });

        if (!categoryDoc) {
          return res.status(404).json({ message: "Category not found" });
        }
        query.category = categoryDoc._id;
      }

      const sortOption =
        sort === "latest"
          ? { createdAt: -1 }
          : sort === "oldest"
          ? { createdAt: 1 }
          : {};

      const news = await News.find(query)
        .sort(sortOption)
        .limit(parseInt(limit));

      res.status(200).json({
        message: "News fetched successfully!",
        data: news,
      });
    } catch (error) {
      console.error("Error in fetchNews:", error);
      res
        .status(500)
        .json({ message: "Error fetching news", error: error.message });
    }
  }

  //Fetch single News API:
  async singleNews(req, res) {
    const { _id } = req.params;
    try {
      const news = await News.findById(_id).populate(
        "category",
        "categoryName"
      ); // <-- add populate here
      if (!news) {
        return res.status(404).json({
          message: "Nothing found!",
        });
      }
      res.status(200).json({
        message: "Single News fetched successfully!",
        data: news,
      });
    } catch (error) {
      console.error("Single fetch error:", error);
      res.status(500).json({ message: "Error fetching single news", error });
    }
  }

  //Update API:
  async updateNews(req, res) {
    const { _id } = req.params;
    const {
      title,
      excerpt,
      description,
      author,
      publishedAt,
      category,
      subcategory,
    } = req.body;

    try {
      const news = await News.findById(_id);
      if (!news) {
        return res.status(404).json({ message: "News not found." });
      }

      // If a new image is uploaded
      if (req.file) {
        // Delete old image from Cloudinary
        if (news.imageId) {
          await cloudinary.uploader.destroy(news.imageId);
        }
        // Update with new image info
        news.imageUrl = req.file.path;
        news.imageId = req.file.filename;
      }
      // Update other fields
      if (title !== undefined) news.title = title;
      if (excerpt !== undefined) news.excerpt = excerpt;
      if (description !== undefined) news.description = description;
      if (author !== undefined) news.author = author;
      if (publishedAt !== undefined) news.publishedAt = publishedAt;
      if (category !== undefined) news.category = category;
      if (subcategory !== undefined) news.subcategory = subcategory;

      await news.save();
      res.status(200).json({
        message: "News updated successfully!",
        data: news,
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Error updating news", error });
    }
  }

  // Delete API:
  async deleteNews(req, res) {
    const { _id } = req.params;
    try {
      const news = await News.findById(_id);
      if (!news) {
        return res.status(404).json({ message: "News not found." });
      }
      // Delete image from Cloudinary if exists
      if (news.imageId) {
        await cloudinary.uploader.destroy(news.imageId);
      }
      // Delete the news document
      await news.deleteOne();
      res.status(200).json({
        message: "News deleted successfully!",
      });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ message: "Error deleting news", error });
    }
  }

  // Fetch all news by category

  async getNewsByCategoryName(req, res) {
    const { categoryName } = req.params;

    try {
      const category = await Category.findOne({ categoryName });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      const newsList = await News.find({ category: category._id }).populate(
        "category",
        "categoryName"
      );

      if (!newsList.length) {
        return res
          .status(404)
          .json({ message: "No news found for this category" });
      }

      res.status(200).json({
        message: "News by category fetched successfully!",
        data: newsList,
      });
    } catch (error) {
      console.error("Error fetching news by category:", error);
      res.status(500).json({
        message: "Error fetching news by category",
        error: error.message,
      });
    }
  }

  // COMMENTS API's:
  // Add comment:
  async addComment(req, res) {
    const { _id } = req.params;
    const { username, text } = req.body;

    if (!username || !text) {
      return res
        .status(400)
        .json({ message: "Username and comment text are required." });
    }
    try {
      const news = await News.findById(_id);
      if (!news) {
        return res.status(404).json({ message: "News not found!" });
      }
      // Add comment to the News's comments array
      news.comments.push({ username, text });

      await news.save();

      res.status(201).json({
        message: "Comment added successfully!",
        data: news.comments,
      });
    } catch (error) {
      console.error("Add comment error:", error);
      res.status(500).json({ message: "Error adding comment", error });
    }
  }

  // Fetch Comments API:
  async fetchComments(req, res) {
    const { _id } = req.params;
    try {
      const news = await News.findById(_id);
      if (!news) {
        res.status(404).json({
          message: "Nothing found!",
        });
      }
      res.status(200).json({
        message: "Comments fetched successfully!",
        data: news.comments,
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Error fetching comments", error });
    }
  }

  //Delete comments API:
  async deleteComment(req, res) {
    const { _id, commentId } = req.params;
    try {
      const news = await News.findById(_id);
      if (!news) {
        return res.status(404).json({ message: "News not found!" });
      }
      const comment = News.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found!" });
      }
      news.comments.pull(commentId);
      await news.save();

      res.status(200).json({
        message: "Comment deleted successfully!",
      });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ message: "Error deleting comment", error });
    }
  }
}
module.exports = new NewsController();
