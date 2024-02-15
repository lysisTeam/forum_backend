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
        prenoms: joi.string().min(3).required().messages(customMessages),
        autorisation: joi.number(),
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
            username: data.username || data.prenoms[0].toLowerCase() + data.nom.toLowerCase() + '_admin',
            email: data.email?.toLowerCase() || null,
            autorisation: data.autorisation || 0,
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
    
        const token = jwt.sign({adminId: usernameExist._id}, process.env.SECRET_KEY, {expiresIn : '3h'})
        
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

module.exports.getAdmins = async(req, res) =>{
    const motCle = req.body.searchContent
    const ids = req.body.ids
    try {
        let admins = []

        if (ids) {
            if (ids.length !== 0) {
                admins = await adminModel.find( {_id: {$in: ids} }).sort({createdAt: -1})
            }else{
                admins = []

            }
        }else if (motCle) {
            admins = await adminModel.find({
                $or: [
                    { nom: { $regex: motCle, $options: 'i' } }, // $regex pour une correspondance partielle, $options: 'i' pour insensible à la casse
                    { prenoms: { $regex: motCle, $options: 'i' } },
                    { username: { $regex: motCle, $options: 'i' } },
                    { email: { $regex: motCle, $options: 'i' } },

                ]
            }).sort({createdAt: -1})
        }else{
            admins = await adminModel.find().sort({createdAt: -1})
        }
        res.json({admins})
    } catch (error) {
        res.status(400).json({error})
    }
}

module.exports.updateAdmin = async(req, res) =>{
    const id = req.adminId

    try {
        const adminExist = await adminModel.findOne({_id: id})
        if(!adminExist) return res.status(400).json('Cet utilisateur est introuvable')

        if (req.body.oldPassword) {
            
            const passwordVerification = await bcrypt.compare(req.body.oldPassword, adminExist.password)
            if(!passwordVerification) return res.status(400).json("Mot de passe incorrecte")

            if(req.body.password !== req.body.passwordRepeat) return res.status(400).json('Les mots de passes doivent être les mêmes')

            
            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            const passwordVerificationFinal = await bcrypt.compare(req.body.password, adminExist.password)
            if(passwordVerificationFinal) return res.status(400).json("Votre nouveau mot de passe ne peut pas être le même que l'ancien")

            await adminModel.findByIdAndUpdate(adminExist, {password: hashedPassword})
            
        }else{
            await adminModel.findByIdAndUpdate(adminExist, req.body)
        }

        const admin = await adminModel.findOne({_id: id})
        res.json({admin})
    } catch (err) {
        res.status(400).json({err})
        
    }
}

module.exports.deleteAdmins = async(req, res)=>{
    let adminDeleted = []
    let adminNotDeleted = []
    try {
        const idsToDelete = req.body.ids;

        for(const id of idsToDelete){
            
            const result = await adminModel.findByIdAndRemove(id)
            if (result) {

                adminDeleted.push(id)

            }else{
                adminNotDeleted.push(id)
            }
        }

        res.json({ message : "Suppression terminée", adminDeleted: adminDeleted, adminNotDeleted: adminNotDeleted })
    } catch (err) {
        res.status(400).json({err})
    }
}