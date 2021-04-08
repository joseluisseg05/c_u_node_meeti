const Grupos = require('../models/Grupos');

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