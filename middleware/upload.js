const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img/pfp"); // Use a relative path without a leading /
  },
  filename: (req, file, cb) => {
    console.log(file);
    const filename = Date.now() + path.extname(file.originalname);
    // Store the image path in a variable
    req.imagePath = filename;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;