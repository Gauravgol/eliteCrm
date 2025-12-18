const upload = require("./upload");
const { error_logger } = require("../logger/winston");

module.exports = (req, res, next) => {
  upload.array("attachments", 5)(req, res, function (err) {
    if (err) {
    error_logger(`MULTER ERROR  ${err}`);
      return res.status(400).json({
        code: 400,
        message: err.message,
      });
    }
    next();
  });
};