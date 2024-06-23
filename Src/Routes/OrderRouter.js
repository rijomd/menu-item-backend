const express = require('express');
const router = express.Router();

const { deCryptQuery } = require('../Middlewares/AuthMiddleWare');
const { orderList, insertOrder, closeOrder } = require('../Controllers/Transaction/OrderController');
const upload = require('../Middlewares/MulterUpload');

router.get('/orderList', orderList)
router.post('/insertOrder', deCryptQuery, insertOrder)
router.post('/closeOrder', upload.single('file'), deCryptQuery, closeOrder)

module.exports = router 
