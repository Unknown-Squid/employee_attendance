require("dotenv").config();

const { Sequelize } = require("sequelize");

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_DIALECT = process.env.DB_DIALECT;

// Create a new Sequelize instance with your database details
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST, // Or your database server
  dialect: DB_DIALECT, // Change to 'mysql' or other dialects based on your database
});

module.exports = sequelize;
