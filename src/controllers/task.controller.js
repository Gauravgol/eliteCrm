const Task = require("../schemas/task.model");
const { responseHandler } = require("../commonUtils/responseHandler");
const { info_logger, error_logger } = require("../logger/winston");

exports.createTaskController = async (req, res) => {
    const urn = req.headers.urn;
    try {
        info_logger(`urn:${urn} >>>>> CREATE TASK REQ BODY: ${JSON.stringify(req.body)}`);
        const { name, description, status, assignedTo, createdBy, projectId, dueDate, priority } = req.body;
        const attachments = (req.files || []).map((file) => ({
            url: file.location,        // S3 public URL
            public_id: file.key,       // S3 object key
          }));
    
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

        const { page = 1, limit = 10, search = "", status, assignedTo, createdBy, projectId, taskId } = req.query;
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);

        // -------- Build Filter Condition -------- //
        const filterCondition = {};
       
        if (projectId) { filterCondition.projectId = projectId };
        if (taskId) { filterCondition._id  = taskId };
        if (search) { filterCondition.name = { $regex: search, $options: "i" } };
        if (status) { filterCondition.status = status };
        if (assignedTo) { filterCondition.assignedTo = assignedTo  };
        if (createdBy) { filterCondition.createdBy = createdBy };

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

exports.updateTaskController = async (req, res) => {
    const urn = req.headers.urn;
  
    try {
      info_logger(
        `urn:${urn} >>>>> UPDATE TASK REQ BODY: ${JSON.stringify(req.body)}`
      );
  
      const { taskId, name, description, status, priority, assignedTo, dueDate, comment, commenterId, commenterName } = req.body;
      const updatePayload = {};
  
      if (name) updatePayload.name = name;
      if (description) updatePayload.description = description;
      if (status) updatePayload.status = status;
      if (priority) updatePayload.priority = priority;
      if (assignedTo) updatePayload.assignedTo = assignedTo;
      if (dueDate) updatePayload.dueDate = dueDate;
  
      /* ---------------- ATTACHMENTS ---------------- */
      if (req.files && req.files.length > 0) {
        const newAttachments = req.files.map((file) => ({
          url: file.location,
          public_id: file.key,
        }));
  
        updatePayload.$push = {
          attachments: { $each: newAttachments },
        };
      }
  
      /* ---------------- COMMENTS ---------------- */
  
      if (comment && commenterId && commenterName) {
        updatePayload.$push = {
          ...(updatePayload.$push || {}),
          comments: {
            comment,
            commenterId,
            commenterName,
          },
        };
      }
  
      /* ---------------- UPDATE TASK ---------------- */
  
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        updatePayload,
        { new: true }
      )
        .populate("assignedTo", "name email role")
        .populate("createdBy", "name email role")
        .populate("projectId", "name");
  
      if (!updatedTask) {
        return res.send(
          responseHandler({ code: 404, message: "Task not found" })
        );
      }
  
      const apiResponse = { code: "200",  message: "Task updated successfully", apiResponseData: updatedTask };
  
      return res.send(responseHandler(apiResponse));
    } catch (error) {
      error_logger(`urn:${urn} >>>>> UPDATE TASK ERROR ${error}`);
      return res.send( responseHandler({ code: 500, message: "Something went wrong: " + error.message }));
    }
  };
  