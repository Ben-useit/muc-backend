const errorMiddleware = (err, req, res, next) => {
  let error = {
    status: err.status || 500,
    msg: `>> ${err.message}` || "General Error",
  };
  res.status(error.status).json({ msg: error.msg });
};

module.exports = errorMiddleware;
