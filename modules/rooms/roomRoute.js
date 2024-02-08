const verifyAdminToken = require('../../middlewares/authAdmin.middleware')
const verifyUserToken = require('../../middlewares/authUser.middleware')
const { addRoom, getRooms, addOrRemoveUserToRoom } = require('./roomController')

const router = require('express').Router()

router.post('/admin', verifyAdminToken, addRoom) // ajouter d'autres routes pour l'utilisateur
router.get('/admin', verifyAdminToken, getRooms)
router.patch('/add-user-to-room/:id_room/admin', verifyAdminToken, addOrRemoveUserToRoom)


router.post('/user', verifyUserToken, addRoom) // ajouter d'autres routes pour l'utilisateur
router.get('/user', verifyUserToken, getRooms)
router.patch('/add-user-to-room/:id_room/user', verifyUserToken, addOrRemoveUserToRoom)

module.exports = router