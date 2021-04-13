const { Router } = require('express');

const homeC = require('../controllers/homeController');
const usuariosC = require('../controllers/usuariosController');
const authC = require('../controllers/authController');
const adminC = require('../controllers/adminController');
const grupC = require('../controllers/gruposController');
const meetiC = require('../controllers/meetiController');

//constroller del frontend
const meetiCFE = require('../controllers/frontend/meetiControllerFE');
const userCFE = require('../controllers/frontend/usuariosControllerFE');
const grupCFE = require('../controllers/frontend/gruposController');
const comenCFE = require('../controllers/frontend/comentariosController');


const router = Router();

module.exports = () => {

    /*Area Publica */
    router.get('/', homeC.home);

    //mostrar el meeti
    router.get('/meeti/:slug', meetiCFE.mostrarMeeti, );

    //confirma asistencia a meeti
    router.post('/confirmar-asistencia/:slug', meetiCFE.confirmarAsistencia, );

    //asistentes al meeti
    router.get('/asistentes/:slug', meetiCFE.mostrarAsistentes);

    //comentarios meet
    router.post('/meeti/:id', comenCFE.agregarComentario);

    //elimina comentarios
    router.post('/eliminar-comentario', comenCFE.eliminarComentario);

    //mostrar perfil 
    router.get('/usuarios/:id', userCFE.mostrarUsuario);

    //mostrar grupos
    router.get('/grupos/:id', grupCFE.mostrarGrupo);

    //mostrar meetis por categoria
    router.get('/categoria/:categoria', meetiCFE.mostrarCategoria);

    router.get('/crear-cuenta', usuariosC.formCrearCuenta);
    router.post('/crear-cuenta', usuariosC.crearCuenta);
    router.get('/confirmar-cuenta/:correo', usuariosC.confirmarCuenta);
    
    //inicar sesion
    router.get('/iniciar-sesion', usuariosC.formIniciarSesion);
    router.post('/iniciar-sesion', authC.authUser);

    //cerrar sesion
    router.get('/cerrar-sesion', authC.isAuth, authC.cerrarSesion);

    /*Area Privada */
    //admin
    router.get('/administracion', authC.isAuth, adminC.panelAdmin);

    //nuevo grupo
    router.get('/nuevo-grupo', authC.isAuth, grupC.formNuevoGrupo);
    router.post('/nuevo-grupo', authC.isAuth, grupC.subirImagen, grupC.crearNuevo);

    //editar grupos
    router.get('/editar-grupo/:grupoId', authC.isAuth, grupC.formEditar);
    router.post('/editar-grupo/:grupoId', authC.isAuth, grupC.editarData);

    router.get('/imagen-grupo/:grupoId', authC.isAuth, grupC.formImagen);
    router.post('/imagen-grupo/:grupoId', authC.isAuth, grupC.subirImagen, grupC.editarImagen);

    //eliminar grupo
    router.get('/eliminar-grupo/:grupoId', authC.isAuth, grupC.formEliminar);
    router.post('/eliminar-grupo/:grupoId', authC.isAuth, grupC.eliminar);

    //nuevo meeti
    router.get('/nuevo-meeti', authC.isAuth, meetiC.formNuevo);
    router.post('/nuevo-meeti', authC.isAuth, meetiC.sanitizar, meetiC.crearMeeti);

    //editar meeti
    router.get('/editar-meeti/:id', authC.isAuth, meetiC.formEditarMeeti);
    router.post('/editar-meeti/:id', authC.isAuth, meetiC.sanitizar, meetiC.editarData);

    //eliminar meeti
    router.get('/eliminar-meeti/:id', authC.isAuth, meetiC.formEliminar);
    router.post('/eliminar-meeti/:id', authC.isAuth, meetiC.eliminarData);

    //editar perfil 
    router.get('/editar-perfil/', authC.isAuth, usuariosC.formEditar);
    router.post('/editar-perfil/', authC.isAuth, usuariosC.sanitizar, usuariosC.editarPerfil);

    //cmabiar Pass
    router.get('/reset-pass', authC.isAuth, usuariosC.formCambiarPass);
    router.post('/reset-pass', authC.isAuth, usuariosC.cambiarPass);

    //imagen de perfil 
    router.get('/imagen-perfil', authC.isAuth, usuariosC.formImagen);
    router.post('/imagen-perfil', authC.isAuth, usuariosC.subirImagen, usuariosC.guardarImagen);

    return router;
}