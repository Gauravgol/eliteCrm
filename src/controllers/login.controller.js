const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../schemas/user.model");
const { responseHandler } = require("../commonUtils/responseHandler");
const { info_logger, error_logger } = require("../logger/winston");

exports.loginUserController = async (req, res) => {
    let urn = req.headers.urn;
    try {
        info_logger(`urn:${urn}>>>>>>>>REQ BODY:${JSON.stringify(req.body)}`)
        const { email, password } = req.body;
        let apiResponse;

        const user = await User.findOne({ email });
        if (!user) {
            info_logger(`urn:${urn}>>>>>>>>USER NOT FOUND:${JSON.stringify(user)}`)
            apiResponse = { code: 404, message: "User not found" };
            return res.send(responseHandler(apiResponse));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            info_logger(`urn:${urn}>>>>>>>>PASSWORD NOT MATCHED:${JSON.stringify(isMatch)}`)
            apiResponse = { code: 401, message: "Incorrect password" };
            return res.send(responseHandler(apiResponse));
        }
        
        // const token = jwt.sign(
        //     { userId: user._id, email: user.email, role: user.role },
        //     process.env.JWT_SECRET,
        //     { expiresIn: "7d" }
        // );

        // Access Token (short-lived)
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Refresh Token (long-lived)
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        // Set cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 15 * 60 * 1000, // 15 min
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        apiResponse = { code: 200, message: "Login successful", data: { user: { id: user._id, name: user.name, email: user.email, role: user.role } } };

        return res.send(responseHandler(apiResponse));
    } catch (error) {
        (`urn:${urn}>>>>>>>SOMETHING WENT WRONG:${(error_logger)}`)
        let apiResponse = { code: 500, message: "something went wrong: " + error.message };
        return res.send(responseHandler(apiResponse));
    }
};
