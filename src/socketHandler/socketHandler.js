const Message = require("../schemas/message.model");
const { info_logger, error_logger } = require("../logger/winston");


module.exports = (io) => {
    io.on("connection", (socket) => {
        info_logger(`<<<<<<<<SOCKET CONNECTED: ${socket.id}`);
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
            } catch (error) {
                error_logger(`<<<<<<<<<<SOCKET:SOMETHING WENT WRONG ", ${error.message}`);
            }
        });

        socket.on("disconnect", () => {
            info_logger(`<<<<<<<<SOCKET DISCONNECTED: ${socket.id}`);
        });
    });
};
