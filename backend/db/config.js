require("dotenv").config();
const mysql = require("mysql2");

const dbConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  connectionLimit: 10,
});
console.log(process.env.DB_PORT);
module.exports = dbConnection.promise()

