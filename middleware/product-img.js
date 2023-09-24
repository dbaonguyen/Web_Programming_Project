/* RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Nguyen Danh Bao, Nguyen Huu Khoi, Nguyen Anh Tu, Duong Viet Hoang, Le Dac Duy
ID: Nguyen Danh Bao(s3978319), Nguyen Huu Khoi(S3979411), Nguyen Anh Tu(s3975032), Le Dac Duy(s3978210), Duong Viet Hoang(s3962514)
Acknowledgement: Acknowledge the resources that you use here. */

const path = require("path");
const multer = require("multer");
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img/"); // Use a relative path without a leading /
  },
  filename: (req, file, cb) => {
    console.log(file);
    const filename = Date.now() + path.extname(file.originalname);
    // Store the image path in a variable
    req.imagePath = filename;
    cb(null, filename);
  },
});

const productImg = multer({ storage: productStorage });

module.exports = productImg;