const jwt = require("jsonwebtoken");
const { info_logger, error_logger } = require("../logger/winston");
const { responseHandler } = require("../commonUtils/responseHandler");

exports.auth = (req, res, next) => {
    const urn = req.headers.urn;
    try {
       
        let token = req.cookies?.accessToken;
        if (!token && req.headers.authorization) {
            const parts = req.headers.authorization.split(" ");
            if (parts[0] === "Bearer" && parts[1]) {
                token = parts[1];
            }
        }

        if (!token) { 
            return res.send( responseHandler({ code: 401, message: "Authorization token missing" }));
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };

        info_logger(`urn:${urn} >>>>> AUTH SUCCESS userId:${decoded.userId}`);
        next();

    } catch (error) {
        error_logger(`urn:${urn} >>>>> AUTH FAILED ${error.message}`);
        return res.send( responseHandler({ code: 401, message: "Invalid or expired token" }));
    }
};
