const moment = require('moment');
const { Op } = require('sequelize');

const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');
const Usuarios = require('../models/Usuarios');

exports.home = async(req, res) => {
    const consultas = [];
    consultas.push(Categorias.findAll())
    consultas.push(Meeti.findAll({
        attributes : ['slug', 'titulo', 'fecha', 'hora'],
        where: {
            fecha: {
                [Op.gte]: moment(new Date()).format("YYYY-MM-DD")
            }
        },
        limit: 3,
        order: [
            ['fecha', 'ASC']
        ],
        include: [//optener datos de la relacion de otras tablas 
            {
                model : Grupos,
                attributes: ['imagen']
            },
            {
                model : Usuarios,
                attributes: ['nombre', 'imagen']
            }
        ]
    }))

    const [ categorias, meetis ] =await Promise.all(consultas);

    res.render('home', {
        nombrePag: 'Inicio',
        categorias,
        meetis,
        moment
    });
}