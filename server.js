const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

require("dotenv").config({path:"./config.env"})
const login = require('./routes/login.route');
const webAction = require('./routes/webAction.route');
const adafruitAction = require('./routes/adafruitAction.route')

// Initialize express app
const app = express();

// Set port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Request logging

// API routes

app.use("/webAction",webAction);
app.use("/adafruitAction",adafruitAction);
app.use("/",login);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});