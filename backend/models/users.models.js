// users.models.js
const { DataTypes, Model } = require('sequelize');
const { database2 } = require('../config/helpers.js');

class Users extends Model {}

Users.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(255),
        },
        password: {
            type: DataTypes.STRING(255),
        },
        email: {
            type: DataTypes.STRING(255),
        },
        fname: {
            type: DataTypes.STRING(255),
        },
        lname: {
            type: DataTypes.STRING(255),
        },
        age: {
            type: DataTypes.INTEGER,
        },
        role: {
            type: DataTypes.STRING(255),
        },
        photoUrl: {
            type: DataTypes.STRING(255),
        },
        type: {
            type: DataTypes.STRING(255),
        },
    },
    {
        sequelize: database2,
        modelName: 'users',
    }
);

module.exports = Users;
