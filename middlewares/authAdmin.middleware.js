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
    const token = req.headers.token
    
    if (!token) {
        return res.status(401).json({ message: 'Token non fourni' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token non valide' });
        }
    
        // Vérifiez la date d'expiration
        if (decoded.exp <= Date.now() / 1000) {
            return res.status(401).json({ message: 'Token expiré' });
        }

        // Le token est valide, passez à la suite
        req.adminId = decoded.adminId
        next()
    })
}

module.exports = verifyAdminToken