const express = require('express');
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash');
const session =require('express-session');
const cookieParser = require('cookie-parser');

const path = require('path');

const router = require('./router');
const db = require('./config/db');
const passport = require('./config/passport');

db.sync().then(() => console.log('DB OK')).catch((error) => console.log(error));

require('dotenv').config({path: '.env'});
require('./models/Usuarios');
require('./models/Categorias');
require('./models/Grupos');

const app = express();

app.use(express.urlencoded({extends: true}));

app.use(expressLayouts)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static('public'));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//middlewares
app.use((req, res, next) => {
    res.locals.usuario = {...req.user} || null;
    res.locals.mensajes = req.flash();
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
})

app.use('/', router());

app.listen(process.env.PORT, () => {
    console.log('Servidor Online')
})

