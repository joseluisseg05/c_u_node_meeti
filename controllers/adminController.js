const Grupos = require('../models/Grupos');

exports.panelAdmin = async(req, res) => {
    const grupos = await Grupos.findAll({
        where: {
            usuarioId: req.user.id
        }
    });
    res.render('administracion', {
        nombrePag: 'Panel de Administración',
        grupos
    })
}