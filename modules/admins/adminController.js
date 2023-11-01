const adminModel = require("./adminModel");
const joi = require('joi') 
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Création d'un schema de validation pour les données lors de la création de compte admin
const schemaDataRegister = joi.object(
    {
        nom: joi.string().min(3).required(),
        prenoms: joi.string().min(5).required(),
        username: joi.string().min(5).required(),
        email: joi.string().min(7),
        password: joi.string().min(8).required(),
        passwordRepeat: joi.string().min(8).required(),
    }
)

// Création d'un schema de validation pour les données lors de la connexion d'un admin
const schemaDataLogin = joi.object(
    {
        username: joi.string().min(5).required(),
        password: joi.string().min(8).required(),
    }
)


/*
    Cette fonction permet de créer un compte admin 
*/
module.exports.registerAdmin = async (req, res) => {
    const data = req.body

    const {error} = schemaDataRegister.validate(data)
    if(error) return res.status(400).json(error.details[0].message)

    try {
        const usernameExist = await adminModel.findOne({username: data.username})
        if (usernameExist) return res.status(400).json("Ce nom d'utilisateur existe déjà")

        const emailExist = await adminModel.findOne({email: data.email})
        if (emailExist) return res.status(400).json("Cet email existe déjà")

        if(data.password !== data.passwordRepeat) return res.status(400).json('Les mots de passe doivent être les mêmes')

        const hashedPassword = await bcrypt.hash(data.password, 10)

        const admin = new adminModel({
            nom: data.nom.toLowerCase(),
            prenoms: data.prenoms.toLowerCase(),
            username: data.username,
            email: data.email?.toLowerCase() || null,
            password: hashedPassword
        })

        const adminSaved = await admin.save()
        res.json({adminSaved})

    } catch (error) {
        res.status(400).json({error})
    }
}


/*
    Cette fonction permet de se connecter en tant que admin 
*/
module.exports.loginAdmin = async(req, res)=>{
    const data = req.body
    const {error} = schemaDataLogin.validate(data)
    if(error) return res.status(400).json(error.details[0].message)

    try {
        const usernameExist = await adminModel.findOne({username: data.username})
        if (!usernameExist) return res.status(400).json("Utilisateur introuvable")

        const passwordVerification = bcrypt.compare(data.password, usernameExist.password)
        if(!passwordVerification) return res.status(400).json("Mauvais mot de passe")

        const token = jwt.sign({adminId: usernameExist._id}, process.env.SECRET_KEY)
        res.json({token})
    } catch (error) {
        res.status(400).json({error})
    }
}


/*
    Cette fonction permet de recupérer les données d'un compte admin. Cela sera utiliser apres la connexion  pour récupérer les données de l'admin connecté
*/
module.exports.getAdmin = async(req, res)=>{
    const id = req.adminId
    try {
        const admin = await adminModel.findById(id)
        res.json({admin})
    } catch (error) {
        res.status(400).json({error})
    }
}