const passport = require('passport')
const github = require('passport-github2')
const usermodel = require('../dao/models/usermodel')

const initPassportGithub=()=>{

    passport.use('github', new github.Strategy(
        {
            clientID: "", 
            clientSecret: "", 
            callbackURL: "", 
        },
        async(accessToken, refreshToken, profile, done)=>{
            try {
                let usuario=await usermodel.findOne({email: profile._json.email})
                if(!usuario){
                    let nuevoUsuario={
                        nombre: profile._json.name,
                        email: profile._json.email, 
                        profile
                    }

                    usuario=await usermodel.create(nuevoUsuario)
                }
                return done(null, usuario)


            } catch (error) {
                return done(error)
            }
        }
    ))


    passport.serializeUser((usuario, done)=>{
        return done(null, usuario._id)
    })

    passport.deserializeUser(async(id, done)=>{
        let usuario=await usermodel.findById(id)
        return done(null, usuario)
    })
}

module.exports = initPassportGithub