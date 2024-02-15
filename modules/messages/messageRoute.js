const verifyAdminToken = require('../../middlewares/authAdmin.middleware')
const { getMessages, sendMessage } = require('./messageController')

const router = require('express').Router()

router.get('/:idRoom/admin', verifyAdminToken, getMessages)
router.post('/send-message/:idRoom/admin', verifyAdminToken, sendMessage)

module.exports = router