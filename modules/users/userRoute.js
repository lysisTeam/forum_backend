const verifyAdminToken = require('../../middlewares/authAdmin.middleware')
const upload = require('../../middlewares/upload.middleware')
const { createUser, getUsers } = require('./userController')

const router = require('express').Router()

router.get('/all', verifyAdminToken, getUsers)
router.post('/create-user', verifyAdminToken, upload.single('image'), createUser)

module.exports = router