const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
  getCategories,
  getFilterFieldsByCategory,
  homeProducts,
} = require("../../controller/shop/product-controller");

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);
router.get("/filters", getFilterFieldsByCategory);
router.get("/category/get", getCategories);
router.get('/home-products', homeProducts);

module.exports = router;