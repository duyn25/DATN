const express = require("express");

const { searchProducts, suggestProducts } = require("../../controller/shop/search-controller");

const router = express.Router();
router.get("/suggest", suggestProducts);

router.get("/:keyword", searchProducts);

module.exports = router;