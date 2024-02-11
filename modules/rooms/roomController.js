const roomModel = require("./roomModel")


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
            members: (req.adminId ? [] : [id]),
            id_createur: id
        })

        if(req.file){
            newRoom.cover = req.file.path
        }

        const room = await newRoom.save()

        res.json({room})
    } catch (error) {
        unlikePic(req)
        res.status(400).json({error})
    }
}

module.exports.getRooms = async(req, res) => {
    try {
        const rooms = ((req.adminId) ? 
            await roomModel.find({est_publique: true}).sort({createdAt: -1})
        :   await roomModel.find({members: {$in : [req.userId]}}).sort({createdAt: -1})
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

