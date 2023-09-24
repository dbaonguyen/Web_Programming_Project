/*RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Nguyen Danh Bao, Nguyen Huu Khoi, Nguyen Anh Tu, Duong Viet Hoang, Le Dac Duy
ID: Nguyen Danh Bao(s3978319), Nguyen Huu Khoi(S3979411), Nguyen Anh Tu(s3975032), Le Dac Duy(s3978210), Duong Viet Hoang(s3962514)
Acknowledgement: Acknowledge the resources that you use here.*/

const express = require("express");
const router = express.Router();

router.get("/complain", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("footers-info/footer-complain", { name });
});
router.get("/contact", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("footers-info/footer-contact", { name });
});
router.get("/privacy", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("footers-info/footer-privacy", { name });
});
router.get("/property", (req, res) => {
  let name = req.isAuthenticated() ? req.user.username : undefined;
  res.render("footers-info/footer-property", { name });
});

module.exports = router;
