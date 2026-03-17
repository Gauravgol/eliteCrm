const User = require("../schemas/user.model");
const { responseHandler } = require("../commonUtils/responseHandler");
const bcrypt = require("bcryptjs");
const { info_logger, error_logger } = require("../logger/winston");
const { ObjectId } = require("mongodb");

exports.changePasswordController = async (req, res) => {
    let urn = req.headers.urn
    try {
        info_logger(`urn:${urn} >>>>> CHANGE PASSWORD REQ BODY: ${JSON.stringify(req.body)}`);
        const { userId, password } = req.body;
        const userInfo = await User.findOne({ _id: new ObjectId(userId) }, { role: 1 });
        if (!userInfo) {
            return res.send(responseHandler({ code: 404, message: "User not found" }));
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.updateOne({ _id: new ObjectId(userId) }, { $set: { password: hashedPassword } });
        return res.send(responseHandler({ code: "200", message: "Password changed" }));

    } catch (error) {
        error_logger(`urn:${urn} >>>>>CHANGE PASSWORD ERROR ${error}`);
        return res.send(responseHandler({ code: 500, message: "Something went wrong: " + error.message, }));
    }
};