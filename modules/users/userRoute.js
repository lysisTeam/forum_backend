const verifyAdminToken = require('../../middlewares/authAdmin.middleware')
const upload = require('../../middlewares/upload.middleware')
const { createUser, getUsers, deleteUsers } = require('./userController')

const router = require('express').Router()

router.get('/all', verifyAdminToken, getUsers)
router.post('/create-user', verifyAdminToken, upload.single('image'), createUser)
router.delete('/delete', verifyAdminToken, deleteUsers)

module.exports = router