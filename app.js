

const express = require('express');
const app = express();
const cors = require('cors');

require("dotenv").config({ quiet: true });
require("./config/db")();


const corsOptions = {
  origin: process.env.ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true

}
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));



const createError = require('http-errors');

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const AdminRouter = require('./routes/admin.routes');
const shopRouter = require('./routes/shop.routes')
const clientRouter = require('./routes/client.routes')
const orderRoutes = require('./routes/order.routes')


const favicon = require('serve-favicon')
const uploadRoot = process.env.UPLOAD_ROOT || path.join(__dirname, 'assets');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use('/public', express.static(uploadRoot));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', AdminRouter);
app.use('/shop', shopRouter);
app.use('/client', clientRouter);
app.use('/orders', orderRoutes);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).json({
    message: err.message || "Server error"

  });
});

module.exports = app;
