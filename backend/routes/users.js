var express = require('express');
var router = express.Router();
const { database } = require('../config/helpers');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRouter = require('./auth')
/*Registro de usuarios*/
router.use('/auth', authRouter);

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT users.username, users.email, users.fname, users.lname, users.age, rol.name AS role, users.id 
      FROM users 
      JOIN rol ON users.role = rol.id
    `;
    const connection = await database.getConnection();
    const [rows] = await connection.execute(query);
    connection.release();
    if (rows.length > 0) {
      res.json({ users: rows });
    } else {
      res.json({ message: 'NO USER FOUND' });
    }
  } catch (error) {
    res.json(error);
  }
});

/**
 * ROLE 777 = ADMIN
 * ROLE 555 = CUSTOMER
 */

/* GET ONE USER MATCHING ID */
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const query = 'SELECT username, email, fname, lname, age, role, id FROM users WHERE id = ?';
    const [rows] = await database.execute(query, [userId]);
    if (rows.length > 0) {
      res.json({ user: rows[0] });
    } else {
      res.json({ message: `NO USER FOUND WITH ID: ${userId}` });
    }
  } catch (error) {
    res.json(error);
  }
});

/* UPDATE USER DATA */
router.patch('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const [user] = await database.execute('SELECT * FROM users WHERE id = ?', [userId]);
    if (user.length > 0) {
      const {
        email = user[0].email,
        password = user[0].password,
        username = user[0].username,
        fname = user[0].fname,
        lname = user[0].lname,
        age = user[0].age,
      } = req.body;

      const query = 'UPDATE users SET email = ?, password = ?, username = ?, fname = ?, lname = ?, age = ? WHERE id = ?';
      await database.execute(query, [email, password, username, fname, lname, age, userId]);
      res.json('User updated successfully');
    } else {
      res.json({ message: `NO USER FOUND WITH ID: ${userId}` });
    }
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
