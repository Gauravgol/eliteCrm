const jwt = require("jsonwebtoken");
const { responseHandler } = require("../commonUtils/responseHandler");

exports.verifyToken = (req, res, next) => {
    try {
        let apiResponse;

        // -------- Read Token from Header --------
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            apiResponse = { code: 401, message: "Authorization token missing" };
            return res.send(responseHandler(apiResponse));
        }

        const token = authHeader.split(" ")[1]; // Format: Bearer <token>

        if (!token) {
            apiResponse = { code: 401, message: "Invalid token format" };
            return res.send(responseHandler(apiResponse));
        }

        // -------- Verify Token --------
        jwt.verify(token, process.env.JWT_SECRET || "defaultSecret", (err, decoded) => {
            if (err) {
                apiResponse = { code: 401, message: "Invalid or expired token" };
                return res.send(responseHandler(apiResponse));
            }

            // Attach decoded user data for next middleware
            req.user = decoded;
            next();
        });

    } catch (error) {
        let apiResponse = {
            code: 500,
            message: "something went wrong: " + error.message
        };
        return res.send(responseHandler(apiResponse));
    }
};
