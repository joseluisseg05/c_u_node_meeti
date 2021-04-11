const moment = require('moment');

const Meeti = require('../../models/Meeti');
const Grupos = require('../../models/Grupos');
const Usuarios = require('../../models/Usuarios');

exports.mostrarMeeti = async(req, res) => {
    const meeti = await Meeti.findOne({
        where: {
            slug: req.params.slug
        },
        include: [
            {
                model: Grupos
            },
            {
                model: Usuarios,
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
    })

    if(!meeti) 
        res.redirect('/')

    res.render('mostrar-meeti', {
        nombrePag: meeti.titulo,
        meeti,
        moment
    })
}