const paginate = (model) => async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }

    results.results = await model.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex)
      .exec();

    results.totalPages = Math.ceil(await model.countDocuments() / limit);
    results.currentPage = page;
    results.totalCount = await model.countDocuments();

    res.paginatedResults = results;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error paginating results',
      error: error.message
    });
  }
};

module.exports = paginate;