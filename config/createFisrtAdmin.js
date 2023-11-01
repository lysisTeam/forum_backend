const adminModel = require("../modules/admins/adminModel");
const bcrypt = require('bcrypt')

/*
    Cette fonction si le premier admin : lysis_admin existe déjà et le crée au cas où il n'existe pas.
*/
const createFirstAdmin = async () =>{
    const adminExist = await adminModel.findOne({username: "lysis_admin"})
    if(!adminExist){
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

        const admin = new adminModel({
            nom: "lysis",
            prenoms: "lysis",
            username: "lysis_admin",
            email: "",
            password: hashedPassword
        })

        await admin.save()
        console.log("Premier admin créé");
    }
}

module.exports = createFirstAdmin