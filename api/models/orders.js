const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  email: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  shippedDate: { type: Date },
  deliveredDate: { type: Date },
  products: { type: Array, default: [] },
  totalPrice: { type: Number }
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
