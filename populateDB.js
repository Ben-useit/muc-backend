require('dotenv').config();
const pdftopic = require('pdftopic');
const path = require('path');
const readline = require('readline');
const fs = require('fs');
const connectDB = require('./db/connect');
const Document = require('./models/document');
const jsonDocuments = require('../muc-import.json');
const convertPDF = require('./utils/pdf');

const populate = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Document.deleteMany();
    await Document.create(jsonDocuments);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
const populateA = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const file = readline.createInterface({
      input: fs.createReadStream('/home/ben/Downloads/muc.list'),
      output: process.stdout,
      terminal: false,
    });
    //console.log('file: ', file);

    let category = null;
    file.on('line', async (line) => {
      console.log('line: ', line);
      if (line.startsWith('.')) {
        category = line.slice(2, line.length - 1);
      } else if (line.length > 0) {
        const doc = { category: category, label: line };
        await Document.create(doc);
      }
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  process.exit(0);
};

//populate();

const createThumbs = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const documents = await Document.find({});
    for (const doc of documents) {
      const storePath = `./document_cache/${doc.fileName}-0.png`;
      console.log(doc.fileName);
      if (doc.thumb != storePath) {
        const filePath = `./document_storage/${doc.fileName}`;
        const documentFile = fs.readFileSync(filePath);
        const converted_result = await pdftopic.pdftobuffer(documentFile, 0);
        converted_result.forEach((file, index) => {
          const path = `./document_cache/${doc.fileName}-${index}.png`;
          fs.writeFileSync(storePath, file);
          doc.thumb = storePath;
        });
        await doc.save();
      }
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  process.exit(0);
};

//createThumbs();
const deleteDocument = async () => {
  await Document.deleteOne({
    fileName: '801a5fc7-e3f2-423d-805f-b02764e36e17',
  });
};

//deleteDocument();
const deletePageArray = async () => {
  await connectDB(process.env.MONGO_URI);
  const docs = await Document.find({});
  docs.forEach(async (d) => {
    console.log(d.label);
    d.images = [];
    await d.save();
  });
};

//createThumbs();
//deletePageArray();
