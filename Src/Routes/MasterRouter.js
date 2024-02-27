const express = require('express');
const router = express.Router();

const { insertLocation, locationList, deleteLocation } = require('../Controllers/Masters/LocationController');

router.post('/insertLocation', insertLocation)
router.get('/locationList', locationList)
router.delete('/deleteLocation', deleteLocation)

module.exports = router;