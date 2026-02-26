// controllers/upload.controller.js
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { responseHandler } = require("../commonUtils/responseHandler");
const { info_logger, error_logger } = require("../logger/winston");


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.generateUploadUrl = async (req, res) => {
    let urn = req.headers.urn;
  try {
    const { fileName, fileType } = req.body;
    info_logger(`urn:${urn}<<<<<<<<<<< GENERATE UPLOAD URL >>>>>>>>REQ BODY:${JSON.stringify(req.body)}`)

    const key = `tasks/${Date.now()}_${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 8, // 8 minutes
    });

    return res.send(responseHandler({ code: "200", data: {
        uploadUrl,
        key,
        fileUrl: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`,
      } }));
  } catch (error) {
    error_logger(`urn:${urn}<<<<<<<<< GENERATE UPLOAD URL >>>>>>> CATCH BLOCK:${(error)}`)  
    return res.send(responseHandler({ code: 500, message: "Something went wrong: " + error.message, }));
  }
};