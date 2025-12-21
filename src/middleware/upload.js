const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../commonUtils/s3");

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: (req, file, cb) => {
      const fileName = `tasks/${Date.now()}_${file.originalname}`;
      cb(null, fileName);
    },
  }),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file
  },
});

module.exports = upload;


// const upload = multer({
//   storage: multerS3({
//     s3,
//     bucket: process.env.AWS_S3_BUCKET,
   
//     key: function (req, file, cb) {
//       const fileName = `task_attachments/${Date.now()}_${file.originalname}`;
//       cb(null, fileName);
//     },
//   }),
// });

// module.exports = upload;
