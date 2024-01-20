const adminModel = require("./adminModel");
const joi = require('joi') 
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// Définir des messages d'erreur personnalisés pour Joi
const customMessages = {
    'string.base': '{{#label}} doit être une chaîne de caractères',
    'string.min': '{{#label}} doit avoir une longueur d\'au moins {{#limit}} caractères',
    'string.max': '{{#label}} doit avoir une longueur d\'au plus {{#limit}} caractères',
    'string.email': '{{#label}} doit être une adresse e-mail valide',
    'string.required': '{{#label}} est requis',
};

// Création d'un schema de validation pour les données lors de la création de compte admin
const schemaDataRegister = joi.object(
    {
        nom: joi.string().min(3).required().messages(customMessages),
        prenoms: joi.string().min(5).required().messages(customMessages),
        username: joi.string().min(5).required().messages(customMessages),
        email: joi.string().email().min(7).messages(customMessages),
        password: joi.string().min(8).required().messages(customMessages),
        passwordRepeat: joi.string().min(8).required().messages(customMessages),
    }
)

// Création d'un schema de validation pour les données lors de la connexion d'un admin
const schemaDataLogin = joi.object(
    {
        username: joi.string().min(5).required().messages(customMessages),
        password: joi.string().min(8).required().messages(customMessages),
    }
)


/*
    Cette fonction permet de créer un compte admin 
*/
module.exports.registerAdmin = async (req, res) => {
    const data = req.body

    const {error} = schemaDataRegister.validate(data)
    if(error) return res.status(400).json({error: error.details[0].message.replace(/["']/g, ''), path: error.details[0].path[0]})

    try {
        const usernameExist = await adminModel.findOne({username: data.username})
        if (usernameExist) return res.status(400).json({error: "Ce nom d'utilisateur existe déjà", path: "username"})

        const emailExist = await adminModel.findOne({email: data.email})
        if (emailExist) return res.status(400).json({error: "Cet email existe déjà", path: "email"})

        if(data.password !== data.passwordRepeat) return res.status(400).json({error: 'Les mots de passe doivent être les mêmes', path: "password"})

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

    if(error) return res.status(400).json({error: error.details[0].message.replace(/["']/g, ''), path: error.details[0].path[0]})
   

    try {
        const usernameExist = await adminModel.findOne({username: data.username})
        if (!usernameExist) return res.status(400).json({error: "Utilisateur introuvable", path: "username"})

        const passwordVerification = await bcrypt.compare(data.password, usernameExist.password)
        if(!passwordVerification) return res.status(400).json({error: "Mauvais mot de passe", path: "password"})
    
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