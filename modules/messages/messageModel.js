const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
    {
        contenue: {
            type: String,
            default: ""
        },
        id_room: {
            type: String,
            required: true
        },
        id_user: {
            type: String,
            required: true
        },
        image:{
            type: String
        },
        document: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('messageModel', messageSchema)