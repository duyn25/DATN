const express = require("express");

const {
  getAdminStatistics,
} = require("../../controller/admin/stat-controller");


const router = express.Router();
router.get("/get",  getAdminStatistics);

module.exports = router;