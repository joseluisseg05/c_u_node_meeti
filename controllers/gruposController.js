const { sanitizeBody, body } = require('express-validator');

const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');

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