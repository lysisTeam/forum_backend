/*
    Iniatialisation des dépendances nécéssaires
*/

const express = require('express')
const app = express() // on initialise express et on le stocke dans la constante app pour l'utiliser plus facilement
const cors = require('cors') // initialisation de cors
const dotenv = require('dotenv').config() // Pour pouvoir utiliser les variables d'environnement
const dbConnect = require('./config/db') // Recupération de la fonction pour la connexion à la base de données. cette fonction se trouve dans /config/db.js

//-----------------------------------------------------------------------------------------------------------------------------

/*
    Middlewares pour cors et pour autoriser les formats json et url
*/

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//------------------------------------------------------------------------------------------------------------------------------

/*
    Fonction pour le démarrage du serveur et pour la connexion à la base de données
*/

dbConnect()

app.listen(process.env.PORT, ()=>{
    console.log(`Serveur démarré.`);
})