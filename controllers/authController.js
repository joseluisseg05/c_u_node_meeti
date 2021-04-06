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