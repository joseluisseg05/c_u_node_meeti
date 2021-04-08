const { Router } = require('express');

const homeC = require('../controllers/homeController');
const usuariosC = require('../controllers/usuariosController');
const authC = require('../controllers/authController');
const adminC = require('../controllers/adminController');
const grupC = require('../controllers/gruposController');
const meetiC = require('../controllers/meetiController');

const router = Router();

module.exports = () => {

    router.get('/', homeC.home);

    router.get('/crear-cuenta', usuariosC.formCrearCuenta);
    router.post('/crear-cuenta', usuariosC.crearCuenta);
    router.get('/confirmar-cuenta/:correo', usuariosC.confirmarCuenta);
    
    //inicar sesion
    router.get('/iniciar-sesion', usuariosC.formIniciarSesion);
    router.post('/iniciar-sesion', authC.authUser);

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

    router.get('/nuevo-meeti', authC.isAuth, meetiC.formNuevo);

    return router;
}