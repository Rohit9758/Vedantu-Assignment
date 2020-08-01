const mongoose = require("mongoose");
const Product = require("../models/inventory");

exports.product_inventory = (req, res, next) => {
// create new product after being validated and sanitized
let newProduct = new Product({
  name: req.body.name,
  description: req.body.description,
  category: req.body.category,
  seller: req.body.seller,
  price: req.body.price,
  numberInStock: req.body.numberInStock
});

newProduct.save(function (err, product) {
  if (err) {
    res.status(400).json({
      message: "Couldn't create please try again"
    });
  } else {
    res.status(200).json({
      message: "Added Succefully",
      product
    });
  }
});
};