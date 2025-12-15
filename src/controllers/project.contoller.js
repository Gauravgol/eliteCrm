const Project = require("../schemas/project.model");
const { responseHandler } = require("../commonUtils/responseHandler");
const { info_logger, error_logger } = require("../logger/winston");

exports.createProjectController = async (req, res) => {
    const urn = req.headers.urn;

    try {
        info_logger(`urn:${urn} >>>>> CREATE PROJECT REQ BODY: ${JSON.stringify(req.body)}`);

        const { name, description, owner, status, startDate, endDate } = req.body;

        // -------- Create Project -------- //
        const project = await Project.create({ name, description, owner, status, startDate, endDate });

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

        const { page = 1, limit = 10, search = "" } = req.query;

        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);

        // -------- Search Condition -------- //
        const searchCondition = search
            ? { name: { $regex: search, $options: "i" } }
            : {};

        // -------- Total Count -------- //
        const totalCount = await Project.countDocuments(searchCondition);

        // -------- Fetch Projects -------- //
        const projects = await Project.find(searchCondition)
            .sort({ updatedAt: -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        info_logger(`urn:${urn} >>>>> PROJECTS FETCHED COUNT: ${projects.length}`);

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
