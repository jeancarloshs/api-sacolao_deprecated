const Sequelize = require('sequelize')
const fs = require('fs')

const database = process.env.DATABASE
const username = process.env.USER
const password = process.env.PASSWORD
const host = process.env.HOST
const dialect = process.env.DIALECT
// const certificad = fs.readFileSync("{./DigiCertGlobalRootCA.crt.pem}")

// const hostname = process.env.hostname;
// const usernameAzure = process.env.usernameAzure;
// const passwordAzure = process.env.passwordAzure;
// const databaseAzure = process.env.databaseAzure;

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

module.exports = connection

// var conn=mysql.createConnection({host: hostname, user: usernameAzure, password: passwordAzure, database: databaseAzure, port:3306, ssl:{ca:fs.readFileSync("{ca-cert filename}")}});