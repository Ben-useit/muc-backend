const { StatusCodes } = require("http-status-codes");
const Document = require("../models/document");
const getCategoryNames = async (req, res) => {
  const result = await Document.aggregate([
    {
      $group: {
        _id: { category: "$category" },
        //dups: { $addToSet: "$_id" },
        count: { $sum: 1 },
      },
    },
    {
      $match: {
        count: { $gt: 1 },
      },
    },
  ]);
  //console.log(result);
  result.forEach((c) => {
    const {
      _id: { category },
      count,
    } = c;
    console.log(category, count);
  });
  res.status(StatusCodes.OK).json(result);
};

module.exports = getCategoryNames;
