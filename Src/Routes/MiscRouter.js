const express = require('express');
const router = express.Router();

const { deCryptQuery } = require('../Middlewares/AuthMiddleWare');
const { insertMisc, MiscList } = require('../Controllers/Miscs/MiscController');

router.post('/insertSettings', deCryptQuery, insertMisc)
router.get('/settingList', MiscList)

module.exports = router;