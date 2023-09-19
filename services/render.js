const axios = require("axios");

exports.vendor = (req, res) => {
  // Make a GET request to the API endpoint to retrieve product data
  axios
    .get("http://localhost:3000/api/products")
    .then((response) => {
      const name = req.isAuthenticated() ? req.user.username : undefined;
      const products = response.data;
      console.log(products)
      // Render the vendor page and pass the products data
      res.render("vendor-page", { products, name });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
exports.add_product = (req, res) => {
    const name = req.isAuthenticated() ? req.user.username : undefined;

    // Render the "add product" page and pass the username
    res.render("add-product", { name });
};

exports.update_product = (req, res) => {
  axios
    .get("http://localhost:3000/api/products", { params: { id: req.query.id } })
    .then(function (productData) {
      res.render("update-product", { product: productData.data });
    })
    .catch((err) => {
      res.send(err);
    });
};
