const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers.js');
/* GET all products */
router.get('/', async (req, res) => {
    let page = req.query.page || 1;
    const limit = req.query.limit || 10;

    let startValue;
    let endValue;

    if (page > 0) {
        startValue = (page * limit) - limit;
        endValue = page * limit;
    } else {
        startValue = 0;
        endValue = 10;
    }

    try {
        const [results] = await database.query(`
            SELECT c.title AS categoria, p.title AS name, p.price, p.quantity, p.image, p.id, p.description
            FROM products AS p
                     INNER JOIN categories AS c ON c.id = p.cat_id
            ORDER BY p.id ASC
                LIMIT ?, ?
        `, [startValue, parseInt(limit)]);

        if (results.length > 0) {
            res.status(200).json({
                count: results.length,
                products: results
            });
        } else {
            res.json({ message: 'No hay productos' });
        }
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
});

/*GET single product*/
router.get('/:prodId', async(req,res)=>{

    let productId = req.params.prodId;
    console.log(productId)
    try {
        const [prod] = await database.query(`
      SELECT c.title AS category, p.title AS name, p.price, p.quantity, p.description, p.image, p.id, p.images
      FROM products AS p
      INNER JOIN categories AS c ON c.id = p.cat_id
      WHERE p.id = ?
      LIMIT 1
    `, [productId]);

        if (prod.length > 0) {
            res.status(200).json(prod[0]);
        } else {
            res.json({ message: `No product found with id ${productId}` });
        }
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Error fetching product' });
    }
});

/*GET ALL PRODUCTS FROM ONE PARTICULAR CATEGORY*/
router.get('/category/:catName', async (req, res)=>{
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;
    let startValue;
    let endValue;

    if (page > 0) {
        startValue = (page * limit) - limit;
        endValue = page * limit;
    } else {
        startValue = 0;
        endValue = 10;
    }

    const catTitle = req.params.catName;

    try {
        const prods = await database.query(`
      SELECT c.title AS category, p.title AS name, p.price, p.quantity, p.description, p.image, p.id
      FROM products AS p
      INNER JOIN categories AS c ON c.id = p.cat_id
      WHERE c.title LIKE '%${catTitle}%'
      ORDER BY p.id ASC
      LIMIT ?, ?
    `, [startValue, limit]);

        if (prods.length > 0) {
            res.status(200).json({
                count: prods.length,
                products: prods
            });
        } else {
            res.json({ message: `No products found matching the category ${catTitle}` });
        }
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
});


module.exports = router;

