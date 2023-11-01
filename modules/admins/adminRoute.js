const verifyAdminToken = require('../../middlewares/authAdmin.middleware')
const { registerAdmin, loginAdmin, getAdmin } = require('./adminController')

const router = require('express').Router()

router.post('/register',verifyAdminToken,registerAdmin)
router.post('/login',loginAdmin)
router.get('/',verifyAdminToken,getAdmin)

module.exports = router