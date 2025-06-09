const pdftopic = require('pdftopic');
const fs = require('fs');
const path = require('path');

const convertPDF = async (project_root, file_name, option = 'all') => {
  const documentFile = fs.readFileSync(
    `${project_root}/document_storage/${file_name}`
  );
  const converted_result = await pdftopic.pdftobuffer(documentFile, option);
  const images = [];
  converted_result.forEach((file, index) => {
    const path = `${project_root}/document_cache/${file_name}-${index}.png`;
    images.push(`${file_name}-${index}.png`);
    fs.writeFileSync(path, file);
  });
  return images;
};
//const fileName = `./document_storage/${fileName}`;

//convertPDF(project_root, '91a6b907-e0a5-404c-a094-7af34303fb2d');
module.exports = convertPDF;
