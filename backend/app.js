// Importing packages
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const routes = require('./routes');
const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();  // Initialize express application

app.use(morgan('dev'));  // Connects morgan middleware: used for logging info about requests and responses


app.use(cookieParser()); // Parses cookies
app.use(express.json()); // Parses JSON bodies of requests


// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

// Set the _csrf token and create req.csrfToken method
// Adds a _csrf cookie that is HTTP-only (JavaScript cannot read it)
app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
);

app.use(routes); // Connects all the routes

module.exports = app;
