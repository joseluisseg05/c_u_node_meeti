const passport = require("passport");

exports.authUser = passport.authenticate('local',{
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

exports.isAuth = (req, res, next) => {
    if(req.isAuthenticated()) return next();

    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res, next) => {
    req.logout();
    req.flash('correcto', 'Cerraste Sesion Correctamente');
    res.redirect('/iniciar-sesion');
    next();
}