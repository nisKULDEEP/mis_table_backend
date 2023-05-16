const redis = require('redis');
const reportModel = require('../models/reportModel');

const REDIS_PASS = process.env.REDIS_PASS;
const REDIS_HOST_URL = process.env.REDIS_HOST_URL;

// Redis configuration
const redisClient = redis.createClient({
  password: REDIS_PASS,
  socket: {
    host: REDIS_HOST_URL,
    port: 11827,
  },
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

const addReport = async (req, res) => {
  try {
    const reportData = await reportModel.create(req.body);
    res.status(200).json({
      status: 'success',
      message: 'data uploaded',
      data: reportData,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: 'data uploading failed',
      error,
    });
  }
};

const getReports = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const skip = (page - 1) * limit;
    const report_type = req.query.report_type;

    let reportData;
    let totalCount;

    let cachedData = await redisClient.get(report_type);
    cachedData = Boolean(cachedData) ? JSON.parse(cachedData) : '';

    if (
      Boolean(cachedData) &&
      cachedData?.page === page &&
      cachedData?.limit === limit &&
      cachedData?.skip === skip &&
      cachedData?.report_type === report_type
    ) {
      console.log('Cache hit');
      reportData = cachedData?.reportData;
      totalCount = cachedData?.totalCount;
    } else {
      console.log('Cache miss');
      if (Boolean(report_type)) {
        reportData = await reportModel
          .find({ report_type: { $eq: report_type } })
          .skip(skip)
          .limit(limit);
      } else {
        reportData = await reportModel.find().skip(skip).limit(limit);
      }

      totalCount = await reportModel.count();
      if (reportData?.length > 1000) {
        redisClient.set(
          report_type,
          JSON.stringify({
            totalCount,
            reportData: reportData.slice(0, 1001),
            page,
            limit,
            skip,
            report_type,
          })
        );
      } else {
        redisClient.set(
          report_type,
          JSON.stringify({
            totalCount,
            reportData,
            page,
            limit,
            skip,
            report_type,
          })
        );
      }

      redisClient.EXPIRETIME(DEFAULT_EXPIRATION);
    }

    res.status(200).json({
      status: 'succees',
      dataCount: reportData.length,
      totalCount,
      data: reportData,
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: 'something went wrong',
      error,
    });
  }
};

module.exports = {
  addReport,
  getReports,
};
