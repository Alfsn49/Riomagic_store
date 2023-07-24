const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');
const Orders = require('../models/orders.models');
const OrdersDetails = require('../models/orders_details.models');
const Products = require('../models/products.models');
const Users = require('../models/users.models');
const authenticateToken = require('../routes/authMiddleware');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

// GET ALL ORDERS
router.get('/', async (req, res) => {
    try {
        const [orders] = await database.query(`
            SELECT o.id, p.title, p.description, p.price, u.username
            FROM orders_details AS od
            INNER JOIN orders AS o ON o.id = od.order_id
            INNER JOIN products AS p ON p.id = od.product_id
            INNER JOIN users AS u ON u.id = o.user_id
        `);

        if (orders.length > 0) {
            res.json(orders);
        } else {
            res.json({ message: 'No orders found' });
        }
    } catch (error) {
        console.error('Error executing query:', error);
        res.json(error);
    }
});

// Get Single Order
router.get('/:id', async (req, res) => {
    let orderId = req.params.id;
    console.log(orderId);

    try {
        const [orders] = await database.query(`
            SELECT o.id, p.title as name, p.description, p.price, p.image, od.quantity as quantityOrdered, u.username 
            FROM orders_details AS od
            INNER JOIN orders AS o ON o.id = od.order_id
            INNER JOIN products AS p ON p.id = od.product_id
            inner join users as u On u.id = o.user_id
            WHERE o.id = ?
        `, [orderId]);

        if (orders.length > 0) {
            res.json(orders);
        } else {
            res.json({ message: 'No orders found' });
        }
    } catch (error) {
        console.error('Error executing query:', error);
        res.json(error);
    }
});

// Place New Order
router.post('/new', jsonParser, async (req, res) => {
    let { userId, products } = req.body;
    console.log(userId);
    console.log(products);

    if (userId !== null && userId > 0) {
        try {
            const [newOrderId] = await database.query('INSERT INTO orders (user_id) VALUES (?)', [userId]);

            if (newOrderId.insertId > 0) {
                for (const p of products) {
                    const [data] = await database.query('SELECT quantity FROM products WHERE id = ?', [p.id]);

                    let inCart = parseInt(p.incart);

                    if (data.length > 0) {
                        let quantity = data[0].quantity;
                        quantity -= inCart;

                        if (quantity < 0) {
                            quantity = 0;
                        }

                        const [newId] = await database.query('INSERT INTO orders_details (order_id, product_id, quantity) VALUES (?, ?, ?)', [newOrderId.insertId, p.id, inCart]);
                        await database.query('UPDATE products SET quantity = ? WHERE id = ?', [quantity, p.id]);
                    }
                }

                res.json({
                    message: `Order successfully placed with order id ${newOrderId.insertId}`,
                    success: true,
                    order_id: newOrderId.insertId,
                    products: products
                });
            } else {
                res.json({ message: 'New order failed while adding order details', success: false });
            }
        } catch (error) {
            console.error('Error executing query:', error);
            res.json({ message: 'New order failed', success: false });
        }
    } else {
        res.json({ message: 'New order failed', success: false });
    }
});

// Payment Gateway
router.post('/payment', async (req, res) => {
    setTimeout(() => {
        res.status(200).json({ success: true });
    }, 3000);
});



module.exports = router;
