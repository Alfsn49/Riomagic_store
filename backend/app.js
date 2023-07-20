const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders:'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}));


//Importar Rutas
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const orderRouter = require('./routes/orders');

//Usar rutas
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', orderRouter);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());


module.exports = app;