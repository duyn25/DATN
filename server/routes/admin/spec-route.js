const express = require("express");

const {
    addSpec,
    editSpec,
    fetchAllSpecs,
    deleteSpec,
} = require("../../controller/admin/spec-controller");


const router = express.Router();

router.post("/add", addSpec);
router.put("/edit/:id", editSpec);
router.delete("/delete/:id", deleteSpec);
router.get("/get", fetchAllSpecs);

module.exports = router;