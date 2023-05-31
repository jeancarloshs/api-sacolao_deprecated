const Sequelize = require("sequelize");
const fs = require("fs");
const mysql2 = require("mysql2");
const mysql = require("serverless-mysql");

const database = process.env.DATABASE;
const username = process.env.USER;
const password = process.env.PASSWORD;
const host = process.env.HOST;
const dialect = process.env.DIALECT || mysql2;
// const certificad = fs.readFileSync("{./DigiCertGlobalRootCA.crt.pem}")

const connection = new Sequelize(database, username, password, {
    host,
    dialect,
    dialectOptions: {
        options: {
          requestTimeout: 600000
        }
      },
    pool: {
        min: 0,
        acquire: 600000,
        idle: 20000
      },
      // ssl: {
      //   ca: certificad
      // }
})

// const connection = mysql({
//   config: {
//     host: host,
//     database: database,
//     user: username,
//     password: password,
//   },
// });

module.exports = connection;
