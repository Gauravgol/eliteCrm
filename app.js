require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./src/routes/index');
const { connectToDb } = require('./src/db/dbConnection');

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

app.listen(port, () => {
    console.log(`<<<<<<<<< App started at port: ${port} >>>>>>>>>>>`);
});
