const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { database } = require('../config/helpers');
const jwt = require('jsonwebtoken');
const router = express.Router();
router.use(express.json());
// Registro de usuarios
router.post(
    '/register',
    [
        // Aplicar las reglas de validación a los campos de entrada
        body('username').notEmpty().withMessage('El nombre de usuario es requerido'),
        body('email').isEmail().withMessage('El email no es válido'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('La contraseña debe tener al menos 6 caracteres'),
        body('fname')
            .notEmpty()
            .withMessage('El nombre es requerido')
            .isAlpha()
            .withMessage('El nombre solo puede contener letras'),
        body('lname')
            .notEmpty()
            .withMessage('El apellido es requerido')
            .isAlpha()
            .withMessage('El apellido solo puede contener letras'),
        body('age').notEmpty().withMessage('La edad es requerida').isInt().withMessage('La edad debe ser un número'),
        // Agrega más reglas de validación según tus requisitos
    ],
    async (req, res) => {
        try {
            // Verificar los errores de validación
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { username, email, password, fname, lname, age, role } = req.body;

            // Verificar si el usuario ya existe en la base de datos
            const [existingUser] = await database.execute('SELECT * FROM users WHERE username = ? OR email = ?', [
                username,
                email,
            ]);

            if (existingUser.length > 0) {
                return res.status(409).json({ message: 'El usuario ya existe' });
            }

            // Encriptar la contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insertar nuevo usuario en la base de datos
            const query =
                'INSERT INTO users (username, email, password, fname, lname, age, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const [result] = await database.execute(query, [
                username,
                email,
                hashedPassword,
                fname,
                lname,
                age,
                role,
            ]);

            if (result.affectedRows === 1) {
                res.status(201).json({ message: 'Usuario registrado exitosamente' });
            } else {
                res.status(500).json({ message: 'Error al registrar el usuario' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
);
//Login de la pagina
router.post('/login', [
        // Aplicar las reglas de validación a los campos de entrada
        body('email').isEmail().withMessage('El email no es válido'),
        body('password')
            .notEmpty()
            .withMessage('La contraseña es requerida'),
    ],
    async (req, res) => {
        try {
            // Verificar los errores de validación
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            // Buscar el usuario por email en la base de datos
            const [user] = await database.execute('SELECT * FROM users WHERE email = ?', [email]);

            if (user.length !== 1) {
                return res.status(401).json({ message: 'Usuario no encontrado' });
            }

            const storedUser = user[0];

            // Verificar la contraseña
            const isPasswordValid = await bcrypt.compare(password, storedUser.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }

            // Generar el token de autenticación
            const token = jwt.sign(
                {
                    userId: storedUser.id,
                    email: storedUser.email,
                    rol: storedUser.role,
                    username: storedUser.username
                },
                'secretfortoken', // Reemplaza por una clave secreta más segura
                { expiresIn: '1h' }
            );

            res.status(200).json({ token, userId: storedUser.id });
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
);


module.exports = router;
