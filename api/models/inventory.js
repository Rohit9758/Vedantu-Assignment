const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating our Inventory Schema with it's elements
const InventorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  seller:  { type: String, required: true },
  price: { type: Number, required: true },
  numberInStock: { type: Number, required: true },
  creationDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Product', InventorySchema);
