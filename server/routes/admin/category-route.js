// routes/categoryRoutes.js
const express = require("express");
const { 
    addCategory,
    fetchAllCategories,
    editCategory,
    deleteCategory
 } = require("../../controller/admin/cate-controller");
const router = express.Router();

router.post("/add", addCategory);
router.get("/get", fetchAllCategories);
router.put("/edit/:id", editCategory);
router.delete("/delete/:id", deleteCategory);

module.exports = router;
