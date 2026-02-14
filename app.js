const express = require('express');
const app = express();
const cors = require('cors');

require("dotenv").config();
require("./config/db")();


const corsOptions = {
  origin: process.env.ORIGIN,
  methods: ['GET', 'POST', 'PUT',  'DELETE'],
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
const authRouter = require('./routes/auth.routes');
const shopRouter = require('./routes/shop.routes')

const favicon = require('serve-favicon')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/shop', shopRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({
    message: err.message || "Server error"

  });
});

module.exports = app;
