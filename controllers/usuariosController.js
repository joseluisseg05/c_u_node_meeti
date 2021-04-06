const Usuarios = require('../models/Usuarios');
const { body, validationResult } = require('express-validator');

exports.formCrearCuenta = (req, res) =>{
    res.render('crear-cuenta', {
        nombrePag: 'Crea tu cuenta'
    });
}

exports.crearCuenta = async(req, res) => {
    const usuario = req.body;
    const rules = [
        body('nombre').notEmpty().withMessage('El nombre es un campo requerido').escape(),
        body('email').notEmpty().isEmail().withMessage('El correo es un campo requerido').escape(),
        body('confirmar').notEmpty().withMessage('Debes de confirmar tu password').escape(),
        body('confirmar').equals(req.body.password).withMessage('El password es diferente').escape()
    ]

    await Promise.all(rules.map(validation => validation.run(req)))
    const erroresExpress = validationResult(req);

    try {
        const nuevo = await Usuarios.create(usuario);

        req.flash('exito', 'Hemos envio un correo para confirmar tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        const erroresSequ = error.errors.map(err => err.message);
        const errExp = erroresExpress.array().map(err => err.msg);

        const listaError = [...erroresSequ, ...errExp]; //unirlos 
        
        req.flash('error', listaError);
        res.redirect('/crear-cuenta');
    }
    
}

exports.formIniciarSesion = (req, res) =>{
    res.render('iniciar-sesion', {
        nombrePag: 'Iniciar Sesión'
    });
}