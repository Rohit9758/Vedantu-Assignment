const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventory");

router.post("/product", inventoryController.product_inventory);

module.exports = router;