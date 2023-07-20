const { DataTypes } = require('sequelize');
const { database2 } = require('../config/helpers.js');
const { Categoria } = require('./categories.models.js');

const Productos = database2.define('products', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255)
    },
    image: {
        type: DataTypes.STRING(255)
    },
    images: {
        type: DataTypes.TEXT
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.FLOAT
    },
    quantity: {
        type: DataTypes.INTEGER
    },
    short_desc: {
        type: DataTypes.STRING(255)
    }
});

Productos.belongsTo(Categoria, {
    as: 'Categoria',
    foreignKey: 'cat_id',
    sourceKey: 'id'
});

Categoria.hasMany(Productos, {
    as: 'Productos',
    foreignKey: 'cat_id',
    sourceKey: 'id'
});

module.exports = {
    Productos
};
