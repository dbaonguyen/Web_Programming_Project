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
