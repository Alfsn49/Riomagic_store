const { DataTypes, Model } = require('sequelize');
const { database2 } = require('../config/helpers.js');
const Users = require('./users.models.js');
const OrdersDetails = require('./orders_details.models.js');

class Orders extends Model {}

Orders.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Users,
                key: 'id'
            }
        },
    },
    {
        sequelize: database2,
        modelName: 'orders',
    }
);

Orders.belongsTo(Users, { foreignKey: 'user_id' });
Users.hasMany(Orders, { foreignKey: 'user_id' });


module.exports = Orders;
