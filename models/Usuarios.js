const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');

const db = require('../config/db');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: Sequelize.STRING(60),
    imagen: Sequelize.STRING(70),
    descripcion: Sequelize.TEXT,
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            isEmail: { 
                msg: 'Agrega un correo valido'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        },
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no debe de ir vacio'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    tokenPassword: Sequelize.STRING,
    expiraToken: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = Usuarios.prototype.hashPassword(usuario.password);
        }
    }
});


/*
* la diferencia de los hooks y los prototype es que 
* en los prototype nosotros decidimos si usarlo y en que parte del codigo
* y los hooks simpre se va a ejecutar segun sea el tipo
*/
//comparar pass
Usuarios.prototype.validarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

Usuarios.prototype.hashPassword= function(password) {
    return  bcrypt.hashSync(password, bcrypt.genSaltSync(11), null);
}

module.exports = Usuarios;