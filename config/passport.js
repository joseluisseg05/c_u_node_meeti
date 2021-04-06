const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const Usuarios = require('../models/Usuarios');

passport.use(new LocalStrategy({
    usernameField: 'email', // como se llaman los campos del model de mongo
    passwordField : 'password'
    }, async( email, password, done) => {
        const usuario = await Usuarios.findOne({
            where: { email, activo: 1 } 
        });
        if(!usuario) return done(null, false, {
            message: 'El usuario no existe'  //cambiar mensaje a datos incorrectos por seguridad
        });

        const verificarPass = usuario.validarPassword(password);
        if(!verificarPass) return done(null, false, {
            message: 'Password incorrecto'
        });

        //todo ok
        return done(null, usuario);
    }
));

passport.serializeUser((usuario, done) => done(null, usuario));

passport.deserializeUser(async (usuario, done) => {
    return done(null, usuario);
});

module.exports = passport;