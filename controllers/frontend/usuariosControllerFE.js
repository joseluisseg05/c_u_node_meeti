

const Grupos = require('../../models/Grupos');
const Usuarios = require('../../models/Usuarios');

exports.mostrarUsuario = async (req, res, next) => {
    const consulta = [
        Usuarios.findOne({
            where: {
                id: req.params.id
            }
        }),
        Grupos.findAll({
            where: {
                usuarioId: req.params.id
            }
        })
    ];

    const [usuario, grupos ] = await Promise.all(consulta);

    if(!usuario){
        res.redirect('/');
        return next();
    }

    res.render('mostrar-perfil', {
        nombrePag: `Perfil de ${usuario.nombre}`,
        usuario,
        grupos 
    })
}