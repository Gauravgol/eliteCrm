const express = require('express');
const { registerUserController } = require('../controllers/registerUser.controller');
const validateRequest = require('../middleware/validateRequest');
const { loginUserController } = require('../controllers/login.controller');
const { createProjectController, getProjectsController } = require('../controllers/project.contoller');
const { createTaskController, getTasksController } = require('../controllers/task.controller');
const upload = require("../middleware/upload");
const uploadWrapper = require('../middleware/uploadWrapper');
const router = express.Router();
 
router.use(validateRequest());

router.get('/heathCheck', (req, res) => {
    res.send('Elite is up for your service');
});

router.post("/registerUser", registerUserController);
router.post("/login", loginUserController);
router.post("/createProject", createProjectController);
router.get("/getProjects", getProjectsController);
router.post("/createTask", uploadWrapper, createTaskController);
router.get("/getTask", getTasksController)



 

module.exports = router;
