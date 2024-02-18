const express = require('express')
const { verifyUser } = require('../Middlewares/AuthMiddleWare')
const router = express.Router()
const AuthRouter = require('./AuthRouter')
const APIRouter = require('./Api')
const UserRouter = require('./UserRouter')

router.use('/auth', AuthRouter)
router.use('/api', verifyUser, APIRouter)
router.use('/user', verifyUser, UserRouter)

module.exports = router