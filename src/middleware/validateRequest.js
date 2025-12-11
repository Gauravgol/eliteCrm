const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true, removeAdditional: true });
const addFormats = require("ajv-formats");
const ajvErrors = require("ajv-errors");
const { responseHandler } = require("../commonUtils/responseHandler")


ajvErrors(ajv)
addFormats(ajv);

/**
 * Automatic request validator based on route last segment + method
 */
const validateRequest = () => {
    return (req, res, next) => {
        try {


            const routeSegments = req.path.split("/").filter(Boolean);
            const lastSegment = routeSegments[routeSegments.length - 1];


            // Build schema file path
            const schemaPath = path.join(
                __dirname,
                "../ajvSchemas",
                lastSegment,
                `${req.method.toUpperCase()}.json`
            );

            // Check if schema exists
            if (!fs.existsSync(schemaPath)) {
                return next(); // No schema → skip validation
            }

            const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
            const validate = ajv.compile(schema);
            const valid = validate(req.body);

            if (!valid) {
                const errors = validate.errors.map(err => err.message).join(", ");

                let apiResponse = { code: 400, message: `${errors}` };
                return res.send(responseHandler(apiResponse))
            }

            next();
        } catch (error) {
            let apiResponse = { code: "500", message: "something went wrong" + error.message };
            res.send(responseHandler(apiResponse));
        }
    };
};

module.exports = validateRequest;
