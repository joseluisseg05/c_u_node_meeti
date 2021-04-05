const express = require('express');
const expressLayouts = require('express-ejs-layouts')

const path = require('path');

const router = require('./router');
const db = require('./config/db');

db.sync().then(() => console.log('DB OK')).catch((error) => console.log(error));

require('dotenv').config({path: '.env'});
require('./models/Usuarios');

const app = express();

app.use(expressLayouts)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static('public'));

//middlewares
app.use((req, res, next) => {
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
})

app.use('/', router());

app.listen(process.env.PORT, () => {
    console.log('Servidor Online')
})

