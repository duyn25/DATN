const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
  getCategories,
  getFilterFieldsByCategory,
} = require("../../controller/shop/product-controller");

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);
router.get("/filters", getFilterFieldsByCategory);
router.get("/category/get", getCategories);

module.exports = router;