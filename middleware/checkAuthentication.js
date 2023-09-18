const Shipper = require('../model/Shipper');

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
};

module.exports = checkAuthention;
