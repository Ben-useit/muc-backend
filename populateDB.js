require("dotenv").config();
const pdftopic = require("pdftopic");
const path = require("path");
const readline = require("readline");
const fs = require("fs");
const connectDB = require("./db/connect");
const Document = require("./models/document");
//const jsonDocuments = require("./xxx.json");
const convertPDF = require("./utils/pdf");

const populate = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Document.deleteMany();
    await Document.create(jsonDocuments);
    console.log("Success");
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
      input: fs.createReadStream("/home/ben/muc.list"),
      output: process.stdout,
      terminal: false,
    });

    let category = null;
    file.on("line", async (line) => {
      if (line.startsWith(".")) {
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
      const filePath = `./document_storage/${doc.fileName}`;
      const documentFile = fs.readFileSync(filePath);
      const converted_result = await pdftopic.pdftobuffer(documentFile, 0);
      converted_result.forEach((file, index) => {
        const path = `./document_cache/${doc.fileName}-${index}.png`;
        fs.writeFileSync(path, file);
        doc.thumb = path;
      });
      await doc.save();
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  process.exit(0);
};

createThumbs();
