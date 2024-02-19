const verifyAdminToken = require('../../middlewares/authAdmin.middleware')
const { getMessages, sendMessage, updateMessage } = require('./messageController')

const router = require('express').Router()

router.get('/:idRoom/admin', verifyAdminToken, getMessages)
router.put('/:idMessage/admin', verifyAdminToken, updateMessage)
router.post('/send-message/:idRoom/admin', verifyAdminToken, sendMessage)

module.exports = router