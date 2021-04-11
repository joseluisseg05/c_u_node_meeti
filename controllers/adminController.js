const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');

const moment = require('moment');
const { Op } = require('sequelize');

exports.panelAdmin = async(req, res) => {
    const consulta = [
        Grupos.findAll({
            where: {
                usuarioId: req.user.id
            }
        }),
        Meeti.findAll({
            where: {
                usuarioId: req.user.id,
                fecha: {
                    [Op.gte] : moment(new Date()).format("YYYY-MM-DD")//si la fecha es mayor que hoy muestra
                }
            },
            order: [
                ['fecha', 'ASC']
            ]
        }),
        Meeti.findAll({
            where: {
                usuarioId: req.user.id,
                fecha: {
                    [Op.lt] : moment(new Date()).format("YYYY-MM-DD")//si la fecha es menor que hoy muestra
                }
            }
        })
    ]
    const [ grupos, meeti, anteriores] = await Promise.all(consulta);

    res.render('administracion', {
        nombrePag: 'Panel de Administración',
        grupos,
        meeti,
        moment, //para la libreria a la vista
        anteriores
    })
}