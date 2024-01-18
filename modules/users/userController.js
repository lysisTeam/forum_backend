const userModel = require("./userModel");
const joi = require('joi') 
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');

const schemaDataCreateUser = joi.object(
    {
        nom: joi.string().min(3).required(),
        prenoms: joi.string().min(5).required(),
        username: joi.string().min(5).required(),
        email: joi.string().min(7).required(),
        password: joi.string().min(8).required(),
        passwordRepeat: joi.string().min(8).required(),
        classe: joi.string().min(5).required(),
        specialite: joi.string().min(2).required()
    }
)


// Fonction pour envoyer un email à l'utilisateur
const sendMailToUser = async (user, mdp) => {

    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Remplacez par le service SMTP que vous utilisez
        auth: {
            user: 'mounirouabdul40@gmail.com', // Votre adresse e-mail
            pass: 'lxqp whye xkev lvab ' // Votre mot de passe
        }
    });

    const emailHTML = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Informations d'accès</title>
            </head>
            <body>
                <h1>Confirmation de création de compte</h1>
                <p>Cher ${user.nom},</p>
                <p>Votre compte a été créé avec succès.</p>
                <p>Voici vos informations d'accès :</p>
                <ul>
                    <li>Identifiant : ${user.username}</li>
                    <li>Mot de passe : ${mdp}</li>
                </ul>
                <p>Vous pouvez vous connecter en utilisant votre identifiant et votre mot de passe.</p>
                <p>Merci de rejoindre notre service.</p>
            </body>
        </html>
    `;

    // Paramètres de l'e-mail
    const mailOptions = {
        from: process.env.USER_MAIL, // Votre adresse e-mail
        to: user.email, // Adresse e-mail du destinataire
        subject: 'Informations d\'accès',
        html: emailHTML
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        } else {
            console.log('E-mail envoyé avec succès :', info.response);
        }
    });

}

module.exports.createUser = async (req,res) => {
    const data = req.body

    const {error} = schemaDataCreateUser.validate(data)
    if(error) return res.status(400).json(error.details[0].message)

    try {

        
        const usernameExist = await userModel.findOne({username: data.username})
        if (usernameExist) return res.status(400).json("Ce nom d'utilisateur existe déjà")
        
        const emailExist = await userModel.findOne({email: data.email})
        if (emailExist) return res.status(400).json("Cet email existe déjà")
        
        if(data.password !== data.passwordRepeat) return res.status(400).json('Les mots de passe doivent être les mêmes')

        const hashedPassword = await bcrypt.hash(data.password, 10)

        const user = new userModel({
            nom: data.nom.toLowerCase(),
            prenoms: data.prenoms.toLowerCase(),
            username: data.username,
            email: data.email.toLowerCase(),
            password: hashedPassword,
            classe: data.classe.toLowerCase(),
            specialite: data.specialite.toLowerCase()
        })

        if(req.file){
            user.photo = req.file.path
        }

        const userSaved = await user.save()

        sendMailToUser(userSaved, data.password)

        res.json({userSaved})

        
    } catch (error) {
        res.status(400).json({error})
    }
}

module.exports.getUsers = async(req, res)=>{
    try {
        const users = await userModel.find()
        res.json({users})
    } catch (err) {
        res.status(400).json({err})
    }
}