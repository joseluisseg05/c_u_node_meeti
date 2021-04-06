const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const Usuarios = require('../models/Usuarios');

passport.use(new LocalStrategy({
    usernameField: 'email', // como se llaman los campos del model de mongo
    passwordField : 'password'
    }, async( email, password, next) => {
        const usuario = await Usuarios.findOne({
            where: { email, activo: 1 } 
        });
        if(!usuario) return next(null, false, {
            message: 'El usuario no existe'  //cambiar mensaje a datos incorrectos por seguridad
        });

        const verificarPass = usuario.validarPassword(password);
        if(!verificarPass) return next(null, false, {
            message: 'Password incorrecto'
        });

        //todo ok
        return next(null, usuario);
    }
));

passport.serializeUser(function(usuario, cb) {
    cb(null, usuario);
});
passport.deserializeUser(function(usuario, cb) {
    cb(null, usuario);
});

module.exports = passport;