const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema(
    {
        // nom: {
        //     type: String,
        //     required: true
        // },
        titre: {
            type: String,
            required: true
        },
        theme_de_discussion: {
            type: String,
            // required: true
            default: null
        },
        est_publique:{
            type: Boolean,
            default: false
        },
        members:{
            type: Array,
            default: []
        },
        id_createur: {
            type: String,
            required: true
        },
        cover:{
            type: String,
            default:null
        },
        last_message : {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('roomModel', roomSchema)