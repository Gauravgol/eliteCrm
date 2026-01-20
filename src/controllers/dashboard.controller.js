const User = require("../schemas/user.model");
const Project = require("../schemas/project.model");
const Task = require("../schemas/task.model");
const { responseHandler } = require("../commonUtils/responseHandler");
const { info_logger, error_logger } = require("../logger/winston");
const mongoQuery = require("../db/mongoQuery");
const { employeeDashboardPipeline, projectDashboardPipeline, clientDashboardPipeline } = require("../queries/dashboard")

exports.dashboardController = async (req, res) => {
  const urn = req.headers.urn;

  try {
    info_logger(`urn:${urn} >>>>> GET DASHBOARD  DATA`);

    const { userId } = req.query;

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.send(responseHandler({ code: 404, message: "User not found" }));
    }

    if (user.role === "superAdmin" || user.role === "admin") {
      const aggregationResult = await mongoQuery.aggregate({ model: Task, pipeline: employeeDashboardPipeline(userId) });

      const taskDashboard = { INPROGRESS: 0, COMPLETE: 0, HOLD: 0, TODO: 0, QC: 0 };
      aggregationResult.forEach(item => { taskDashboard[item._id] = item.count });

      const projectAggregation = await mongoQuery.aggregate({ model: Project, pipeline: projectDashboardPipeline() });

      const projectDashboard = { TODO: 0, INPROGRESS: 0, TESTING: 0, DELIVERED: 0, HOLD: 0 };
      projectAggregation.forEach(item => { projectDashboard[item._id] = item.count });

      return res.send(responseHandler({ data: { tasks: taskDashboard, projects: projectDashboard, role: user.role } }));
    }
    else if (user.role === "employee") {

      const aggregationResult = await mongoQuery.aggregate({
        model: Task,
        pipeline: employeeDashboardPipeline(userId)
      });

      const dashboardData = { INPROGRESS: 0, COMPLETE: 0, HOLD: 0, TODO: 0, QC: 0 };
      aggregationResult.forEach(item => { dashboardData[item._id] = item.count });

      return res.send(responseHandler({ code: 200, data: { tasks: dashboardData, projects: {}, role: user.role } }));
    }
    else if (user.role === "client") {
      const aggregationResult = await mongoQuery.aggregate({
        model: Project,
        pipeline: clientDashboardPipeline(userId)
      });

      const dashboardData =  { TODO: 0, INPROGRESS: 0, TESTING: 0, DELIVERED: 0, HOLD: 0 };
      aggregationResult.forEach(item => { dashboardData[item._id] = item.count });

      return res.send(responseHandler({ code: 200, data: { tasks: {}, projects: dashboardData, role: user.role } }));

    }



    const apiResponse = { code: 400, data: {} };
    return res.send(responseHandler(apiResponse));

  } catch (error) {
    error_logger(`urn:${urn} >>>>> GET MENU ERROR ${error}`);
    return res.send(responseHandler({ code: 500, message: "Something went wrong", error: error.message }));
  }
};
