const express = require('express');
const { registerUserController } = require('../controllers/registerUser.controller');
const validateRequest = require('../middleware/validateRequest');
const router = express.Router();
 
router.use(validateRequest());

router.get('/heathCheck', (req, res) => {
    res.send('Elite is up for your service');
});

router.post("/registerUser", registerUserController)

 

module.exports = router;
