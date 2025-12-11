const User = require("../schemas/user.model");
const bcrypt = require("bcryptjs");
const { responseHandler } = require("../commonUtils/responseHandler")

exports.registerUserController = async (req, res) => {
    try {
        const { name, password, role, email, phone, city, state, pincode, country } = req.body;
        let apiResponse;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            apiResponse = { code: "409", message: "User already exists" };
            return res.send(responseHandler(apiResponse));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create( { name, password: hashedPassword, role, email, phone, address: { city, state, pincode, country } } );

        apiResponse = { code: "200", message: "User registered successfully!" };

        return res.send(responseHandler({apiResponse }));
    } catch (error) {
        let apiResponse = { code: "500", message: "something went wrong" + error.message };
        res.send(responseHandler(apiResponse));
    }
}