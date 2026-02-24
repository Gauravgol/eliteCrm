require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./src/routes/index');
const { connectToDb } = require('./src/db/dbConnection');
const { connectRabbitMQ } = require("./src/rabbitMq/connection");
const { sendEmail } = require('./src/service/email.service');

const port = process.env.PORT || 5500;
const app = express();

// -------------------- Middlewares -------------------- //


// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/', router)
// ------------------------------------------------------ //

//-------------DB Connection-----------------------------//
connectToDb()
// connectRabbitMQ()


app.listen(port, () => {
    console.log(`<<<<<<<<< App started at port: ${port} >>>>>>>>>>>`);
});
// sendEmail({
//     type: "PROJECT_ASSIGNED",
//     to: "gauravgol34@gmail.com",
//     data: {
//       projectName: "Test Project",
//       assignedBy: "Admin",
//     },
//   })
//   .then(() => console.log("Email sent"))
//   .catch(console.error);