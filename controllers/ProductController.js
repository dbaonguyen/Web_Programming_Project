const { Product } = require("../model/Product");
const Category = require("../model/Category");

//create and save new product
exports.create = (req, res) => {
  console.log("Create product route called");

  // Check if the request body contains the necessary data
  if (!req.body) {
    console.error("Request body is empty");
    res.status(400).send({ message: "Content can not be empty" });
    return;
  }
  const categoryName = req.body.category;
  console.log(categoryName);
  // Extract data from the request body
  const category = Category.findOne({
    name: categoryName,
  });
  let product;
  // Create a new Product instance
   product = new Product({
    name : req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: category._id,
    size: req.body.size,
  });
  

  // Check if a file was uploaded and set the product_image property
  if (req.file) {
    product.product_image = req.file.path;
  }
  

  // Validate the product
  const validationError = product.validateSync();
  if (validationError) {
    console.error("Validation error:", validationError);

    // Extract the error messages from the validation error
    const errorMessages = Object.values(validationError.errors).map(
      (error) => error.message
    );

    // Render the add-product page with error messages
    return res.render("add-product", {
      errorMessages,
    });
  }

  // Save the product in the database
  console.log("Saving product...");
  product
    .save()
    .then((savedProduct) => {
      console.log("Product saved:", savedProduct);

      // Redirect to the vendor page or send a success response
      
    })
    .catch((err) => {
      console.error("Error saving product:", err);

      // Handle the error, e.g., sending an error response
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating a create operation",
      });
    });
    res.redirect("/vendor");
};


//get all products/ a product
exports.find = (req, res) => {
  if (req.query.id) {
    const id = req.query.id;

    Product.findById(id)
      .then((data) => {
        if (!data) {
          res.status(400).send({ message: `Not found with specific id ${id}` });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: `Error getting product with id ${id}` });
      });
  } else {
    Product.find()
      .then((product) => {
        res.send(product);
      })
      .catch((err) => {
        res
          .status(500)
          .send({
            message:
              err.message || "Error occurred while getting product information",
          });
      });
  }
};

//update a product by id
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" });
  }
  const id = req.params.id;
  Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot update product with id ${id}` });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error updare product information" });
    });
};

//delete a product by id
exports.delete = (req, res) => {
  const id = req.params.id;
  Product.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: `Cannot delete with id ${id} ` });
      } else {
        res.send({
          message: "Product was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: `Could not delete product with id ${id}` });
    });
};
