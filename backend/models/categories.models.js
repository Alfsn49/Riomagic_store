const { DataTypes} = require('sequelize');
const { database2 } = require('../config/helpers.js');

const Categoria =  database2.define('categories', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255)
    },
},
    {
        timestamps: false,
})

module.exports = {
    Categoria
};