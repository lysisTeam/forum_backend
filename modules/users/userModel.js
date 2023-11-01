const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        nom : {
            type: String,
            required
        },
        prenoms : {
            type: String,
            required
        },
        username: {
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        classe:{
            type: String,
            required: true
        },
        specialite:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        photo:{
            type:String
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('userModel', userSchema)