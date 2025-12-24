const express = require('express');
const { registerUserController } = require('../controllers/registerUser.controller');
const validateRequest = require('../middleware/validateRequest');
const { loginUserController } = require('../controllers/login.controller');
const { createProjectController, getProjectsController, updateProjectController } = require('../controllers/project.contoller');
const { createTaskController, getTasksController, updateTaskController } = require('../controllers/task.controller');
const upload = require("../middleware/upload");
const router = express.Router();
 
router.use(validateRequest());

router.get('/heathCheck', (req, res) => {
    res.send('Elite is up for your service');
});

router.post("/registerUser", registerUserController);
router.post("/login", loginUserController);
router.post("/createProject",upload.array("attachments", 5), createProjectController);
router.get("/getProjects", getProjectsController);
router.put("/updateProject", upload.array("attachments",5), updateProjectController)
router.post("/createTask", upload.array("attachments", 5), createTaskController);
router.get("/getTask", getTasksController);
router.put("/updateTask", upload.array("attachments", 5), updateTaskController)
 



 

module.exports = router;
