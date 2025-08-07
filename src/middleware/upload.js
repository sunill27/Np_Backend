const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Newsportal",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const parser = multer({ storage: storage });
module.exports = parser;
