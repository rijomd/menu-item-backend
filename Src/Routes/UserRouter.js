const express = require('express');
const router = express.Router();

const { insertUser, friendList, deleteUser } = require('../Controllers/User/UserController');

router.post('/insertUser', insertUser)
router.get('/friendList', friendList)
router.delete('/deleteUser', deleteUser)

module.exports = router 