const { body, validationResult } = require('express-validator');

const enviarEmail = require('../handlers/emails');

const Usuarios = require('../models/Usuarios');

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
        await Usuarios.create(usuario);

        const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

        await enviarEmail.enviar({
            usuario,
            url,
            subject: 'Confirmar Cuenta',
            archivo: 'confirmar-cuenta'
        })

        req.flash('exito', 'Hemos envio un correo para confirmar tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        console.log(error);

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

exports.confirmarCuenta = async(req, res, next) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    if(!usuario){
        req.flash('error','No existe esa cuenta');
        res.redirect('/crear-cuenta');
        return next();
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('exito','Cuenta confirmada, ya puedes iniciar sesión');
    res.redirect('/iniciar-sesion');
}

//editar perfil 
exports.formEditar = async(req, res) => {
    const usuario = await Usuarios.findByPk(req.user.id);

    res.render('editar-perfil', {
        nombrePag: 'Editar perfil de ' + usuario.nombre,
        usuario
    })
}

exports.editarPerfil = async (req, res) => {
    const usuario = await Usuarios.findByPk(req.user.id);
    const {nombre, descripcion, email} = req.body;

    usuario.nombre = nombre;
    usuario.descripcion = descripcion;
    usuario.email = email;

    await usuario.save()

    req.flash('exito', 'Actualización de datos correcto');
    res.redirect('/administracion');
}

exports.sanitizar = async(req, res, next) => {
    const reglas = [
        body('nombre').trim().escape(),
        body('email').trim()
    ]
    await Promise.all(reglas.map(validacion => validacion.run(req)));

    next()
}

exports.formCambiarPass = (req, res) => {
    resr.render('reset-pass', {
        nombrePag: 'Cambiar Contraseña',

    })
}

exports.cambiarPass = async(req, res, next) => {
    const usuario = await Usuarios.findByPk(req.user.id);

    if(!usuario.validarPassword(req.body.anterior)){//comparar pass
        req.flash('error', 'Contraseña Actual incorrecto');
        res.redirect('/administracion');
        return next()
    }

    const hash = usuario.hashPassword(req.body.nuevo);

    usuario.password = hash;

    await usuario.save()

    req.logout();
    req.flash('exito', 'Contraseña Actualizada');
    res.redirect('/iniciar-sesion');
}