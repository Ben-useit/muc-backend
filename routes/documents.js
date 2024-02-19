const express = require("express");
const { getAllDocuments } = require("../controller/documents");
const { getDocumentPages } = require("../controller/pages");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router.route("/").get(authMiddleware, getAllDocuments);
router.route("/:id").get(authMiddleware, getDocumentPages);

module.exports = router;
