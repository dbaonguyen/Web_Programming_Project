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
 
};

module.exports = checkAuthention;
