const verifyAdminToken = require('../../middlewares/authAdmin.middleware')
const { registerAdmin, loginAdmin, getAdmin, getAdmins } = require('./adminController')

const router = require('express').Router()

router.post('/register',verifyAdminToken,registerAdmin)
router.post('/login',loginAdmin)
router.get('/',verifyAdminToken,getAdmin)
router.get('/all',verifyAdminToken,getAdmins)

module.exports = router