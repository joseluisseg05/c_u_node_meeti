const { v4: uuid } = require('uuid');
const { body } = require('express-validator');

const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');


exports.formNuevo = async(req, res) => {
    const grupos = await Grupos.findAll({
        where: {
            usuarioId: req.user.id
        }
    })
    res.render('nuevo-meeti',{
        nombrePag: 'Crear Nuevo Meeti',
        grupos
    })
}

exports.crearMeeti = async(req, res) => {
    const meeti = req.body;
    meeti.id = uuid()
    meeti.usuarioId = req.user.id;

    const point = {
        type: 'Point',
        coordinates: [
            parseFloat(req.body.lat),
            parseFloat(req.body.lng)
        ]
    }

    meeti.ubicacion = point;

    if(req.body.cupo == '')
        meeti.cupo = 0;

    try {
        await Meeti.create(meeti);
        
        req.flash('exito', 'Se ha creado el Meeti con exito');
        res.redirect('/administracion');     
    } catch (error) {
        console.log(error);

        const errorSeq = error.errors.map(err => err.message );
        req.flash('error', errorSeq),
        res.redirect('/nuevo-meeti');
    }
}

exports.formEditarMeeti = async (req, res, next) => {
    const consultas = [
        Grupos.findAll({
            where: {
                usuarioId: req.user.id
            }
        }),
        Meeti.findByPk(req.params.id),
    ]

    const [grupos, meeti] = await Promise.all(consultas);

    if(!grupos || !meeti) {
        req.flash('error', 'Operación no valida');
        res.redirect('/administracion');
        return next()
    }

    res.render('editar-meeti', {
        nombrePag: 'Editar Meeti - '+meeti.titulo,
        grupos,
        meeti
    })
}

exports.editarData = async(req, res, next) => {
    const meeti = await Meeti.findOne({
        where: {
            id: req.params.id,
            usuarioId: req.user.id
        }
    });

    if(!meeti) {
        req.flash('error', 'Operación no valida');
        res.redirect('/administracion');
        return next()
    }

    const { grupoId, titulo, invitado, fecha, hora, cupo,
        descripcion, direccion, ciudad, estado, pais, lat, lng } = req.body;
    
    meeti.grupoId = grupoId;
    meeti.titulo = titulo;
    meeti.invitado = invitado;
    meeti.fecha = fecha;
    meeti.hora = hora;
    meeti.cupo = cupo;
    meeti.descripcion = descripcion;
    meeti.direccion = direccion;
    meeti.ciudad = ciudad;
    meeti.estado = estado;
    meeti.pais = pais;

    const point = {
        type: 'Point', 
        coordinates: [parseFloat(lat), parseFloat(lng)]
    }
    meeti.ubicacion = point;

    await meeti.save();

    req.flash('exito', 'Se ha actualizado el Meeti con exito');
    res.redirect('/administracion'); 
}

exports.formEliminar = async(req, res, next) => {
    const meeti = await Meeti.findOne({
        where: {
            id: req.params.id,
            usuarioId: req.user.id
        }
    });

    if(!meeti){
        req.flash('error', 'Operación no valida');
        res.redirect('/administracion');
        return next()
    }

    res.render('eliminar-meeti', {
        nombrePag: 'Eliminar Meeti - '+ meeti.titulo
    })
}

exports.eliminarData = async(req, res) => {

    await meeti.destroy({
        where: {
            id: req.params.id,
            usuarioId: req.user.id
        }
    });

    req.flash('exito', 'Tu meeti se a eliminado');
    res.redirect('/administracion')
}

exports.sanitizar = async(req, res, next) => {
    const reglas = [
        body('titulo').trim().escape(),
        body('invitado').trim().escape(),
        body('cupo').trim().escape(),
        body('fecha').trim().escape(),
        body('hora').trim().escape(),
        body('direccion').trim().escape(),
        body('ciudad').trim().escape(),
        body('estado').trim().escape(),
        body('pais').trim().escape(),
        body('lat').trim().escape(),
        body('lng').trim().escape(),
        body('grupoId').trim().escape(),
    ];

    await Promise.all(reglas.map(validacion => validacion.run(req) ));

    next();
}