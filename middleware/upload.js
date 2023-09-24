/* RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Nguyen Danh Bao, Nguyen Huu Khoi, Nguyen Anh Tu, Duong Viet Hoang, Le Dac Duy
ID: Nguyen Danh Bao(s3978319), Nguyen Huu Khoi(S3979411), Nguyen Anh Tu(s3975032), Le Dac Duy(s3978210), Duong Viet Hoang(s3962514)
Acknowledgement: Acknowledge the resources that you use here. */

const fs = require('fs')
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, './uploads');
  },
  filename: function(req,file,cb) {
    cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname)
  }
});

const upload = multer({ storage: storage });

module.exports = upload;