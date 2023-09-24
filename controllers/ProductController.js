/* RMIT University Vietnam
Course: COSC2430 Web Programming
Semester: 2023A
Assessment: Assignment 2
Author: Nguyen Danh Bao, Nguyen Huu Khoi, Nguyen Anh Tu, Duong Viet Hoang, Le Dac Duy
ID: Nguyen Danh Bao(s3978319), Nguyen Huu Khoi(S3979411), Nguyen Anh Tu(s3975032), Le Dac Duy(s3978210), Duong Viet Hoang(s3962514)
Acknowledgement: Acknowledge the resources that you use here. */

const { Product } = require("../model/Product");
const Category = require("../model/Category");
const Vendor = require("../model/Vendor");

//create and save new product
exports.create = async (req, res) => {
  console.log("Create product route called");

  // Check if the request body contains the necessary data
  if (!req.body) {
    console.error("Request body is empty");
    res.status(400).send({ message: "Content can not be empty" });
    return;
  }

  try {
    const categoryName = req.body.category;
    console.log(categoryName);

    // Extract data from the request body
    const category = await Category.findOne({ name: categoryName });
    const vendorId = req.user._id; // Get the vendor ID from the authenticated user

    // Create a new Product instance
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: category._id,
      vendor: vendorId, // Assign the vendor ID
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
    const savedProduct = await product.save();
    console.log("Product saved:", savedProduct);

    // Find and update the vendor's products array
    const loggedInVendor = await Vendor.findById(vendorId);
    loggedInVendor.products.push(savedProduct._id); // Add the product's ID to the vendor's products array
    await loggedInVendor.save();

    // Redirect to the vendor page or send a success response
    res.redirect("/vendor");
  } catch (err) {
    console.error("Error creating product:", err);

    // Handle the error, e.g., sending an error response
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating a create operation",
    });
  }
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
        res.status(500).send({
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
