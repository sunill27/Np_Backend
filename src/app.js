const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 5000;

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
const parser = require("./middleware/upload");

// Parse JSON bodies
app.use(express.json());

// Connect to DB
const dbConnection = require("./database/connection");
dbConnection();

// Main app function to support async/await
async function startServer() {
  // Optional: seed admin
  const adminSeeder = require("./adminSeeder");
  await adminSeeder();

  // Optional: seed categories
  const categoryController = require("./controllers/categoryController");
  await categoryController.seedCategories?.(); // Use optional chaining in case not defined

  // Routes
  app.get("/", (req, res) => {
    res.send("Backend is running properly.");
  });

  const newsRoute = require("./routes/newsRoute");
  app.use("/news", newsRoute);
  app.use("/admin/news", newsRoute);

  const userRoute = require("./routes/userRoute");
  app.use("/user", userRoute);

  const categoryRoute = require("./routes/categoryRoute");
  app.use("/admin/categories", categoryRoute);

  // Cloudinary upload endpoint
  app.post("/upload", parser.single("image"), (req, res) => {
    console.log(req.file); // file info from Cloudinary
    res.json({
      message: "File uploaded successfully",
      url: req.file.path, // Cloudinary URL
      public_id: req.file.filename,
    });
  });

  app.listen(PORT, () => {
    console.log("Server has started at port:", PORT);
  });
}

startServer().catch((err) => {
  console.error("Server failed to start:", err);
});
