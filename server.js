/*
    Initialisation des dépendances nécéssaires
*/

const express = require('express')
const app = express() // on initialise express et on le stocke dans la constante app pour l'utiliser plus facilement
const cors = require('cors') // initialisation de cors

const dotenv = require('dotenv').config() // Pour pouvoir utiliser les variables d'environnement



// Recupération de la fonction pour la connexion à la base de données. cette fonction se trouve dans /config/db.js
const dbConnect = require('./config/db')

// Recupération de la fonction pour la création automatique d'un premier admin
const createFirstAdmin = require('./config/createFisrtAdmin')

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

app.listen(process.env.PORT, ()=>{
    console.log(`Serveur démarré.`);
})

