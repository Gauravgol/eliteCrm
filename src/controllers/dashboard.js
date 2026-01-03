const User = require("../schemas/user.model");
const Project = require("../schemas/project.model");
const Task = require("../schemas/task.model");
const { responseHandler } = require("../commonUtils/responseHandler");
const { info_logger, error_logger } = require("../logger/winston");

exports.dashboardController = async (req, res) => {
  const urn = req.headers.urn;

  try {
    info_logger(`urn:${urn} >>>>> GET DASHBOARD  DATA`);

    const { userId } = req.query;

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.send( responseHandler({ code: 404, message: "User not found" }));
    }

    const tasks = await Task.find({})
    const apiResponse = { code: 200, message: "Menu fetched successfully", data: menu };
    return res.send(responseHandler(apiResponse));

  } catch (error) {
    error_logger(`urn:${urn} >>>>> GET MENU ERROR ${error}`);
    return res.send( responseHandler({ code: 500, message: "Something went wrong", error: error.message }));
  }
};
