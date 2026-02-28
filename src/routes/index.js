const express = require('express');
const { registerUserController, getUsersController, getUsersForTagController, getClientForTagController } = require('../controllers/registerUser.controller');
const validateRequest = require('../middleware/validateRequest');
const { loginUserController } = require('../controllers/login.controller');
const { createProjectController, getProjectsController, updateProjectController } = require('../controllers/project.contoller');
const { createTaskController, getTasksController, updateTaskController } = require('../controllers/task.controller');
const upload = require("../middleware/upload");
const { getMenuController } = require('../controllers/menu.controller');
const { getUsersInfoController } = require('../controllers/userInfo.controller');
const { getChatUser, getChatMessages } = require('../controllers/chat.controller');
const { dashboardController } = require('../controllers/dashboard.controller');
const { getNotificationsController, markNotificationsAsReadController } = require('../controllers/notification.controller');
const { auth } = require('../middleware/auth');
const { generateUploadUrl } = require('../controllers/upload.controller');
const { sendMail } = require('../controllers/sendMail.controller');
const router = express.Router();
 
router.use(validateRequest());

router.get('/heathCheck', (req, res) => {
    res.send('Elite is up for your service');
});

router.post("/registerUser", upload.array("profilePic",1), registerUserController);
router.get("/getUsers", getUsersController);
router.get("/tagUser", getUsersForTagController);
router.get("/tagClient", getClientForTagController);
router.post("/login", loginUserController);
// router.post("/createProject",upload.array("attachments", 5), createProjectController);
router.post("/createProject",createProjectController);
router.get("/getProjects", getProjectsController);
router.put("/updateProject", upload.array("attachments",5), updateProjectController)
router.post("/createTask", upload.array("attachments", 5), createTaskController);
router.get("/getTask", getTasksController);
router.put("/updateTask", upload.array("attachments", 5), updateTaskController);
router.get("/getMenu", getMenuController);
router.get("/getUserInfo", getUsersInfoController);
router.get("/getChatUsers", getChatUser);
router.get("/getChatMessages", getChatMessages);
router.get("/getDashboardData", dashboardController);
router.get("/getNotification", getNotificationsController);
router.post("/markNotification", markNotificationsAsReadController)
router.post("/generateUploadUrl", generateUploadUrl);
router.post("/sendMail", sendMail);



 

module.exports = router;
