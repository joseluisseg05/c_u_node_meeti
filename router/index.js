const { Router } = require('express');

const homeC = require('../controllers/homeController');
const usuariosC = require('../controllers/usuariosController');

const router = Router();

module.exports = () => {

    router.get('/', homeC.home);

    router.get('/crear-cuenta', usuariosC.formCrearCuenta);
    router.post('/crear-cuenta', usuariosC.crearCuenta);
    router.get('/confirmar-cuenta/:correo', usuariosC.confirmarCuenta);
    
    //inicar sesion
    router.get('/iniciar-sesion', usuariosC.formIniciarSesion);

    return router;
}