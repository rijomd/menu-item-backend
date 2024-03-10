const express = require('express');
const router = express.Router();

const { deCryptQuery } = require('../Middlewares/AuthMiddleWare');
const upload = require('../Middlewares/MulterUpload');

const { insertLocation, locationList, deleteLocation, locationCompo } = require('../Controllers/Masters/LocationController');
const { insertCategory, categoryList, categoryCompo } = require('../Controllers/Masters/CategoryController');
const { insertItem, ItemList } = require('../Controllers/Masters/ItemController');

router.post('/insertLocation', insertLocation)
router.get('/locationList', locationList)
router.delete('/deleteLocation', deleteLocation)
router.get('/locationCompo', locationCompo)

router.post('/insertCategory', upload.single('file'), deCryptQuery, insertCategory)
router.get('/categoryList', categoryList)
router.get('/categoryCompo', categoryCompo)

router.post('/insertItem', upload.single('file'), deCryptQuery, insertItem)
router.get('/itemList', ItemList)

module.exports = router;