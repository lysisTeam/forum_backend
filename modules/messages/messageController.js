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
    const data = req.body


    try {
        const newMessage = new messageModel({
            id_user: req.adminId || req.userId,
            id_room: req.params.idRoom,
            type: data.type,
            contenue: data.contenue || "",
            isResponseTo: data.isResponseTo || null
        })

        const message = await newMessage.save()

        res.json({message})
        
    } catch (error) {
        res.status(400).json({error})
    }
}