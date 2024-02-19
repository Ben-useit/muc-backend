const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: { type: String, required: true },
  fileName: { type: String, required: true },
  pages: { type: Number, required: true },
  category: { type: String, required: true },
  ocr: { type: String, required: false },
  images: [String],
});

module.exports = mongoose.model("Document", DocumentSchema);
