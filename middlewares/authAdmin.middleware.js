const jwt = require('jsonwebtoken')

/*
    Cette fonction vérifie si:
    -le token passé dans la requête est valide
    -le token appartient à un compte administrateur

    Si les conditions plus haut ne sont pas validées la fonction retourne une erreur : Vous n'avez pas ...
    Si les conditions sont validées :
    -l'id de l'administrateur est extraite du token ( tokenVerification.adminId )
    -l'id est passé dans req.adminId 
    -Ensuite la fonction laisse passer la requete vers le controlleur pour la suite de l'exécution
*/
const verifyAdminToken = async (req, res, next) =>{
    try {
        const token = req.headers.token

        const tokenVerification = jwt.verify(token, process.env.SECRET_KEY)
        req.adminId = tokenVerification.adminId

        next()
    } catch (error) {
        return res.status(400).json("Vous n'avez pas les droits d'administrateur")
    }
}

module.exports = verifyAdminToken