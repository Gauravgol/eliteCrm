require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const { connectToDb } = require('./src/db/dbConnection');

const socketHandler = require("./src/socketHandler/socketHandler");

const port = process.env.SOCKETPORT || 5600;

const server = http.createServer();

const io = new Server(server, { cors: { origin: "*" }});
 
socketHandler(io);
//-------------DB Connection-----------------------------//
connectToDb()

server.listen(port, () => {
  console.log(`Socket server running on port ${port}`);
});
