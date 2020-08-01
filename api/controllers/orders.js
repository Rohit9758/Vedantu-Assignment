const mongoose = require("mongoose");
const Order = require("../models/orders");

exports.createOrder = (req, res, next) => {
// create new product after being validated and sanitized
let newOrder = new Order({
  name: req.body.name,
  description: req.body.description,
  category: req.body.category,
  seller: req.body.seller,
  price: req.body.price,
  numberInStock: req.body.numberInStock
});

newOrder.save(function (err, Order) {
  if (err) {
    res.status(400).json({
      message: "Couldn't create please try again"
    });
  } else {
    res.status(200).json({
      message: "Added Succefully",
      Order
    });
  }
});
};