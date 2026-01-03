const User = require("../schemas/user.model");
const Project = require("../schemas/project.model");
const Task = require("../schemas/task.model");
const { responseHandler } = require("../commonUtils/responseHandler");

exports.getUsersInfoController = async (req, res) => {
    try {
        const { userId } = req.query;

        const userInfo = await User.findById(userId).select("-password").lean();

        if (!userInfo) {
            return res.send(responseHandler({ code: 404, message: "User not found" }));
        };
        const tasks = await Task.find({ assignedTo: userId }).countDocuments();
        userInfo.taskCount = tasks;
        const projects = await Project.find({ owner: userId }).countDocuments();
        userInfo.projectCount = projects;

        return res.send(responseHandler({ code: "200", data: userInfo }));

    } catch (error) {
        return res.send(responseHandler({ code: 500, message: "Something went wrong: " + error.message, }));
    }
};