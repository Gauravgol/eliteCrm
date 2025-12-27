const User = require("../schemas/user.model");
const bcrypt = require("bcryptjs");
const { responseHandler } = require("../commonUtils/responseHandler")

exports.registerUserController = async (req, res) => {
    try {
        const { name, password, role, email, phone, city, state, pincode, country, creatorId } = req.body;
        let apiResponse;

        const creator = await User.findById(creatorId).select("role name email");

        if (!creator) {
            return res.send(responseHandler({ code: 404, message: "creator not found" }));
        };

        if (creator.role !== "superAdmin") {
            return res.send(responseHandler({ code: 403, message: "Not authorize to create a user" }));
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            apiResponse = { code: "409", message: "User already exists" };
            return res.send(responseHandler(apiResponse));
        }
        let profilePic = "";
        if (req.files && req.files.length > 0) {
            profilePic = req.files[0].location;
          }
     
        const hashedPassword = await bcrypt.hash(password, 10);
        let payload = { name, password: hashedPassword, role, email, phone, address: { city, state, pincode, country } };
        if (profilePic) {
            payload.profilePic = profilePic;
        }
        await User.create(payload);

        apiResponse = { code: "200", message: "User registered successfully!" };

        return res.send(responseHandler(apiResponse ));
    } catch (error) {
        console.log("🚀 ~ error:", error.message)
        let apiResponse = { code: "500", message: "something went wrong" + error.message };
        res.send(responseHandler(apiResponse));
    }
}

exports.getUsersController = async (req, res) => {
    try {
      const { userId, page = 1, limit = 10, search = "", role } = req.query;
  
      const pageNumber = parseInt(page);
      const pageSize = parseInt(limit);
  
      const superAdmin = await User.findById(userId).select("role name email");
  
      if (!superAdmin) { 
        return res.send(responseHandler({ code: 404, message: "User not found" }));
      }
  
      if (superAdmin.role !== "superAdmin") {
        return res.send( responseHandler({ code: 403, message: "You are not authorized to view users" }));
      }
  
      const filterCondition = {};
  
      if (search) {
        filterCondition.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ];
      }
  
      if (role) {
        filterCondition.role = role;
      }
      const totalCount = await User.countDocuments(filterCondition);
  
      const users = await User.find(filterCondition)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);
      return res.send( responseHandler({ code: "200", message: "Users fetched successfully", data: { list: users, pagination: {
              totalRecords: totalCount,
              currentPage: pageNumber,
              pageSize: pageSize,
              totalPages: Math.ceil(totalCount / pageSize),
            },
          },
        })
      );
    } catch (error) {
      return res.send( responseHandler({ code: 500, message: "Something went wrong: " + error.message,}));
    }
  };