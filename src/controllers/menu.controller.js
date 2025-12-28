const User = require("../schemas/user.model");
const Menu = require("../schemas/menu.model");
const { responseHandler } = require("../commonUtils/responseHandler");
const { info_logger, error_logger } = require("../logger/winston");

exports.getMenuController = async (req, res) => {
  const urn = req.headers.urn;

  try {
    info_logger(`urn:${urn} >>>>> GET MENU API HIT`);

    const { userId } = req.query;

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.send( responseHandler({ code: 404, message: "User not found" }));
    }

    const menu = await Menu.findOne({ role: user.role }).lean();
    if (!menu) {
        return res.send(responseHandler({code: 404,message: "Menu not found for this role"}));
    }
    const apiResponse = { code: 200, message: "Menu fetched successfully", data: menu };
    return res.send(responseHandler(apiResponse));

  } catch (error) {
    error_logger(`urn:${urn} >>>>> GET MENU ERROR ${error}`);
    return res.send( responseHandler({ code: 500, message: "Something went wrong", error: error.message }));
  }
};
