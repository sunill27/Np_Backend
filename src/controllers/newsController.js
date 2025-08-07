const News = require("../database/model/newsModel");

class NewsController {
  // Add News API
  async addNews(req, res) {
    const { title, excerpt, description, author, publishedAt } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are mandatory" });
    }
    try {
      await News.create({
        title: title,
        excerpt: excerpt,
        description: description,
        author: author,
        publishedAt,
      });
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
      const news = await News.find();
      if (!news) {
        res.status(404).json({
          message: "Nothing found!",
        });
      }
      res.status(200).json({
        message: "News fetched successfully!",
        data: news,
      });
    } catch (error) {
      console.error("Fetch error:", error);
      res.status(500).json({ message: "Error fetching news", error });
    }
  }

  //Fetch single News API:
  async singleNews(req, res) {
    const { id } = req.params;
    try {
      const news = await News.findById(id);
      if (!news) {
        res.status(404).json({
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
    const { id } = req.params;
    const { title, excerpt, description, author, publishedAt } = req.body;
    try {
      const news = await News.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!news) {
        return res.status(404).json({ message: "News not found." });
      }
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
    const { id } = req.params;
    try {
      const News = await News.findByIdAndDelete(id);
      if (!news) {
        return res.status(404).json({ message: "News not found." });
      }
      res.status(200).json({
        message: "News deleted successfully!",
      });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ message: "Error deleting news", error });
    }
  }

  // COMMENTS API's:
  // Add comment:
  async addComment(req, res) {
    const { id } = req.params;
    const { username, text } = req.body;

    if (!username || !text) {
      return res
        .status(400)
        .json({ message: "Username and comment text are required." });
    }
    try {
      const news = await News.findById(id);
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
    const { id } = req.params;
    try {
      const news = await News.findById(id);
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
    const { id, commentId } = req.params;
    try {
      const news = await News.findById(id);
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
