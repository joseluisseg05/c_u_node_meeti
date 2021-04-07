const { Router } = require('express');

const homeC = require('../controllers/homeController');
const usuariosC = require('../controllers/usuariosController');
const authC = require('../controllers/authController');
const adminC = require('../controllers/adminController');
const grupC = require('../controllers/gruposController');

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

    return router;
}