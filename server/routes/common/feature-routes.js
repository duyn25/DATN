const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
} = require("../../controller/common/feature-controller");

const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImages);

module.exports = router;