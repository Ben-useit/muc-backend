const express = require("express");
const router = express.Router();
const getCategoryNames = require("../controller/categories");
router.route("/").get(getCategoryNames);

module.exports = router;
