const Sequelize = require('sequelize');
const db = require('../config/db');

const Categorias = db.define('categorias', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    nombre: Sequelize.TEXT,
    slug: Sequelize.TEXT
}, {
    timestamps: false //quitar los campos de creado y editar 
});

module.exports = Categorias;