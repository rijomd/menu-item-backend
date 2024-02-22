const express = require('express');
const router = express.Router();

const { insertUser, userList, deleteUser } = require('../Controllers/User/UserController');

router.post('/insertUser', insertUser)
router.get('/userList', userList)
router.delete('/deleteUser', deleteUser)

module.exports = router 