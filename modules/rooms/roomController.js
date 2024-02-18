const { addMessage } = require("../messages/messageController");
const { modifyRoom } = require("./roomFunc");
const roomModel = require("./roomModel")
const fs = require('fs')



const unlikePic = (req) =>{
    if(req.file){
        fs.unlink(req.file.path,  (err) => {
            if (err) {
              throw new Error('Erreur lors de la suppression du fichier');
            }
        })
    }
}

module.exports.addRoom = async(req, res) =>{
    const id = ((req.adminId) ? req.adminId : req.userId)
    

    try {
        
        const newRoom = new roomModel({
            titre: req.body.titre.toLowerCase(),
            theme_de_discussion: req.body.theme_de_discussion.toLowerCase(),
            est_publique: ( req.adminId ? true : false ),
            members: (req.adminId ? [{id: id, isAdmin: true}] : [{id: id, isAdmin: false}]),
            id_createur: id,
            nom_createur: req.body.nom_createur
        })

        if(req.file){
            newRoom.cover = req.file.path
        }

        const room = await newRoom.save()

        const requete = {
            userId: id,
            params:{
                idRoom: room._id,
            },
            body: {
                type: 'info',
                contenue: `${room.nom_createur} a créé ce groupe`
            }
        }

        // console.log(requete);

        await addMessage(requete)


        res.json({room})
    } catch (error) {
        unlikePic(req)
        res.status(400).json({error})
    }
}

module.exports.getRooms = async(req, res) => {
    try {
        const rooms = ((req.adminId) ? 
            await roomModel.find({est_publique: true, 'members.id': req.adminId}).sort({updatedAt: -1})
        :   await roomModel.find({members: {$in : [req.userId]}}).sort({updatedAt: -1})
        )

        res.json({rooms})
    } catch (error) {
        res.status(400).json({error})
    }
}

module.exports.addOrRemoveUserToRoom = async(req, res) => {
    const id_room = req.params.id_room
    const new_members = req.body.new_members
    const members_to_delete = req.body.members_to_delete
 
    try {
        if (new_members) {
            await roomModel.findOneAndUpdate(
                {_id: id_room},
                {$addToSet: {members: {$each: new_members}}}
            )
        }

        if (members_to_delete) {
            await roomModel.findOneAndUpdate(
                {_id: id_room},
                {$pull: {members: {$in: members_to_delete}}}
            )
        }
        
        const room = await roomModel.findById(id_room)
        res.json({room})
    } catch (error) {
        res.status(400).json({error})
    }
}

module.exports.updateRoom = async(req,res) =>{
    try {
        const roomExist = await roomModel.findById(req.params.roomId)
        if (!roomExist) return res.status(400).json("Cette room n'existe pas")

        const room = await modifyRoom(req)

        res.json({room})
    } catch (error) {
        res.status(400).json({error})
    }
}


module.exports.getRoom = async(idRoom)=>{
    const room = await roomModel.findById(idRoom)
    return room
}