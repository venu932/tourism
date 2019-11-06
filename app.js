const express = require('express');
const morgan = require('morgan');

const app = express();

const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const wrongRoutes = require('./routes/wrongRoutes');

const globalErrorHandler = require('./controller/errorController');

// 1 MIDDLEWARE

app.use(express.json()); //build-in middleware to get req.body ~ req.query

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //3rd party middleware to show log on console
}

// 2 ROUTES

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

app.all('*', wrongRoutes);

app.use(globalErrorHandler);
module.exports = app;
