const { modifyRoom } = require('../rooms/roomFunc')
const messageModel = require('./messageModel')

module.exports.getMessages = async(req, res) =>{
    try {
        const messages = await this.getAllMessages(req.params.idRoom)
        // console.log(messages);
        res.json({messages})
    } catch (error) {
        res.status(400).json({error})
    }
}

module.exports.getAllMessages = async(idRoom) =>{
   
    const messages = await messageModel.find({id_room: idRoom})
    // console.log(messages);
    return messages
    
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

       const result = {}
        
    //    if (req.body.deleted) {

        const lastElement = messages[messages.length - 1]

        // console.log(String(lastElement._id));
        // console.log("eee : ", messageExist._id);
        // console.log(lastElement._id === messageExist._id);

        if (String(lastElement._id) === String(messageExist._id)) {

            const requete = {
                params: {
                    roomId: messageExist.id_room
                },
                body:{
                    last_message: (messageModified.deleted ? "Ce méssage a été supprimé" : messageModified.contenue)
                }
            }

            const room = await modifyRoom(requete)

            result.room = room
        }
    //    }
       result.messageModified = messageModified
       result.messages = messages

       res.json(result)
    } catch (error) {
        res.status(400).json({error})
    }
}