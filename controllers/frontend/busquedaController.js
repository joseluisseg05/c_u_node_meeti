const { Op } = require('sequelize');
const moment = require('moment');

const Meeti = require('../../models/Meeti');
const Grupos = require('../../models/Grupos');
const Usuarios = require('../../models/Usuarios');

exports.resultados= async(req, res) => {
    const { categoria, titulo, ciudad, pais } = req.query;
    let meetis = '';
   
    if(categoria === '') {
        meetis = await Meeti.findAll({
            where: {
                titulo: { [Op.iLike]:'%' + titulo + '%'},
                ciudad: { [Op.iLike]:'%' + ciudad + '%'},
                pais: { [Op.iLike]:'%' + pais + '%'}
            },
            include: [
                {
                    model: Grupos,
                },
                {
                    model: Usuarios,
                    attributes: ['id', 'nombre', 'imagen']
                }
            ]
        });
    }
    else {
        meetis = await Meeti.findAll({
            where: {
                titulo: { [Op.iLike]:'%' + titulo + '%'},
                ciudad: { [Op.iLike]:'%' + ciudad + '%'},
                pais: { [Op.iLike]:'%' + pais + '%'}
            },
            include: [
                {
                    model: Grupos,
                    where:{
                        categoriaId : { [Op.eq]: categoria }
                    }
                },
                {
                    model: Usuarios,
                    attributes: ['id', 'nombre', 'imagen']
                }
            ]
        });
    }
    

    res.render('busqueda',{
        nombrePag: 'Resultados Búsqueda',
        meetis,
        moment
    })
}