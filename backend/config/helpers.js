const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'sns2001',
    database: 'db_riomagic'
});

const sequelize = new Sequelize('db_riomagic2', 'root', 'sns2001', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = {
    database: pool,
    database2: sequelize
};
