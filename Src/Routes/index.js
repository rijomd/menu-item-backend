const express = require('express');
const { verifyUser } = require('../Middlewares/AuthMiddleWare');
const router = express.Router();

const AuthRouter = require('./AuthRouter');
const APIRouter = require('./Api');
const UserRouter = require('./UserRouter');
const MasterRouter = require('./MasterRouter');
const MiscRouter = require('./MiscRouter')

router.use('/auth', AuthRouter)
router.use('/api', verifyUser, APIRouter)
router.use('/user', verifyUser, UserRouter)
router.use('/masters', verifyUser, MasterRouter)
router.use('/misc', verifyUser, MiscRouter)

module.exports = router