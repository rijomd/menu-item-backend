const express = require('express');
const router = express.Router();

const { deCryptQuery } = require('../Middlewares/AuthMiddleWare');
const { orderList, insertOrder } = require('../Controllers/Transaction/OrderController');

router.get('/orderList', deCryptQuery, orderList)
router.post('/insertOrder', deCryptQuery, insertOrder)

module.exports = router 
