const Notification = require("../schemas/notification.model");
const mongoQuery = require("../db/mongoQuery");
const { info_logger, error_logger } = require("../logger/winston")

exports.createNotification = async ({ userId, type, title, message, entityType, entityId, metadata = {}, }) => {
    try {
        info_logger(`Creating notification | userId=${userId} | type=${type} | entityType=${entityType} | entityId=${entityId}`);
        await mongoQuery.insertOne({ model: Notification, data: { userId, type, title, message, entityType, entityId, metadata }});
    } catch (error) {
        error_logger(`Failed to create notification | userId=${userId} | type=${type} | error=${error.message}`);
    }
};
