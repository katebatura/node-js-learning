const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// eslint-disable-next-line import/extensions
const AppError = require('./src/utils/appError');
const globalErrorHandler = require('./src/controllers/errorController');
const userRouter = require('./src/routes/userRoutes');

const app = express();
app.use(express.json());
app.use(cors({ origin: true })); // enable origin cors

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.body);
  // console.log(req.headers);
  next();
});

// 3) ROUTES
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
