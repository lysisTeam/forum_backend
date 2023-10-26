/*
    Connexion à la base de donnée. cette fonction sera appelée dans le server.js
*/

const mongoose = require('mongoose')

const dbConnect = async () =>{
    await mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("Base de données connectée"))
    .catch((error)=>console.log(error))
}



// async function dbConnect (){
//     await mongoose.connect(process.env.MONGO_URL)
//     .then(()=>console.log("Base de données connectée"))
//     .catch((error)=>console.log(error))
// }

module.exports = dbConnect