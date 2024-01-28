const verifyAdminToken = require('../../middlewares/authAdmin.middleware')
const { registerAdmin, loginAdmin, getAdmin, getAdmins, deleteAdmins, updateAdmin } = require('./adminController')

const router = require('express').Router()

router.post('/register',verifyAdminToken,registerAdmin)
router.post('/login',loginAdmin)
router.put('/:id', verifyAdminToken, updateAdmin)
router.get('/',verifyAdminToken,getAdmin)
router.post('/',verifyAdminToken,getAdmins)
router.delete('/delete', verifyAdminToken, deleteAdmins)


module.exports = router