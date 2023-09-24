/* RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Nguyen Danh Bao, Nguyen Huu Khoi, Nguyen Anh Tu, Duong Viet Hoang, Le Dac Duy
ID: Nguyen Danh Bao(s3978319), Nguyen Huu Khoi(S3979411), Nguyen Anh Tu(s3975032), Le Dac Duy(s3978210), Duong Viet Hoang(s3962514)
Acknowledgement: Acknowledge the resources that you use here. */

const Shipper = require("../model/Shipper");

const checkAuthention = {
  checkAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  },
  checkNotAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect("/"); // Allow unauthenticated users to proceed
    }
    next(); // Redirect authenticated users to the home page
  },
  roleRedirect: (role, redirectUrl) => {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === role) {
        return res.redirect(redirectUrl);
      }
      next();
    };
  },
  profileRedirect: async (req, res) => {
    if (!req.isAuthenticated()) {
      // Handle the case where the user is not authenticated (not logged in)
      res.redirect("/login"); // Redirect to the login page or handle as needed
      return;
    }

    const { role } = req.user;

    let name = req.user.username;
    let phone = req.user.phone;
    let address = req.user.address;
    let email = req.user.email;
    let businessName = req.user.businessName;
    let businessAddress = req.user.businessAddress;
    let photo = req.user.pfp;
    let distributionHubName = ""; // Initialize the distribution hub name

    if (role === "shipper") {
      try {
        // Find the shipper by ID and populate the distributionHub field
        const shipper = await Shipper.findById(req.user._id).populate(
          "distributionHub"
        );

        if (shipper && shipper.distributionHub) {
          distributionHubName = shipper.distributionHub.name;
          console.log(distributionHubName);
        }
      } catch (error) {
        console.error(error);
      }
    }

    let profileTemplate;

    switch (role) {
      case "customer":
        profileTemplate = "my-profile-cus";
        break;
      case "shipper":
        profileTemplate = "my-profile-ship";
        break;
      case "vendor":
        profileTemplate = "my-profile-ven";
        break;
      default:
        // Handle other roles if needed
        res.status(403).send("Unauthorized");
        return;
    }

    console.log("Image Path:", photo);
    res.render(`./profiles/${profileTemplate}`, {
      photo: photo,
      name: name,
      phone: phone,
      address: address,
      email: email,
      distributionHub: distributionHubName,
      businessName: businessName,
      businessAddress: businessAddress,
    });
  },
  updateProfilePicture: async (req, res) => {
    try {
      // Access the uploaded file using req.file
      if (!req.file) {
        req.flash("error", "No file uploaded.");
        return res.redirect("/profile");
      }
      const profilePicturePath = req.file.filename;

      // Update the user's profile with the new image path
      req.user.pfp = profilePicturePath;
      console.log("New pfp path: " + profilePicturePath)
      await req.user.save();

      res.redirect("/profile");
    } catch (error) {
      console.error(error);
      res.redirect("/profile");
    }
  },
};

module.exports = checkAuthention;
