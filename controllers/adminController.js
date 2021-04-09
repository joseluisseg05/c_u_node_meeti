const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');

exports.panelAdmin = async(req, res) => {
    const consulta = [
        Grupos.findAll({
            where: {
                usuarioId: req.user.id
            }
        }),
        Meeti.findAll({
            where: {
                usuarioId: req.user.id
            }
        })
    ]
    const [ grupos, meeti] = await Promise.all(consulta);

    res.render('administracion', {
        nombrePag: 'Panel de Administración',
        grupos,
        meeti
    })
}