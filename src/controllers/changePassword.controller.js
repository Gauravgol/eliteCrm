const User = require("../schemas/user.model");
const Project = require("../schemas/project.model");
const Task = require("../schemas/task.model");
const { responseHandler } = require("../commonUtils/responseHandler");
const mongoQuery = require("../db/mongoQuery");
const bcrypt = require("bcryptjs");
const { info_logger, error_logger } = require("../logger/winston");


exports.changePasswordController = async (req, res) => {
    let urn = req.headers.urn
    try {
        info_logger(`urn:${urn} >>>>> CHANGE PASSWORD REQ BODY: ${JSON.stringify(req.body)}`);
        const { userId, password } = req.body;
        const userInfo = await mongoQuery.findOne({model:User}, {_id: userId},{ role:1 })
        if (!userInfo) {
            return res.send(responseHandler({ code: 404, message: "User not found" }));
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await mongoQuery.updateOne({model:User}, {_id: userId},{password: hashedPassword});
        return res.send(responseHandler({ code: "200", message:"Password changed" }));

    } catch (error) {
        error_logger(`urn:${urn} >>>>>CHANGE PASSWORD ERROR ${error}`);
        return res.send(responseHandler({ code: 500, message: "Something went wrong: " + error.message, }));
    }
};