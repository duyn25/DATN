const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
  getCategories,
} = require("../../controller/shop/product-controller");

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);
router.get("/category/get", getCategories);

module.exports = router;