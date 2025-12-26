const Project = require("../schemas/project.model");
const User = require("../schemas/user.model")
const { responseHandler } = require("../commonUtils/responseHandler");
const { info_logger, error_logger } = require("../logger/winston");

exports.createProjectController = async (req, res) => {
    const urn = req.headers.urn;

    try {
        info_logger(`urn:${urn} >>>>> CREATE PROJECT REQ BODY: ${JSON.stringify(req.body)}`);

        const { name, description, owner, status, startDate, dueDate } = req.body;
        const attachments = (req.files || []).map((file) => ({
            url: file.location,        // S3 public URL
            public_id: file.key,       // S3 object key
        }));

        let projectPayload = { name, description, owner, status, startDate, dueDate, attachments };

        // -------- Create Project -------- //
        const project = await Project.create(projectPayload);

        info_logger(`urn:${urn} >>>>> PROJECT CREATED: ${project._id}`);

        const apiResponse = { code: "200", message: "Project created successfully", data: project };

        return res.send(responseHandler(apiResponse));

    } catch (error) {
        error_logger(`urn:${urn} >>>>> SAVE PROJECT ERROR ${error}`);

        const apiResponse = { code: 500, message: "Something went wrong: " + error.message };
        return res.send(responseHandler(apiResponse));
    }
};

exports.getProjectsController = async (req, res) => {
    const urn = req.headers.urn;

    try {
        info_logger(`urn:${urn} >>>>> GET PROJECTS REQ QUERY: ${JSON.stringify(req.query)}`);

        const { page = 1, limit = 10, search = "", projectId } = req.query;

        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);

        const searchCondition = search ? { name: { $regex: search, $options: "i" } } : {};
        if (projectId) { searchCondition._id = projectId };

        const totalCount = await Project.countDocuments(searchCondition);

        // -------- Fetch Projects -------- //
        const projects = await Project.find(searchCondition).populate("owner", "name email").sort({ updatedAt: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize);

        const apiResponse = {
            code: "200",
            message: "Projects fetched successfully",
            data: {
                list: projects,
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
        error_logger(`urn:${urn} >>>>> GET PROJECTS ERROR ${error}`);
        const apiResponse = { code: 500, message: "Something went wrong: " + error.message };
        return res.send(responseHandler(apiResponse));
    }
};

exports.updateProjectController = async (req, res) => {
    const urn = req.headers.urn;

    try {
        info_logger(`urn:${urn} >>>>> UPDATE PROJECT REQ BODY: ${JSON.stringify(req.body)}`);

        const { projectId, userId, name, description, status, startDate, dueDate, comment, commenterId, commenterName  } = req.body;

        const user = await User.findById(userId).select("role name email");

        if (!user) {
            return res.send(responseHandler({ code: 404, message: "User not found" }));
        };

        if (!["superAdmin", "admin"].includes(user.role)) {
            return res.send(responseHandler({ code: 403, message: "You are not authorized to update this project" }));
        }

        // -------- Fetch Project -------- //
        const project = await Project.findById(projectId);
        if (!project) {
            return res.send(responseHandler({ code: 404, message: "Project not found" }));
        }

        // -------- Attachments (Optional) -------- //
        let attachments = [];
        if (req.files && req.files.length > 0) {
            attachments = req.files.map((file) => ({
                url: file.location,
                public_id: file.key,
            }));
        }

        // -------- Build Update Payload (ONLY RECEIVED FIELDS) -------- //
        const updatePayload = {};
        if (name) { updatePayload.name = req.body.name };
        if (description) {  updatePayload.description = req.body.description };
        if (status) { updatePayload.status = req.body.status };
        if (startDate) { updatePayload.startDate = req.body.startDate };
        if (dueDate) { updatePayload.dueDate = req.body.dueDate };
        if (attachments.length > 0 ) {
            updatePayload.$push = { attachments: { $each: attachments } };
        }
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

        // -------- Update Project -------- //
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            updatePayload,
            { new: true }
        ).populate("owner", "name email");

        info_logger(
            `urn:${urn} >>>>> PROJECT UPDATED BY ${user._id}`
        );

        const apiResponse = {
            code: "200",
            message: "Project updated successfully",
            data: updatedProject,
        };

        return res.send(responseHandler(apiResponse));
    } catch (error) {
        error_logger(
            `urn:${urn} >>>>> UPDATE PROJECT ERROR ${error}`
        );

        return res.send(
            responseHandler({
                code: 500,
                message: "Something went wrong: " + error.message,
            })
        );
    }
};
