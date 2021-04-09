const Sequelize = require('sequelize');
const slug = require('slug');
const shortId = require('shortid');
const { v4: uuid } = require('uuid');

const db = require('../config/db');
const Usuarios = require('./Usuarios');
const Grupos = require('./Grupos');

const Meeti = db.define('meeti', {
    id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agregar un titulo'
            }
        }
    },
    slug: Sequelize.STRING,
    invitado: Sequelize.STRING,
    cupo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agregar una descripcion'
            }
        }
    },
    fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agregar una fecha para el Meeti'
            }
        }
    },
    hora: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agregar una hora para el Meeti'
            }
        }
    },
    direccion: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agregar una direccion'
            }
        }
    },
    ciudad: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agregar una ciudad para el Meeti'
            }
        }
    },
    estado: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agregar un estado para el Meeti'
            }
        }
    },
    pais: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agregar un país para el Meeti'
            }
        }
    },
    ubicacion: Sequelize.DataTypes.GEOMETRY('POINT'),
    interesados: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
    }
}, {
    hooks: {
        async beforeCreate(meeti){
            const url = slug(meeti.titulo).toLowerCase();
            meeti.slug = `${url}-${shortId.generate()}`;
            meeti.grupoId = meeti.grupoId.trim();//quita el espacio en final
        }
    }
});

Meeti.belongsTo(Usuarios);
Meeti.belongsTo(Grupos);

module.exports = Meeti;