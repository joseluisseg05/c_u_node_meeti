const moment = require('moment');

const Grupos = require('../../models/Grupos');
const Meeti = require('../../models/Meeti');

exports.mostrarGrupo = async(req, res, next) => {
    const consultas = [
        Grupos.findOne({
            where: {
                id: req.params.id
            }
        }),
        Meeti.findAll({
            where: {
                grupoId: req.params.id
            },
            order: [
                ['fecha', 'ASC']
            ]
        })
    ];

    const [grupo, meetis] = await Promise.all(consultas);

    if(!grupo) {
        res.redirect('/');
        return next()
    }

    res.render('mostrar-grupo',{
        nombrePag: `Informacion sobre el Grupo ${grupo.nombre}`,
        grupo,
        meetis,
        moment
    })
}