const express = require('express');

const { doLogin, doSignup, doActivateAdmin } = require('../Controllers/User/AuthController');
const { validate } = require('../Middlewares/Validate');
const { login, signup } = require('../Validations/AuthValidation');

const router = express.Router();
router.post('/signup', validate(signup), doSignup);
router.post('/login', validate(login), doLogin);
router.get('/activate', doActivateAdmin);


module.exports = router;