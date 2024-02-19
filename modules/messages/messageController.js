const { modifyRoom } = require('../rooms/roomFunc')
const messageModel = require('./messageModel')

module.exports.getMessages = async(req, res) =>{
    try {
        const messages = await messageModel.find({id_room: req.params.idRoom})
        res.json({messages})
    } catch (error) {
        res.status(400).json({error})
    }
}

module.exports.sendMessage = async(req, res)=>{
    try {
        const message = await this.addMessage(req)

        const requete = {
            params: {
                roomId: message.id_room
            },
            body:{
                updatedAt: message.createdAt
            }
        }

        if (message.type === 'message') {
            requete.body.last_message = message.contenue
        }

        const room = await modifyRoom(requete)

        res.json({message: message, room: room})
        
    } catch (error) {
        res.status(400).json({error})
    }
}

module.exports.addMessage = async(req)=>{
    const data = req.body

    const newMessage = new messageModel({
        id_user: req.adminId || req.userId,
        id_room: req.params.idRoom,
        type: data.type,
        contenue: data.contenue || "",
        isResponseTo: data.isResponseTo || null
    })

    const message = await newMessage.save()
    return message
}

module.exports.updateMessage = async(req, res)=>{
    try {
       const messageExist = await messageModel.findById(req.params.idMessage)
       if (!messageExist) return res.status(400).json({error : "Message inexistant"})

       await messageModel.findByIdAndUpdate(messageExist, req.body, {new: true})
        
       const messageModified = await messageModel.findById(req.params.idMessage)

       const messages = await messageModel.find({id_room: messageModified.id_room})

       res.json({messageModified, messages})
    } catch (error) {
        res.status(400).json({error})
    }
}