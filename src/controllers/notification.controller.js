const Notification = require("../schemas/notification.model");
const { responseHandler } = require("../commonUtils/responseHandler");
const { info_logger, error_logger } = require("../logger/winston");
const mongoQuery = require("../db/mongoQuery")

exports.getNotificationsController = async (req, res) => {
  const urn = req.headers.urn;

  try {
    info_logger(`urn:${urn} >>>>> GET NOTIFICATIONS REQ QUERY: ${JSON.stringify(req.query)}`);

    const { page = 1, limit = 10, isRead, type, userId } = req.query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    /* -------- SEARCH CONDITION -------- */
    const searchCondition = {};

    if (userId) searchCondition.userId = userId;
    if (isRead !== undefined) searchCondition.isRead = isRead === "true";
    if (type) searchCondition.type = type;

    /* -------- TOTAL COUNT -------- */
    const totalCount = await Notification.countDocuments(searchCondition);

    /* -------- FETCH NOTIFICATIONS -------- */
    const notifications = await Notification.find(searchCondition).sort({ createdAt: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize);

    const apiResponse = {
      code: "200",
      message: "Notifications fetched successfully",
      data: {
        list: notifications,
        pagination: {
          currentPage: pageNumber,
          pageSize: pageSize,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      },
    };

    return res.send(responseHandler(apiResponse));
  } catch (error) {
    error_logger(`urn:${urn} >>>>> GET NOTIFICATIONS ERROR ${error}`);
    return res.send(
      responseHandler({
        code: 500,
        message: "Something went wrong: " + error.message,
      })
    );
  }
};

exports.markNotificationsAsReadController = async (req, res) => {
  const urn = req.headers.urn;

  try {
    info_logger(`urn:${urn} >>>>> MARK NOTIFICATIONS READ REQ BODY: ${JSON.stringify(req.body)}`);
    const { notificationIds = [], userId } = req.body;
    let updatedCount = 0;

    const result = await mongoQuery.updateMany({ model: Notification,
      filter: { _id: { $in: notificationIds }, userId },
      update: { $set: { isRead: true } },
    });

    updatedCount = result.modifiedCount;
    return res.send( responseHandler({ code: 200, message:"success", data: {updatedCount }}));

  } catch (error) {
    error_logger(`urn:${urn} >>>>> MARK NOTIFICATIONS READ ERROR ${error.message}`);
    return res.send( responseHandler({ code: 500, message: "Something went wrong: " + error.message }));
  }
};