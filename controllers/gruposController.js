const { body } = require('express-validator');
const multer = require('multer');
const shortId = require('shortid');
const { v4:uuid } = require('uuid');

const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');

const configMulter = {
    limits: {
        fileSize: 100000
    },
    storage: fileStorage = multer.diskStorage({
        destination: (req, res, next) => {
            next(null, __dirname + '/../public/uploads/grupos/');
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

exports.formNuevoGrupo = async(req, res) => {
    const categorias = await Categorias.findAll();

    res.render('nuevo-grupo', {
        nombrePag: 'Crea un nuevo Grupo',
        categorias
    })
}

exports.crearNuevo = async(req, res) => {
    const reglas = [
        body('nombre').trim().escape(),
        body('url').trim()
    ]
    await Promise.all(reglas.map( validation => validation.run(req))); //ejecuta todo lo que esta en reglas

    const grupo = req.body;
    grupo.usuarioId = req.user.id;
    
    grupo.id = uuid();
    
    if(req.file) // si hay una imagan en la req asigna 
        grupo.imagen = req.file.filename;

    try {
        await Grupos.create(grupo);

        req.flash('exito', 'Se ha creado un nuevo Grupo');
        res.redirect('/administracion');

    } catch (error) {
        console.log(error);

        const erroresSequ = error.errors.map(err => err.message);
        
        req.flash('error', erroresSequ);
        res.redirect('/nuevo-grupo')
    }
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

exports.formEditar = async(req, res) => {
    const consultas = [
        Grupos.findByPk(req.params.grupoId),
        Categorias.findAll()
    ]

    const [ grupo, categorias ] = await Promise.all(consultas);

    res.render('editar-grupo', {
        nombrePag: 'Editar Grupo - '+grupo.nombre,
        grupo,
        categorias
    })
}

exports.editarData = async (req, res) => {
    const grupo =await Grupos.findOne({
        where: {
            id: req.params.grupoId,
            usuarioId: req.user.id
        }
    });

    if(!grupo) {
        req.flash('error', 'Operación no válida')
        res.redirect('/administracion');
        return next();
    }

    const { nombre, descripcion, url, categoriaId} = req.body;

    grupo.nombre = nombre;
    grupo.descripcion = descripcion;
    grupo.ur = url;
    grupo.categoriaId = categoriaId;

    await grupo.save()
    req.flash('exito', 'Cambios Almacenados Correctament');
    res.redirect('/administracion');
}
