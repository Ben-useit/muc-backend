const Document = require("../models/document");
const convertPDF = require("../utils/pdf");
const { GeneralAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getDocumentPages = async (req, res) => {
  const { id } = req.params;
  const document = await Document.findOne({ _id: id });
  if (!document) throw new GeneralAPIError("No document found.");
  const { label, fileName, pages, images, category } = document;
  let docImages = images;
  if (docImages.length === 0) {
    const documentImages = await convertPDF(
      fileName,
      `./document_storage/${fileName}`
    );

    document.images = documentImages;
    await document.save();
    docImages = documentImages;
  }
  res
    .status(StatusCodes.OK)
    .json({ id, label, pages, images: docImages, category });
};

module.exports = { getDocumentPages };
