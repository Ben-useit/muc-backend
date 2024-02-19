const pdftopic = require("pdftopic");
const fs = require("fs");
const path = require("path");

const convertPDF = async (fileName, filePath, option = "all") => {
  const documentFile = fs.readFileSync(filePath);
  const converted_result = await pdftopic.pdftobuffer(documentFile, option);
  const images = [];
  converted_result.forEach((file, index) => {
    const path = `./document_cache/${fileName}-${index}.png`;
    images.push(`${fileName}-${index}.png`);
    fs.writeFileSync(path, file);
  });
  return images;
};

module.exports = convertPDF;
