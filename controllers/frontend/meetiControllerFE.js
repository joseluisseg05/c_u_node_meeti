const moment = require('moment');
const Sequelize = require('sequelize');

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

exports.confirmarAsistencia = async(req, res) => {
    const {accion} = req.body;

    if(accion === 'confirmar') {
        await Meeti.update(//actualizar un meet
            { 'interesados': //el campo a actualizar
                Sequelize.fn(//preparar para el uso de funciones propias de pg
                    'array_append', Sequelize.col('interesados'), //funcion y que columna afectara
                    req.user.id// el valor 
                )
            },
            {
                'where': { 'slug': req.params.slug }//condicion
            }
        );

        res.send('Has confirmado tu asistencia');
    } else {
        await Meeti.update(//actualizar un meet
            { 'interesados': //el campo a actualizar
                Sequelize.fn(//preparar para el uso de funciones propias de pg
                    'array_remove', Sequelize.col('interesados'), //funcion y que columna afectara
                    req.user.id// el valor 
                )
            },
            {
                'where': { 'slug': req.params.slug }//condicion
            }
        );

        res.send('Has cancelado tu asistencia');
    }
}

exports.mostrarAsistentes = async(req, res) =>{
    const meeti = await Meeti.findOne({
        where:{
            slug: req.params.slug
        },
        attributes: ['interesados']
    });
    const {interesados } = meeti;
    const asistentes = await Usuarios.findAll({
        attributes: ['nombre', 'imagen'],
        where: {id : interesados}
    });

    res.render('asistentes-meeti', {
        nombrePag: 'Listado de Asistentes Meeti',
        asistentes
    })
}