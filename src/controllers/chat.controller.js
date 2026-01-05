const User = require("../schemas/user.model");
const Message = require("../schemas/message.model");
const { responseHandler } = require("../commonUtils/responseHandler");

exports.getChatUser = async (req, res) => {
    try {
        const { userId, search = "" } = req.query;

        const user = await User.findById(userId).lean();
        if (!user) { return res.send(responseHandler({ code: 404, message: "User not found" })) };
        if (user.role === "employee") { return res.send(responseHandler({ code: "200", message: "No chat users for employee", data: [] })) };
        let filterCondition = { _id: { $ne: userId } };
        if (user.role === "client") { filterCondition.role = { $in: ["admin", "superAdmin"] } };
        if (["admin", "superAdmin"].includes(user.role)) { filterCondition.role = { $in: ["client", "admin", "superAdmin"] } };
        if (search) {
            filterCondition.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const users = await User.find(filterCondition).select("_id name role").limit(10).lean();

        return res.send(responseHandler({ code: "200", data: users }));
    } catch (error) {
        return res.send(responseHandler({ code: 500, message: "Something went wrong: " + error.message }));
    }
};

exports.getChatMessages = async (req, res) => {
  try {
    const { userId, otherUserId } = req.query;

    const roomId = [userId, otherUserId].sort().join("_");

    const messages = await Message.find({ roomId }).sort({ createdAt: -1 }).lean();

    return res.send( responseHandler({ code: "200", data: messages }));
  } catch (error) {
    return res.send( responseHandler({ code: 500, message: "Something went wrong: " + error.message }));
  }
};

