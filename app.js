require("dotenv").config();
require("express-async-errors");
var cors = require("cors");
const express = require("express");
const app = express();
const options = {
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: [
    "set-cookie",
    "Content-Type",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
  ],
};
app.use(cors(options));

const connectDB = require("./db/connect");
const authRouter = require("./routes/auth");
const documentRouter = require("./routes/documents");
const categoryRouter = require("./routes/categories");
const cookieParser = require("cookie-parser");
const notFound = require("./errors/not-found");
const errorHandler = require("./middleware/error");

//middleware
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use(express.static("document_cache"));

//routes
app.get("/", (req, res) => {
  res.send("Node is ready");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/documents", documentRouter);
app.use("/api/v1/categories", categoryRouter);

app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log("Node is running"));
  } catch (error) {
    console.log(error);
  }
};

start();
