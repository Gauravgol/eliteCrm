const Task = require("../schemas/task.model");
const { responseHandler } = require("../commonUtils/responseHandler");
const { info_logger, error_logger } = require("../logger/winston");

exports.createTaskController = async (req, res) => {
    const urn = req.headers.urn;
    try {
        info_logger(`urn:${urn} >>>>> CREATE TASK REQ BODY: ${JSON.stringify(req.body)}`);
        const { name, description, status, assignedTo, createdBy, projectId, dueDate, priority } = req.body;
        console.log("HIi")
        const attachments = req.files?.map((file) => ({
            url: file.path,
            public_id: file.filename,
        }));
        console.log("🚀 ~ attachments:", attachments)
        return
        const taskPayload = {name, description, createdBy, projectId, priority,attachments };
          
        if (assignedTo) {taskPayload.assignedTo = assignedTo}
        if(status){ taskPayload.status = status}
        if(dueDate){ taskPayload.dueDate = dueDate}
        await Task.create(taskPayload);

        const apiResponse = { code: "200", message: "Task created successfully" };
        return res.send(responseHandler(apiResponse));
    } catch (error) {
        error_logger(`urn:${urn} >>>>> SAVE TASK ERROR ${error}`);
        const apiResponse = { code: 500, message: "Something went wrong: " + error.message };
        return res.send(responseHandler(apiResponse));
    }
};

exports.getTasksController = async (req, res) => {
    const urn = req.headers.urn;
    try {
        info_logger(`urn:${urn} >>>>> GET TASKS REQ QUERY: ${JSON.stringify(req.query)}`);

        const { page = 1, limit = 10, search = "", status, assignedTo, createdBy, projectId } = req.query;
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);

        // -------- Build Filter Condition -------- //
        const filterCondition = {};
        filterCondition.projectId = projectId;
        if (search) { filterCondition.name = { $regex: search, $options: "i" } }
        if (status) { filterCondition.status = status }
        if (assignedTo) { filterCondition.assignedTo = assignedTo  }
        if (createdBy) { filterCondition.createdBy = createdBy }

        const totalCount = await Task.countDocuments(filterCondition);

        const tasks = await Task.find(filterCondition)
            .populate("assignedTo", "name email role")
            .populate("createdBy", "name email role")
            .populate("projectId", "name email role")
            .sort({ updatedAt: -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        const apiResponse = { code: "200", message: "Tasks fetched successfully",
            data: {
                list: tasks,
                pagination: {
                    totalRecords: totalCount,
                    currentPage: pageNumber,
                    pageSize: pageSize,
                    totalPages: Math.ceil(totalCount / pageSize)
                }
            }
        };

        return res.send(responseHandler(apiResponse));

    } catch (error) {
        error_logger(`urn:${urn} >>>>> GET TASKS ERROR ${error}`);
        const apiResponse = { code: 500, message: "Something went wrong: " + error.message };
        return res.send(responseHandler(apiResponse));
    }
};