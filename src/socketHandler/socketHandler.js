const Message = require("../schemas/message.model");
const { info_logger, error_logger } = require("../logger/winston");

let ioInstance;
const onlineUsers = new Map();


module.exports = (io) => {
    ioInstance = io;
    io.on("connection", (socket) => {
        info_logger(`<<<<<<<<SOCKET CONNECTED: ${socket.id}`);

        //SET ONLINE USER
        socket.on("online_user", ({ userId }) => {
            onlineUsers.set(userId, socket.id);
            console.log("🚀 ~ onlineUsers:", onlineUsers)
        })
        socket.on("join_room", ({ roomId }) => {
            console.log(`${socket.id}: has joined the room`)
            socket.join(roomId);
        });

        socket.on("send_message", async (payload) => {
            try {

                const savedMessage = await Message.create({
                    senderId: payload.senderId,
                    receiverId: payload.receiverId,
                    roomId: payload.roomId,
                    message: payload.message,
                });

                io.to(payload.roomId).emit("receive_message", savedMessage);
                module.exports.emitNotificationToUser(payload.receiverId, {
                    type: "NEW_MESSAGE",
                    text: payload.message,
                });
            } catch (error) {
                error_logger(`<<<<<<<<<<SOCKET:SOMETHING WENT WRONG ", ${error.message}`);
            }
        });

        socket.on("disconnect", () => {
            info_logger(`<<<<<<<<SOCKET DISCONNECTED: ${socket.id}`);
            // remove disconnected user
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
        });
    });
};

module.exports.emitNotificationToUser = (userId, notification) => {
    if (!ioInstance) return;

    const socketId = onlineUsers.get(userId);
    if (!socketId) return; // user offline

    ioInstance.to(socketId).emit("notification_received", {
        type: "Notification",
        notification,
        createdAt: new Date(),
    });
};