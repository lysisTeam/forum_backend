const roomModel = require("./roomModel")

module.exports.modifyRoom = async (req)=>{

    // console.log(req);

    await roomModel.findByIdAndUpdate(req.params.roomId, req.body, {new: true, timestamps: false})

    const room = await roomModel.findById(req.params.roomId)

    // console.log(room);

    return room
}