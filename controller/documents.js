const { StatusCodes } = require('http-status-codes');
const Document = require('../models/document');

const getAllDocuments = async (req, res) => {
  const { search } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  let result = null;
  let documents = null;
  let totalDocuments = null;
  if (search?.length > 0 && search !== '""') {
    result = await Document.aggregate([
      {
        $search: {
          index: 'MUC-INDEX',
          text: {
            query: search,
            path: {
              wildcard: '*',
            },
          },
        },
      },
      {
        $project: { pages: 0, ocr: 0, images: 0, type: 0 },
      },

      {
        $facet: {
          paginatedResults: [{ $skip: skip }, { $limit: limit }],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    const { totalCount } = result[0];
    if (totalCount.length === 0)
      return res.status(200).json({
        documents: [],
        totalDocuments: 0,
        numOfPages: 0,
      });
    const { count } = result[0].totalCount[0];
    documents = result[0].paginatedResults;
    totalDocuments = count;
  } else {
    result = Document.find(
      {},
      {
        label: 1,
        type: 1,
        pages: 1,
        fileName: 1,
        category: 1,
        ocr: 1,
        images: 1,
      }
    );
    result = result.skip(skip).limit(limit);
    documents = await result;
    totalDocuments = await Document.countDocuments({});
  }

  const numOfPages = Math.ceil(totalDocuments / limit);
  res.status(StatusCodes.OK).json({ documents, totalDocuments, numOfPages });
};

module.exports = {
  getAllDocuments,
};
