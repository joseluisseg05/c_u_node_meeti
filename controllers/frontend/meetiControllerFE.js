const moment = require('moment');
const {Sequelize, Op} = require('sequelize');

const Meeti = require('../../models/Meeti');
const Grupos = require('../../models/Grupos');
const Usuarios = require('../../models/Usuarios');
const Categorias = require('../../models/Categorias');
const Comentarios = require('../../models/Comentarios');

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

    //consultar meetis cercanos, genera un punto en un mapa interno
    const ubicacion = Sequelize.literal(`ST_GeomFromText( 'POINT(${meeti.ubicacion.coordinates[0]} ${meeti.ubicacion.coordinates[1]})')`);
    //la funcion retorna la distancia en metros 
    const distancia =Sequelize.fn('ST_DistanceSphere', Sequelize.col('ubicacion'), ubicacion);
    //encontrar meetis cercanos
    const cercanos = await Meeti.findAll({
        order: distancia, //ordena del mas cercano al mas lejano 
        where: Sequelize.where(distancia, { //obtinen el campo interno que se generara 
            [Op.lte] : 2000 //a menos de 2 kilometros
        }),
        limit: 3,
        offset: 1,//ignora el primero porque es en el que estoy ##chocan cuando distintos meetis en distintas fechas son en el mismo lugar
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

    const comentarios = await Comentarios.findAll({
        where: {
            meetiId: meeti.id
        },
        include: [
            {
                model: Usuarios,
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
    })

    res.render('mostrar-meeti', {
        nombrePag: meeti.titulo,
        meeti,
        moment,
        comentarios,
        cercanos
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

exports.mostrarCategoria = async(req, res, next) => {
    const categoria = await Categorias.findOne({
        where: {
            slug: req.params.categoria
        },
        attributes: ['id', 'nombre']
    });
    const meetis = await Meeti.findAll({
        include: [
            {
                model: Grupos,
                where: {
                    categoriaId: categoria.id
                }
            },
            {
                model: Usuarios
            }
        ],
        order: [
            ['fecha', 'ASC'],
            ['hora', 'ASC']
        ]
    });


    res.render('categoria', {
        nombrePag: `Categoria ${categoria.nombre}`,
        moment,
        meetis
    })
}