const Comentarios = require('../../models/Comentarios')

exports.agregarComentario = async(req, res, next)=> {
    const { comentario } = req.body;

    await Comentarios.create({
        mensaje: comentario,
        usuarioId: req.user.id,
        meetiId: req.params.id
    })

    res.redirect('back');
    next()
}

exports.eliminarComentario = async (req, res, next) => {
    const { comentarioId } = req.body;
    const comentario = await Comentarios.findOne({
        where: {
            id: comentarioId
        }
    });

    if(!comentario) {
        res.status(404).send('Accion no valida');
        return next();
    }

    if(comentario.usuarioId === req.user.id){
        await Comentarios.destroy({
            where: {
                id: comentario.id
            }
        })
        res.status(200).send('Comentario Eliminado Correctamente');
        return next();
    } else {
        res.status(403).send('Accion no valida');
        return next();
    }
}