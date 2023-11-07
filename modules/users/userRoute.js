const verifyAdminToken = require('../../middlewares/authAdmin.middleware')
const { createUser } = require('./userController')

const router = require('express').Router()

router.post('/create-user', verifyAdminToken, createUser)

module.exports = router