/*
    Initialisation des dépendances nécéssaires
*/

const express = require('express')
const app = express() // on initialise express et on le stocke dans la constante app pour l'utiliser plus facilement
const cors = require('cors') // initialisation de cors

const dotenv = require('dotenv').config() // Pour pouvoir utiliser les variables d'environnement

const socket = require('socket.io')

// Recupération de la fonction pour la connexion à la base de données. cette fonction se trouve dans /config/db.js
const dbConnect = require('./config/db')

// Recupération de la fonction pour la création automatique d'un premier admin
const createFirstAdmin = require('./config/createFisrtAdmin')
const { getRoom } = require('./modules/rooms/roomController')

//-----------------------------------------------------------------------------------------------------------------------------

/*
    Middlewares pour cors et pour autoriser les formats json et url
*/

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//-------------------------------------------------------------------------------------------------------------------------------

/*
    Rédirection des routes
*/

app.use('/api/admin', require('./modules/admins/adminRoute'))
app.use('/api/user', require('./modules/users/userRoute'))
app.use('/api/room', require('./modules/rooms/roomRoute'))
app.use('/api/message', require('./modules/messages/messageRoute'))

//-------------------------------------------------------------------------------------------------------------------------------

/*
    Rendre le dossier uploads accéssible
*/

app.use('/uploads', express.static('uploads'))

//------------------------------------------------------------------------------------------------------------------------------

/*
    Fonction pour le démarrage du serveur, pour la connexion à la base de données et pour la création d'un premier admin
*/

dbConnect()

createFirstAdmin()

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Serveur démarré.`);
})

const io = socket(server, {
    cors: true
})

global.onlineUsers = []

io.on('connection', (socket) =>{
    console.log("Socket connected "+socket.id);

    global.chatSocket = socket

    socket.on('add-user', (userId) =>{
        onlineUsers.push({userId: userId, socketId: socket.id})
        // console.log("test : ",onlineUsers);
    })

    socket.on('disconnect-user', (userId) =>{
        onlineUsers = onlineUsers.filter(onlineUser => onlineUser.userId !== userId)
      
    })




    socket.on('message:send', async(data) =>{
        // console.log(data);
        // console.log(onlineUsers);
        const usersToSend = data.users
        const room = await getRoom(data.message.id_room)
        console.log(room);
        usersToSend.forEach(user => {
            const connectedUser = onlineUsers.filter(onlineUser => onlineUser.userId === user._id)[0]
            if (connectedUser) {
                // console.log(connectedUser);
                io.to(connectedUser.socketId).emit("message:receive", {message : data.message, room: room})
            }
        });
    })
})