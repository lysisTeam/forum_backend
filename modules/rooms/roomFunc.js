const roomModel = require("./roomModel")

module.exports.modifyRoom = async (req)=>{

    await roomModel.findByIdAndUpdate(req.params.roomId, req.body)

    const room = await roomModel.findById(req.params.roomId)

    console.log(room);

    return room
}