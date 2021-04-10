const { body, validationResult } = require('express-validator');
const multer = require('multer');
const shortId = require('shortid');

const fs = require('fs');

const enviarEmail = require('../handlers/emails');
const Usuarios = require('../models/Usuarios');

const configMulter = {
    limits: {
        fileSize: 100000
    },
    storage: fileStorage = multer.diskStorage({
        destination: (req, res, next) => {
            next(null, __dirname + '/../public/uploads/perfiles/');
        },
        filename: (req, file, next) => {
            const extencion = file.mimetype.split('/')[1];//obtner los datos de la opcion 1
            next(null, `${shortId.generate()}.${extencion}`);
        }
    }),
    fileFilter(req, file, next ) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
            next(null, true)
        else 
            next(new Error('Formato de Imagen no valido'), false)
    }
}

const upload = multer(configMulter).single('imagen');

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

exports.formImagen = async(req, res) => {
    const usuario = await Usuarios.findByPk(req.user.id);

    res.render('imagen-perfil', {
        nombrePag: 'Subir Imagen de Perfil',
        usuario
    })
}

exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error) {
        if(error) {
            console.log(error);

            if(error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'La imagen que trata de subir es muy grande: Maximo 100Kb ');
                } else {
                    req.flash('error', req.message);
                }
            } else if (error.hasOwnProperty('message')){ 
                // revisa si existe un propiedas con el nombre ejemplo 
                //usuarios: {"message": "este un es mensaje"}
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        } else 
            next()
    })
} 

exports.guardarImagen = async(req, res) => {
    const usuario =await Usuarios.findByPk(req.user.id);

    if(req.file && usuario.imagen ){
        const imgAntePath = __dirname + `/../public/uploads/perfiles/${usuario.imagen}`;
        fs.unlink(imgAntePath, (error)=> {//eliminar imagen anterior 
            if(error) console.log(error) 
            return;
        })
    }

    if(req.file)
        usuario.imagen = req.file.filename;

    await usuario.save();
    req.flash('exito', 'Cambios Almacenados Correctamente');
    res.redirect('/administracion');
}
