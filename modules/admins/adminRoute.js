const verifyAdminToken = require('../../middlewares/authAdmin.middleware')
const { registerAdmin, loginAdmin, getAdmin, getAdmins, deleteAdmins } = require('./adminController')

const router = require('express').Router()

router.post('/register',verifyAdminToken,registerAdmin)
router.post('/login',loginAdmin)
router.get('/',verifyAdminToken,getAdmin)
router.get('/all',verifyAdminToken,getAdmins)
router.delete('/delete', verifyAdminToken, deleteAdmins)


module.exports = router