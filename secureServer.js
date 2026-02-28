require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const https = require('https');
const fs = require('fs');

const router = require('./src/routes/index');
const { connectToDb } = require('./src/db/dbConnection');

const port = process.env.PORT || 5500;
const app = express();

// -------------------- Middlewares -------------------- //
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/', router);

// -------------------- DB Connection -------------------- //
connectToDb();

// -------------------- HTTPS Setup -------------------- //
const sslOptions = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.cert'),
};

https.createServer(sslOptions, app).listen(port, () => {
  console.log(`🚀 HTTPS Server running at https://localhost:${port}`);
});