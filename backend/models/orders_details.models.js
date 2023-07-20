/*const { DataTypes, Model } = require('sequelize');
const { database2 } = require('../config/helpers.js');
const Orders = require('./orders.models.js');
const Products = require('./products.models.js');

class OrdersDetails extends Model {}

OrdersDetails.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Orders,
                key: 'id'
            }
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Products,
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
        },
    },
    {
        sequelize: database2,
        modelName: 'orders_details',
    }
);

// En el modelo OrdersDetails
OrdersDetails.belongsTo(Orders, { foreignKey: 'order_id' });
Orders.hasMany(OrdersDetails, { foreignKey: 'order_id', as: 'orderDetails' });

OrdersDetails.belongsTo(Products, { foreignKey: 'product_id' });
Products.hasMany(OrdersDetails, { foreignKey: 'product_id', as: 'orderDetails' });


module.exports = OrdersDetails;*/
