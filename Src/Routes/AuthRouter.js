const express = require('express');
const { doLogin, doSignup, doActivateAdmin } = require('../Controllers/User/AuthController');

const router = express.Router();
router.post('/signup', doSignup);
router.post('/login', doLogin);
router.get('/activate', doActivateAdmin);

module.exports = router;