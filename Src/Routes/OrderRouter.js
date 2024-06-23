const express = require('express');
const router = express.Router();

const { deCryptQuery } = require('../Middlewares/AuthMiddleWare');
const upload = require('../Middlewares/MulterUpload');

const { orderList, insertOrder, closeOrder } = require('../Controllers/Transaction/OrderController');
const { billList } = require('../Controllers/Transaction/BillController');

router.get('/orderList', orderList)
router.post('/insertOrder', deCryptQuery, insertOrder)
router.post('/closeOrder', upload.single('file'), deCryptQuery, closeOrder)
router.get('/billList', billList)

module.exports = router 
